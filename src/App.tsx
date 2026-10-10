import { useEffect, useRef } from 'react';
import { Footer } from './components/layout/Footer';
import { Navbar } from './components/layout/Navbar';
import { AnalysisProvider } from './context/AnalysisContext';
import { useHashRoute } from './hooks/useHashRoute';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ReportPage } from './pages/ReportPage';

export default function App() {
  const route = useHashRoute();
  const mainRef = useRef<HTMLElement>(null);

  // On every page change: scroll to top and move focus to the content (accessibility).
  useEffect(() => {
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [route]);

  return (
    <AnalysisProvider>
      <a
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          mainRef.current?.focus();
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-neon-cyan focus:px-4 focus:py-2 focus:font-semibold focus:text-navy-900"
      >
        Skip to main content
      </a>
      <Navbar route={route} />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="outline-none">
        {route === 'home' && <LandingPage />}
        {route === 'dashboard' && <DashboardPage />}
        {route === 'analyzer' && <AnalyzerPage />}
        {route === 'report' && <ReportPage />}
        {route === 'privacy' && <PrivacyPage />}
        {route === 'not-found' && <NotFoundPage />}
      </main>
      <Footer />
    </AnalysisProvider>
  );
}
