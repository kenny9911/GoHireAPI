import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NavItem {
  title: string;
  href: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function DocsLayout() {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation: NavSection[] = [
    {
      title: t('docs.nav.gettingStarted', 'Getting Started'),
      items: [
        { title: t('docs.nav.overview', 'Overview'), href: '/docs/overview' },
        { title: t('docs.nav.quickStart', 'Quick Start'), href: '/docs/quick-start' },
        { title: t('docs.nav.authentication', 'Authentication'), href: '/docs/authentication' },
      ],
    },
    {
      title: t('docs.nav.apiReference', 'API Reference'),
      items: [
        { title: t('docs.nav.matchResume', 'Match Resume'), href: '/docs/api/match-resume' },
        { title: t('docs.nav.parseResume', 'Parse Resume'), href: '/docs/api/parse-resume' },
        { title: t('docs.nav.parseJd', 'Parse JD'), href: '/docs/api/parse-jd' },
        { title: t('docs.nav.inviteCandidate', 'Invite Candidate'), href: '/docs/api/invite-candidate' },
        { title: t('docs.nav.evaluateInterview', 'Evaluate Interview'), href: '/docs/api/evaluate-interview' },
      ],
    },
    {
      title: t('docs.nav.advanced', 'Advanced'),
      items: [
        { title: t('docs.nav.webhooks', 'Webhooks'), href: '/docs/webhooks' },
        { title: t('docs.nav.errors', 'Error Handling'), href: '/docs/errors' },
      ],
    },
  ];

  const currentSection = navigation.find(section =>
    section.items.some(item => location.pathname === item.href)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-600">
              <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>RoboHire</span>
            </Link>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600 font-medium">{t('docs.title', 'Documentation')}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('docs.search', 'Search docs...')}
                  className="w-64 px-4 py-2 pl-10 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <Link
              to="/api-playground"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            >
              {t('docs.playground', 'Playground')}
            </Link>
            <Link
              to="/dashboard/api-keys"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              {t('docs.getApiKey', 'Get API Key')}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-gray-50 border-r border-gray-200 pt-16 
          transform transition-transform duration-200 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-auto
        `}>
          <div className="h-full overflow-y-auto p-6">
            <nav className="space-y-8">
              {navigation.map((section) => (
                <div key={section.title}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    {section.title}
                  </h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <NavLink
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive
                                ? 'bg-indigo-50 text-indigo-700 font-medium'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`
                          }
                        >
                          {item.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            {/* Try It Section */}
            <div className="mt-8 p-4 bg-indigo-50 rounded-xl">
              <h4 className="font-medium text-indigo-900 mb-2">
                {t('docs.tryIt.title', 'Try it out')}
              </h4>
              <p className="text-sm text-indigo-700 mb-3">
                {t('docs.tryIt.description', 'Test the APIs interactively in our playground.')}
              </p>
              <Link
                to="/api-playground"
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                {t('docs.tryIt.cta', 'Open Playground')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 lg:ml-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            {currentSection && (
              <nav className="mb-6 text-sm">
                <ol className="flex items-center gap-2">
                  <li>
                    <Link to="/docs" className="text-gray-500 hover:text-gray-700">
                      {t('docs.title', 'Docs')}
                    </Link>
                  </li>
                  <li className="text-gray-400">/</li>
                  <li className="text-gray-500">{currentSection.title}</li>
                </ol>
              </nav>
            )}

            {/* Page Content */}
            <Outlet />

            {/* Footer Navigation */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  {/* Previous link would go here */}
                </div>
                <Link
                  to="/api-playground"
                  className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {t('docs.footer.tryPlayground', 'Try in Playground')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
