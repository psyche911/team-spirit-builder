import React, { useState } from 'react';
import { Users, Trophy, Layers, Settings, Github } from 'lucide-react';
import InputSection from './components/InputSection';
import PrizeDraw from './components/PrizeDraw';
import Grouping from './components/Grouping';
import { Person, AppMode } from './types';

const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [mode, setMode] = useState<AppMode>(AppMode.INPUT);

  const renderContent = () => {
    switch (mode) {
      case AppMode.INPUT:
        return <InputSection people={people} setPeople={setPeople} />;
      case AppMode.DRAW:
        return <PrizeDraw people={people} />;
      case AppMode.GROUP:
        return <Grouping people={people} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                  TeamSpirit
                </h1>
                <p className="text-xs text-slate-500 font-medium">HR Toolkit</p>
              </div>
            </div>
            
            {/* Nav Tabs */}
            <nav className="flex space-x-1 sm:space-x-4 items-center">
              <button
                onClick={() => setMode(AppMode.INPUT)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  mode === AppMode.INPUT
                    ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Lists & Input</span>
                <span className="inline sm:hidden">Input</span>
                <span className="bg-slate-200 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                  {people.length}
                </span>
              </button>

              <button
                onClick={() => setMode(AppMode.DRAW)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  mode === AppMode.DRAW
                    ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden sm:inline">Prize Draw</span>
                <span className="inline sm:hidden">Draw</span>
              </button>

              <button
                onClick={() => setMode(AppMode.GROUP)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  mode === AppMode.GROUP
                    ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Grouping</span>
                <span className="inline sm:hidden">Groups</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} TeamSpirit HR Tools.</p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0">
             <span>Secure. Private. Local Processing.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
