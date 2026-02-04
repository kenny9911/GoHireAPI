import { useTranslation } from 'react-i18next';

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      number: '01',
      title: t('landing.howItWorks.step1.title', 'Set Up Your Job Opening'),
      description: t('landing.howItWorks.step1.description', 'Describe your ideal candidate or upload a job description. Specify must-have skills and experience requirements.'),
    },
    {
      number: '02',
      title: t('landing.howItWorks.step2.title', 'Plug Into Your Workflow'),
      description: t('landing.howItWorks.step2.description', 'Integrate with your existing ATS via API or webhooks. No heavy lifting required.'),
    },
    {
      number: '03',
      title: t('landing.howItWorks.step3.title', 'Receive Best Matches'),
      description: t('landing.howItWorks.step3.description', 'Our AI screens every application, conducts interviews, and ranks candidates by fit.'),
    },
    {
      number: '04',
      title: t('landing.howItWorks.step4.title', 'Get Instant Reports'),
      description: t('landing.howItWorks.step4.description', 'Receive comprehensive evaluation reports via webhook with skills assessment and recommendations.'),
    },
  ];

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-medium text-indigo-600 uppercase tracking-wide mb-3">
            {t('landing.howItWorks.badge', 'How It Works')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {t('landing.howItWorks.title', 'Simple 4-Step Process')}
          </h2>
          <p className="text-lg text-gray-500">
            {t('landing.howItWorks.subtitle', 'AI acts as your hiring agent - screening resumes, interviewing candidates, and delivering evaluation reports.')}
          </p>
        </div>

        {/* Steps - Minimalist horizontal layout */}
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-4 left-full w-full h-px bg-gray-200" />
              )}

              {/* Step */}
              <div className="group">
                {/* Number */}
                <div className="text-4xl font-bold text-gray-200 group-hover:text-indigo-200 transition-colors mb-4">
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="text-base font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
