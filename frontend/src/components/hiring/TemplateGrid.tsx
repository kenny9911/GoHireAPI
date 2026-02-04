import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import TemplateCard from './TemplateCard';
import {
  getLocalizedCategories,
  getLocalizedTemplates,
  getTemplatesByCategory,
  searchTemplates,
  type HiringTemplate,
} from '../../data/hiringTemplates';

interface TemplateGridProps {
  onSelectTemplate: (template: HiringTemplate) => void;
  showSearch?: boolean;
  maxItems?: number;
}

export default function TemplateGrid({
  onSelectTemplate,
  showSearch = true,
  maxItems,
}: TemplateGridProps) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const localizedTemplates = getLocalizedTemplates(t);
  const localizedCategories = getLocalizedCategories(t);

  // Filter templates
  let filteredTemplates = localizedTemplates;

  if (searchQuery) {
    filteredTemplates = searchTemplates(localizedTemplates, searchQuery);
  } else if (selectedCategory) {
    filteredTemplates = getTemplatesByCategory(localizedTemplates, selectedCategory);
  }

  if (maxItems) {
    filteredTemplates = filteredTemplates.slice(0, maxItems);
  }

  return (
    <div className="space-y-6">
      {/* Search and Category Filter */}
      {showSearch && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setSelectedCategory(null);
              }}
              placeholder={t('hiring.searchTemplates', 'Search templates...')}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${
                !selectedCategory && !searchQuery
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t('hiring.allCategories', 'All')}
            </button>
            {localizedCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors flex items-center gap-1 ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} onSelect={onSelectTemplate} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {t('hiring.noTemplatesFound', 'No templates found')}
          </h3>
          <p className="text-gray-500">
            {t('hiring.tryDifferentSearch', 'Try a different search term or category')}
          </p>
        </div>
      )}

      {/* Results Count */}
      {showSearch && (
        <p className="text-sm text-gray-500 text-center">
          {t('hiring.showingTemplates', 'Showing {{count}} templates', {
            count: filteredTemplates.length,
          })}
        </p>
      )}
    </div>
  );
}
