/**
 * 主应用组件
 * 集成 Web3Provider、路由、导航
 */
import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Providers
import { Web3Provider } from "./providers/Web3Provider";

// Components - Layout
import { Navbar } from "./components/layout/Navbar";
import { MobileNav } from "./components/layout/MobileNav";

// Pages
import Marketplace from "./pages/Marketplace";
import Finance from "./pages/Finance";
import Governance from "./pages/Governance";
import Profile from "./pages/Profile";
import TaskDetail from "./pages/TaskDetail";
import CreateTask from "./pages/CreateTask";
import AgentRegister from "./pages/AgentRegister";

const App: React.FC = () => {
  return (
    <Web3Provider>
      <Router>
        <div className="relative min-h-screen bg-background-dark text-white selection:bg-primary/30 selection:text-primary">
          {/* 背景网格 */}
          <div className="fixed inset-0 z-0 pointer-events-none bg-tech-grid opacity-20" />

          {/* 顶部导航 */}
          <Navbar />

          {/* 主内容区 */}
          <main className="relative z-10 pt-4 pb-24 md:pb-10 min-h-[calc(100vh-64px)]">
            <PageTransition>
              <Routes>
                <Route path="/" element={<Marketplace />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/governance" element={<Governance />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/task/:id" element={<TaskDetail />} />
                <Route path="/create-task" element={<CreateTask />} />
                <Route path="/agent-register" element={<AgentRegister />} />
              </Routes>
            </PageTransition>
          </main>

          {/* 移动端底部导航 */}
          <MobileNav />

          {/* 页脚 */}
          <footer className="relative z-10 border-t border-white/5 py-10 mt-10 hidden md:block">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
              <p>© 2024 NexusHub DAO. All rights reserved.</p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="#" className="hover:text-primary transition-colors">
                  Docs
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </Web3Provider>
  );
};

/**
 * 页面切换动画组件
 */
const PageTransition: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default App;
