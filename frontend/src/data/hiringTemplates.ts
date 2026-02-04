import type { TFunction } from 'i18next';

export interface HiringTemplate {
  id: string;
  category: string;
  categoryLabel: string;
  categoryIcon: string;
  title: string;
  icon: string;
  description: string;
  requirements: string;
  skills: string[];
  experienceLevel: string;
  salaryRange?: string;
}

interface CategoryDefinition {
  id: string;
  nameKey: string;
  icon: string;
}

interface TemplateDefinition {
  id: string;
  category: string;
  icon: string;
  key: string;
}

const categoryDefinitions: CategoryDefinition[] = [
  { id: 'engineering', nameKey: 'hiring.categories.engineering', icon: '💻' },
  { id: 'product', nameKey: 'hiring.categories.product', icon: '📦' },
  { id: 'design', nameKey: 'hiring.categories.design', icon: '🎨' },
  { id: 'sales', nameKey: 'hiring.categories.sales', icon: '💼' },
  { id: 'marketing', nameKey: 'hiring.categories.marketing', icon: '📢' },
  { id: 'operations', nameKey: 'hiring.categories.operations', icon: '⚙️' },
  { id: 'finance', nameKey: 'hiring.categories.finance', icon: '💰' },
  { id: 'hr', nameKey: 'hiring.categories.hr', icon: '👥' },
];

const templateDefinitions: TemplateDefinition[] = [
  // Engineering
  { id: 'ai-software-engineer', category: 'engineering', icon: '🤖', key: 'hiring.templates.aiSoftwareEngineer' },
  { id: 'ai-llm-engineer', category: 'engineering', icon: '🧠', key: 'hiring.templates.aiLlmEngineer' },
  { id: 'full-stack-engineer', category: 'engineering', icon: '🧩', key: 'hiring.templates.fullStackEngineer' },
  { id: 'senior-software-engineer', category: 'engineering', icon: '👨‍💻', key: 'hiring.templates.seniorSoftwareEngineer' },
  { id: 'frontend-developer', category: 'engineering', icon: '🖥️', key: 'hiring.templates.frontendDeveloper' },
  { id: 'devops-engineer', category: 'engineering', icon: '🔧', key: 'hiring.templates.devopsEngineer' },
  { id: 'data-scientist', category: 'engineering', icon: '📊', key: 'hiring.templates.dataScientist' },

  // Product
  { id: 'product-manager', category: 'product', icon: '🎯', key: 'hiring.templates.productManager' },
  { id: 'scrum-master', category: 'product', icon: '🏃', key: 'hiring.templates.scrumMaster' },

  // Design
  { id: 'ux-designer', category: 'design', icon: '✏️', key: 'hiring.templates.uxDesigner' },
  { id: 'ui-designer', category: 'design', icon: '🎨', key: 'hiring.templates.uiDesigner' },

  // Sales
  { id: 'account-executive', category: 'sales', icon: '🤝', key: 'hiring.templates.accountExecutive' },
  { id: 'sales-engineer', category: 'sales', icon: '🔌', key: 'hiring.templates.salesEngineer' },

  // Marketing
  { id: 'marketing-manager', category: 'marketing', icon: '📣', key: 'hiring.templates.marketingManager' },
  { id: 'content-writer', category: 'marketing', icon: '✍️', key: 'hiring.templates.contentWriter' },

  // Operations
  { id: 'operations-manager', category: 'operations', icon: '📋', key: 'hiring.templates.operationsManager' },

  // Finance
  { id: 'financial-analyst', category: 'finance', icon: '📈', key: 'hiring.templates.financialAnalyst' },

  // HR
  { id: 'hr-manager', category: 'hr', icon: '👔', key: 'hiring.templates.hrManager' },
  { id: 'recruiter', category: 'hr', icon: '🔍', key: 'hiring.templates.technicalRecruiter' },
];

export function getLocalizedCategories(t: TFunction) {
  return categoryDefinitions.map((category) => ({
    id: category.id,
    name: t(category.nameKey),
    icon: category.icon,
  }));
}

export function getLocalizedTemplates(t: TFunction): HiringTemplate[] {
  const categoryLookup = new Map<string, CategoryDefinition>();
  categoryDefinitions.forEach((category) => categoryLookup.set(category.id, category));

  return templateDefinitions.map((template) => {
    const category = categoryLookup.get(template.category);
    const skills = t(`${template.key}.skills`, { returnObjects: true }) as string[];

    return {
      id: template.id,
      category: template.category,
      categoryLabel: category ? t(category.nameKey) : template.category,
      categoryIcon: category?.icon ?? '',
      title: t(`${template.key}.title`),
      icon: template.icon,
      description: t(`${template.key}.description`),
      requirements: t(`${template.key}.requirements`),
      skills: Array.isArray(skills) ? skills : [],
      experienceLevel: t(`${template.key}.experienceLevel`),
    };
  });
}

// Get templates by category
export function getTemplatesByCategory(
  templates: HiringTemplate[],
  categoryId: string
): HiringTemplate[] {
  return templates.filter((t) => t.category === categoryId);
}

// Get featured templates (one from each category)
export function getFeaturedTemplates(templates: HiringTemplate[]): HiringTemplate[] {
  const featured: HiringTemplate[] = [];
  const seenCategories = new Set<string>();

  for (const template of templates) {
    if (!seenCategories.has(template.category)) {
      featured.push(template);
      seenCategories.add(template.category);
    }
  }

  return featured;
}

// Search templates
export function searchTemplates(templates: HiringTemplate[], query: string): HiringTemplate[] {
  const lowerQuery = query.toLowerCase();
  return templates.filter(
    (t) =>
      t.title.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.skills.some((s) => s.toLowerCase().includes(lowerQuery)) ||
      t.categoryLabel.toLowerCase().includes(lowerQuery) ||
      t.category.toLowerCase().includes(lowerQuery)
  );
}
