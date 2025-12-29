
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'train', label: 'Train', icon: '💪' },
    { id: 'review', label: 'Review', icon: '🔁' },
    { id: 'stats', label: 'Stats', icon: '📈' },
    { id: 'chat', label: 'AI Tutor', icon: '🤖' }
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-white shadow-xl relative overflow-hidden">
      <header className="px-6 py-4 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Memora</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-bold">
            🔥 4
          </span>
          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-medium text-xs">
            L1
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 px-6 pt-6">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t flex justify-around py-3 px-4 z-50">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
