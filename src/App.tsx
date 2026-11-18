import { useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { Header, type RoutePath } from './components/Header';
import { QuickDonateModal } from './components/QuickDonateModal';
import { AboutPage } from './pages/AboutPage';
import { BoardPage } from './pages/BoardPage';
import { ContactPage } from './pages/ContactPage';
import { DonatePage } from './pages/DonatePage';
import { GalleryPage } from './pages/GalleryPage';
import { HomePage } from './pages/HomePage';
import { ProgramsPage } from './pages/ProgramsPage';
import { UpdatesPage } from './pages/UpdatesPage';

const VALID_PATHS: RoutePath[] = [
  '/',
  '/about',
  '/board',
  '/programs',
  '/gallery',
  '/updates',
  '/donate',
  '/contact',
];

function resolveInitialRoute(): RoutePath {
  const hashPath = window.location.hash.replace(/^#/, '').split('?')[0] as RoutePath;
  if (VALID_PATHS.includes(hashPath)) return hashPath;
  const pathname = window.location.pathname as RoutePath;
  if (VALID_PATHS.includes(pathname)) return pathname;
  return '/';
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<RoutePath>(resolveInitialRoute);
  const [selectedUpdateSlug, setSelectedUpdateSlug] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [quickDonateOpen, setQuickDonateOpen] = useState(false);
  const [quickDonateProgramId, setQuickDonateProgramId] = useState<string | null>(null);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(resolveInitialRoute());
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onPopState);
    };
  }, []);

  const navigate = (
    path: RoutePath,
    opts?: { updateSlug?: string; programId?: string }
  ) => {
    setSelectedUpdateSlug(opts?.updateSlug ?? null);
    setSelectedProgramId(opts?.programId ?? null);
    setCurrentPath(path);
    const targetHash = path === '/' ? '#/' : `#${path}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openQuickDonate = (programId?: string) => {
    setQuickDonateProgramId(programId ?? null);
    setQuickDonateOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#181A18] overflow-x-clip">
      <Header currentPath={currentPath} onNavigate={(path) => navigate(path)} />

      <main className="flex-1">
        {currentPath === '/' && (
          <HomePage onNavigate={navigate} onQuickDonate={openQuickDonate} />
        )}
        {currentPath === '/about' && <AboutPage onNavigate={(path) => navigate(path)} />}
        {currentPath === '/board' && <BoardPage onNavigate={(path) => navigate(path)} />}
        {currentPath === '/programs' && <ProgramsPage onNavigate={navigate} />}
        {currentPath === '/gallery' && (
          <GalleryPage onNavigate={navigate} onQuickDonate={openQuickDonate} />
        )}
        {currentPath === '/updates' && (
          <UpdatesPage
            initialSlug={selectedUpdateSlug}
            onNavigate={(path) => navigate(path)}
          />
        )}
        {currentPath === '/donate' && <DonatePage initialProgramId={selectedProgramId} />}
        {currentPath === '/contact' && <ContactPage onNavigate={(path) => navigate(path)} />}
      </main>

      <Footer onNavigate={(path) => navigate(path)} />

      <QuickDonateModal
        open={quickDonateOpen}
        initialDesignationId={quickDonateProgramId}
        onClose={() => setQuickDonateOpen(false)}
        onOpenFullPortal={(programId) => navigate('/donate', { programId })}
      />
    </div>
  );
}
