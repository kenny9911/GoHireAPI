import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function CTA() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="py-24 lg:py-32 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Content */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          {t('landing.cta.title', 'Ready to Hire Smarter?')}
        </h2>
        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
          {t('landing.cta.subtitle', 'Join hundreds of companies using AI to find elite candidates faster. Start your free trial today.')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/start-hiring')}
            type="button"
            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl transition-all duration-200 hover:bg-gray-100 shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_0_rgba(255,255,255,0.2)]"
          >
            {t('landing.cta.primary', 'Start Easy Hiring')}
          </button>
          <button
            onClick={() => navigate('/login')}
            type="button"
            className="w-full sm:w-auto px-8 py-4 text-white font-semibold rounded-xl border border-gray-700 transition-all duration-200 hover:border-gray-500 hover:bg-gray-800"
          >
            {t('landing.cta.secondary', 'Talk to Sales')}
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t('landing.cta.benefit1', 'No credit card required')}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t('landing.cta.benefit2', '14-day free trial')}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {t('landing.cta.benefit3', 'Cancel anytime')}
          </span>
        </div>
      </div>
    </section>
  );
}
