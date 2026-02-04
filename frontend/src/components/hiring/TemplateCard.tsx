import { useTranslation } from 'react-i18next';
import type { HiringTemplate } from '../../data/hiringTemplates';

interface TemplateCardProps {
  template: HiringTemplate;
  onSelect: (template: HiringTemplate) => void;
  compact?: boolean;
}

export default function TemplateCard({ template, onSelect, compact = false }: TemplateCardProps) {
  const { t } = useTranslation();

  if (compact) {
    return (
      <button
        onClick={() => onSelect(template)}
        className="group flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-left"
      >
        <span className="text-2xl">{template.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 truncate">
            {template.title}
          </h4>
          <p className="text-xs text-gray-500 truncate">{template.experienceLevel}</p>
        </div>
        <svg
          className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  return (
    <div
      onClick={() => onSelect(template)}
      className="group relative bg-white rounded-2xl border border-gray-200 p-5 cursor-pointer hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50 transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Category Badge */}
      <div className="absolute -top-2 right-4">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
          {template.categoryIcon} {template.categoryLabel}
        </span>
      </div>

      {/* Icon and Title */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{template.icon}</span>
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {template.title}
          </h3>
          <p className="text-sm text-gray-500">{template.experienceLevel}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {template.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-md"
          >
            {skill}
          </span>
        ))}
        {template.skills.length > 4 && (
          <span className="px-2 py-0.5 text-xs font-medium text-gray-400">
            +{template.skills.length - 4}
          </span>
        )}
      </div>

      {/* Use Template Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(template);
        }}
        className="w-full py-2 px-4 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors group-hover:bg-indigo-600 group-hover:text-white"
      >
        {t('hiring.useTemplate', 'Use Template')}
      </button>
    </div>
  );
}
