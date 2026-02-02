import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { ParsedResume, ParsedJD, MatchResult } from '../types/index.js';
import { logger } from './LoggerService.js';

interface StoredDocument<T> {
  id: string;
  hash: string;
  originalFilename: string;
  savedFilename: string;
  parsedAt: string;
  rawTextPreview: string;
  data: T;
}

interface StoredMatchResult {
  id: string;
  savedFilename: string;
  matchedAt: string;
  candidateName: string;
  jobTitle: string;
  overallScore: number;
  grade: string;
  recommendation: string;
  requestId?: string;
  data: MatchResult;
}

// Index file to track hash -> filename mappings for deduplication
interface HashIndex {
  [hash: string]: string; // hash -> filename
}

class DocumentStorageService {
  private baseDir: string;
  private resumesDir: string;
  private jdsDir: string;
  private matchResultsDir: string;
  private resumeIndexPath: string;
  private jdIndexPath: string;

  constructor() {
    this.baseDir = process.env.DOCUMENT_STORAGE_DIR || path.join(process.cwd(), 'parsed-documents');
    this.resumesDir = path.join(this.baseDir, 'resumes');
    this.jdsDir = path.join(this.baseDir, 'jds');
    this.matchResultsDir = path.join(this.baseDir, 'match-results');
    this.resumeIndexPath = path.join(this.resumesDir, '_index.json');
    this.jdIndexPath = path.join(this.jdsDir, '_index.json');
    
    this.initializeDirectories();
  }

  private initializeDirectories(): void {
    // Create directories if they don't exist
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
    if (!fs.existsSync(this.resumesDir)) {
      fs.mkdirSync(this.resumesDir, { recursive: true });
    }
    if (!fs.existsSync(this.jdsDir)) {
      fs.mkdirSync(this.jdsDir, { recursive: true });
    }
    if (!fs.existsSync(this.matchResultsDir)) {
      fs.mkdirSync(this.matchResultsDir, { recursive: true });
    }
    
    // Initialize index files if they don't exist
    if (!fs.existsSync(this.resumeIndexPath)) {
      fs.writeFileSync(this.resumeIndexPath, '{}', 'utf-8');
    }
    if (!fs.existsSync(this.jdIndexPath)) {
      fs.writeFileSync(this.jdIndexPath, '{}', 'utf-8');
    }
    
    console.log(`📂 Document storage initialized in: ${this.baseDir}`);
  }

  /**
   * Generate a hash from document content for deduplication
   */
  private generateHash(content: string): string {
    // Normalize content: trim, lowercase, remove extra whitespace
    const normalized = content.trim().toLowerCase().replace(/\s+/g, ' ');
    return crypto.createHash('sha256').update(normalized).digest('hex').substring(0, 16);
  }

  /**
   * Generate a unique ID for a document
   */
  private generateId(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}`;
  }

  /**
   * Decode filename to handle Chinese and other non-ASCII characters
   * Multer sometimes encodes filenames as Latin-1 when they should be UTF-8
   */
  private decodeFilename(filename: string): string {
    try {
      // Try to decode as UTF-8 from Latin-1 encoding
      // This handles the common case where Chinese characters are garbled
      const buffer = Buffer.from(filename, 'latin1');
      const decoded = buffer.toString('utf8');
      
      // Check if decoding produced valid UTF-8 (no replacement characters)
      if (!decoded.includes('\uFFFD') && decoded !== filename) {
        return decoded;
      }
    } catch {
      // Decoding failed, continue with original
    }
    
    try {
      // Try URL decoding for percent-encoded filenames
      const urlDecoded = decodeURIComponent(filename);
      if (urlDecoded !== filename) {
        return urlDecoded;
      }
    } catch {
      // URL decoding failed, continue with original
    }
    
    return filename;
  }

  /**
   * Convert original filename to JSON filename
   */
  private toJsonFilename(originalFilename: string): string {
    // Decode the filename to handle Chinese characters
    const decoded = this.decodeFilename(originalFilename);
    // Remove .pdf extension and add .json
    const baseName = decoded.replace(/\.pdf$/i, '');
    return `${baseName}.json`;
  }

  /**
   * Get unique filename if file already exists (append number)
   */
  private getUniqueFilename(dir: string, filename: string): string {
    let uniqueName = filename;
    let counter = 1;
    const baseName = filename.replace(/\.json$/, '');
    
    while (fs.existsSync(path.join(dir, uniqueName))) {
      uniqueName = `${baseName}_${counter}.json`;
      counter++;
    }
    
    return uniqueName;
  }

  /**
   * Load hash index
   */
  private loadIndex(indexPath: string): HashIndex {
    try {
      const content = fs.readFileSync(indexPath, 'utf-8');
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  /**
   * Save hash index
   */
  private saveIndex(indexPath: string, index: HashIndex): void {
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');
  }

  /**
   * Check if a JD with the same content already exists
   */
  findExistingJD(rawText: string): StoredDocument<ParsedJD> | null {
    const hash = this.generateHash(rawText);
    const index = this.loadIndex(this.jdIndexPath);
    
    if (index[hash]) {
      const filePath = path.join(this.jdsDir, index[hash]);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const stored = JSON.parse(content) as StoredDocument<ParsedJD>;
          logger.info('STORAGE', `Found existing parsed JD`, { hash, filename: index[hash] });
          return stored;
        } catch (error) {
          logger.warn('STORAGE', `Failed to read existing JD`, { hash, error: String(error) });
        }
      }
    }
    
    return null;
  }

  /**
   * Check if a resume with the same content already exists
   */
  findExistingResume(rawText: string): StoredDocument<ParsedResume> | null {
    const hash = this.generateHash(rawText);
    const index = this.loadIndex(this.resumeIndexPath);
    
    if (index[hash]) {
      const filePath = path.join(this.resumesDir, index[hash]);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');
          const stored = JSON.parse(content) as StoredDocument<ParsedResume>;
          logger.info('STORAGE', `Found existing parsed resume`, { hash, filename: index[hash] });
          return stored;
        } catch (error) {
          logger.warn('STORAGE', `Failed to read existing resume`, { hash, error: String(error) });
        }
      }
    }
    
    return null;
  }

  /**
   * Save a parsed JD with original filename
   */
  saveJD(rawText: string, parsedData: ParsedJD, originalFilename: string, requestId?: string): StoredDocument<ParsedJD> {
    const hash = this.generateHash(rawText);
    const id = this.generateId('jd');
    
    // Decode filename to properly handle Chinese characters
    const decodedFilename = this.decodeFilename(originalFilename);
    
    // Convert to JSON filename and ensure uniqueness
    const jsonFilename = this.toJsonFilename(originalFilename);
    const savedFilename = this.getUniqueFilename(this.jdsDir, jsonFilename);
    
    const stored: StoredDocument<ParsedJD> = {
      id,
      hash,
      originalFilename: decodedFilename,
      savedFilename,
      parsedAt: new Date().toISOString(),
      rawTextPreview: rawText.substring(0, 200) + (rawText.length > 200 ? '...' : ''),
      data: parsedData,
    };
    
    const filePath = path.join(this.jdsDir, savedFilename);
    
    try {
      // Save the document
      fs.writeFileSync(filePath, JSON.stringify(stored, null, 2), 'utf-8');
      
      // Update the hash index
      const index = this.loadIndex(this.jdIndexPath);
      index[hash] = savedFilename;
      this.saveIndex(this.jdIndexPath, index);
      
      logger.info('STORAGE', `Saved parsed JD`, { 
        id, 
        hash, 
        filename: savedFilename,
        title: parsedData.title 
      }, requestId);
    } catch (error) {
      logger.error('STORAGE', `Failed to save JD`, { hash, error: String(error) }, requestId);
    }
    
    return stored;
  }

  /**
   * Save a parsed resume with original filename
   */
  saveResume(rawText: string, parsedData: ParsedResume, originalFilename: string, requestId?: string): StoredDocument<ParsedResume> {
    const hash = this.generateHash(rawText);
    const id = this.generateId('resume');
    
    // Decode filename to properly handle Chinese characters
    const decodedFilename = this.decodeFilename(originalFilename);
    
    // Convert to JSON filename and ensure uniqueness
    const jsonFilename = this.toJsonFilename(originalFilename);
    const savedFilename = this.getUniqueFilename(this.resumesDir, jsonFilename);
    
    const stored: StoredDocument<ParsedResume> = {
      id,
      hash,
      originalFilename: decodedFilename,
      savedFilename,
      parsedAt: new Date().toISOString(),
      rawTextPreview: rawText.substring(0, 200) + (rawText.length > 200 ? '...' : ''),
      data: parsedData,
    };
    
    const filePath = path.join(this.resumesDir, savedFilename);
    
    try {
      // Save the document
      fs.writeFileSync(filePath, JSON.stringify(stored, null, 2), 'utf-8');
      
      // Update the hash index
      const index = this.loadIndex(this.resumeIndexPath);
      index[hash] = savedFilename;
      this.saveIndex(this.resumeIndexPath, index);
      
      logger.info('STORAGE', `Saved parsed resume`, { 
        id, 
        hash, 
        filename: savedFilename,
        name: parsedData.name 
      }, requestId);
    } catch (error) {
      logger.error('STORAGE', `Failed to save resume`, { hash, error: String(error) }, requestId);
    }
    
    return stored;
  }

  /**
   * Get all stored JDs
   */
  listJDs(): StoredDocument<ParsedJD>[] {
    const files = fs.readdirSync(this.jdsDir).filter(f => f.endsWith('.json') && f !== '_index.json');
    const jds: StoredDocument<ParsedJD>[] = [];
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(this.jdsDir, file), 'utf-8');
        jds.push(JSON.parse(content));
      } catch {
        // Skip invalid files
      }
    }
    
    return jds.sort((a, b) => new Date(b.parsedAt).getTime() - new Date(a.parsedAt).getTime());
  }

  /**
   * Get all stored resumes
   */
  listResumes(): StoredDocument<ParsedResume>[] {
    const files = fs.readdirSync(this.resumesDir).filter(f => f.endsWith('.json') && f !== '_index.json');
    const resumes: StoredDocument<ParsedResume>[] = [];
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(this.resumesDir, file), 'utf-8');
        resumes.push(JSON.parse(content));
      } catch {
        // Skip invalid files
      }
    }
    
    return resumes.sort((a, b) => new Date(b.parsedAt).getTime() - new Date(a.parsedAt).getTime());
  }

  /**
   * Sanitize filename by removing/replacing invalid characters
   */
  private sanitizeFilename(name: string): string {
    // Replace invalid filename characters with underscore
    // Keep Chinese/CJK characters, alphanumeric, spaces, hyphens, underscores
    return name
      .replace(/[<>:"/\\|?*]/g, '_')  // Replace invalid chars
      .replace(/\s+/g, '_')           // Replace spaces with underscore
      .replace(/_+/g, '_')            // Collapse multiple underscores
      .replace(/^_|_$/g, '')          // Remove leading/trailing underscores
      .substring(0, 100);             // Limit length
  }

  /**
   * Save a match result with filename based on candidate name and job title
   */
  saveMatchResult(result: MatchResult, requestId?: string): StoredMatchResult {
    const candidateName = result.resumeAnalysis?.candidateName || 'Unknown';
    const jobTitle = result.jdAnalysis?.jobTitle || 'Unknown';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    
    // Create filename: CandidateName_JobTitle_Timestamp.json
    const baseName = `${this.sanitizeFilename(candidateName)}_${this.sanitizeFilename(jobTitle)}_${timestamp}`;
    const filename = `${baseName}.json`;
    const savedFilename = this.getUniqueFilename(this.matchResultsDir, filename);
    
    const id = this.generateId('match');
    
    const stored: StoredMatchResult = {
      id,
      savedFilename,
      matchedAt: new Date().toISOString(),
      candidateName,
      jobTitle,
      overallScore: result.overallMatchScore?.score || 0,
      grade: result.overallMatchScore?.grade || 'N/A',
      recommendation: result.overallFit?.hiringRecommendation || 'N/A',
      requestId,
      data: result,
    };
    
    const filePath = path.join(this.matchResultsDir, savedFilename);
    
    try {
      fs.writeFileSync(filePath, JSON.stringify(stored, null, 2), 'utf-8');
      
      logger.info('STORAGE', `Saved match result`, {
        id,
        filename: savedFilename,
        candidateName,
        jobTitle,
        score: stored.overallScore,
        grade: stored.grade,
      }, requestId);
    } catch (error) {
      logger.error('STORAGE', `Failed to save match result`, { 
        error: String(error),
        candidateName,
        jobTitle,
      }, requestId);
    }
    
    return stored;
  }

  /**
   * Get all stored match results
   */
  listMatchResults(): StoredMatchResult[] {
    const files = fs.readdirSync(this.matchResultsDir).filter(f => f.endsWith('.json'));
    const results: StoredMatchResult[] = [];
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(this.matchResultsDir, file), 'utf-8');
        results.push(JSON.parse(content));
      } catch {
        // Skip invalid files
      }
    }
    
    return results.sort((a, b) => new Date(b.matchedAt).getTime() - new Date(a.matchedAt).getTime());
  }

  /**
   * Get storage statistics
   */
  getStats(): { resumeCount: number; jdCount: number; matchResultCount: number; storageDir: string } {
    const resumeFiles = fs.readdirSync(this.resumesDir).filter(f => f.endsWith('.json') && f !== '_index.json');
    const jdFiles = fs.readdirSync(this.jdsDir).filter(f => f.endsWith('.json') && f !== '_index.json');
    const matchFiles = fs.readdirSync(this.matchResultsDir).filter(f => f.endsWith('.json'));
    
    return {
      resumeCount: resumeFiles.length,
      jdCount: jdFiles.length,
      matchResultCount: matchFiles.length,
      storageDir: this.baseDir,
    };
  }

  /**
   * Get storage directory
   */
  getStorageDirectory(): string {
    return this.baseDir;
  }
}

// Singleton instance
export const documentStorage = new DocumentStorageService();
