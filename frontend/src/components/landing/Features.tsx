import { useTranslation } from 'react-i18next';

export default function Features() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('landing.features.aiScreening.title', 'AI Resume Screening'),
      description: t('landing.features.aiScreening.description', 'Our AI analyzes every resume against your requirements, identifying must-have skills and experience gaps.'),
    },
    {
      title: t('landing.features.autoInterviews.title', 'Automated Interviews'),
      description: t('landing.features.autoInterviews.description', 'AI conducts initial screening interviews 24/7, asking relevant questions and evaluating responses.'),
    },
    {
      title: t('landing.features.evalReports.title', 'Evaluation Reports'),
      description: t('landing.features.evalReports.description', 'Get comprehensive reports with skill assessments, interview analysis, and hiring recommendations.'),
    },
    {
      title: t('landing.features.timeSavings.title', '90% Time Savings'),
      description: t('landing.features.timeSavings.description', 'Stop spending hours reviewing mismatched candidates. Focus only on the best fits.'),
    },
    {
      title: t('landing.features.apiAccess.title', 'Developer API'),
      description: t('landing.features.apiAccess.description', 'Full REST API access for parsing, matching, and evaluation. Integrate AI hiring into your systems.'),
    },
    {
      title: t('landing.features.webhooks.title', 'Webhook Delivery'),
      description: t('landing.features.webhooks.description', 'Receive shortlisted candidates and evaluation reports automatically via webhooks.'),
    },
    {
      title: t('landing.features.multilingual.title', 'Multilingual Support'),
      description: t('landing.features.multilingual.description', 'Support for 7 languages including English, Chinese, Japanese, Spanish, French, Portuguese, and German.'),
    },
    {
      title: t('landing.features.cheatingDetection.title', 'Cheating Detection'),
      description: t('landing.features.cheatingDetection.description', 'Advanced AI analysis to detect AI-assisted answers, ensuring genuine candidate evaluation.'),
    },
  ];

  return (
    <section id="features" className="py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide mb-3">
            {t('landing.features.badge', 'Features')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.features.title', 'Everything You Need to Hire Smarter')}
          </h2>
          <p className="text-lg text-gray-500">
            {t('landing.features.subtitle', 'From AI screening to automated interviews, we provide all the tools to transform your hiring process.')}
          </p>
        </div>

        {/* Features Grid - Minimalist */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {features.map((feature, index) => (
            <div key={index} className="group">
              {/* Accent dot */}
              <div className="w-2 h-2 rounded-full bg-indigo-500 mb-4 group-hover:scale-150 transition-transform" />
              
              {/* Content */}
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
