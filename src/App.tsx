import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ParticleBackground from '@/components/3d/ParticleBackground';

// Lazy load pages for better performance
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Skills = lazy(() => import('@/pages/Skills'));
const Projects = lazy(() => import('@/pages/Projects'));
const WeatherApp = lazy(() => import('@/pages/WeatherApp'));
const FitnessTracker = lazy(() => import('@/pages/FitnessTracker'));
const AnalyticsDashboard = lazy(() => import('@/pages/AnalyticsDashboard'));
const Contact = lazy(() => import('@/pages/Contact'));

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full"
      />
    </div>
  );
}

// Animated routes component
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <Home />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <About />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/skills"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <Skills />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/projects"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <Projects />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/weather"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <WeatherApp />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/fitness"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <FitnessTracker />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <AnalyticsDashboard />
              </Suspense>
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <Suspense fallback={<PageLoader />}>
                <Contact />
              </Suspense>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        {/* 3D Background */}
        <ParticleBackground />
        
        {/* Navigation */}
        <Navigation />
        
        {/* Main Content */}
        <main className="relative z-10">
          <AnimatedRoutes />
        </main>
        
        {/* Footer */}
        <footer className="relative z-10 py-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Lemuel. All rights reserved.
              </div>
              <div className="flex items-center gap-6">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-cyan-400 transition-colors text-sm"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-cyan-400 transition-colors text-sm"
                >
                  LinkedIn
                </a>
                <a
                  href="mailto:njorogelem@gmail.com"
                  className="text-gray-500 hover:text-cyan-400 transition-colors text-sm"
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
