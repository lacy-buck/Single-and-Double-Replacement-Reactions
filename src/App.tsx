import { useState } from 'react';
import { Header, AppTab } from './components/Header';
import { ReactionWorkspace } from './components/ReactionWorkspace';
import { HomeworkWorkspace } from './components/HomeworkWorkspace';
import { ReferenceDrawer } from './components/ReferenceDrawer';
import { REACTION_BANK } from './data/reactions';
import { getInterleavedMixedProblems } from './utils/chemistry';
import { Atom, ShieldCheck, FileCheck, BookOpen } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('halogen_sr');
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);

  const halogenProblems = REACTION_BANK.filter((r) => r.type === 'halogen_sr');
  const metalProblems = REACTION_BANK.filter((r) => r.type === 'metal_sr');
  const pptProblems = REACTION_BANK.filter((r) => r.type === 'double_replacement_ppt');
  const mixedProblems = getInterleavedMixedProblems();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans antialiased">
      {/* Top Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenReference={() => setIsReferenceOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Intro Strip */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-0.5">
              <Atom className="w-4 h-4" />
              <span>High School Chemistry Curriculum</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {currentTab === 'halogen_sr' && 'Halogen Single Replacement Practice'}
              {currentTab === 'metal_sr' && 'Metal Single Replacement Practice'}
              {currentTab === 'double_replacement_ppt' && 'Precipitation Double Replacement Practice'}
              {currentTab === 'mixed' && 'Mixed Reaction Mastery (3-Step Practice)'}
              {currentTab === 'homework' && 'Assigned Homework Assessment (6 Problems)'}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            {currentTab === 'mixed' && (
              <span className="flex items-center gap-1 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Step 1: Type · Step 2: Products · Step 3: Balance</span>
              </span>
            )}
            {currentTab === 'homework' && (
              <span className="flex items-center gap-1 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>6 Problems · PDF Report Export</span>
              </span>
            )}
            <button
              onClick={() => setIsReferenceOpen(true)}
              className="md:hidden flex items-center gap-1 text-blue-600 font-semibold underline"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>View Tables</span>
            </button>
          </div>
        </div>

        {/* View Switcher */}
        {currentTab === 'halogen_sr' && (
          <ReactionWorkspace
            key="halogen_sr"
            mode="halogen_sr"
            problems={halogenProblems}
            onOpenReference={() => setIsReferenceOpen(true)}
          />
        )}

        {currentTab === 'metal_sr' && (
          <ReactionWorkspace
            key="metal_sr"
            mode="metal_sr"
            problems={metalProblems}
            onOpenReference={() => setIsReferenceOpen(true)}
          />
        )}

        {currentTab === 'double_replacement_ppt' && (
          <ReactionWorkspace
            key="double_replacement_ppt"
            mode="double_replacement_ppt"
            problems={pptProblems}
            onOpenReference={() => setIsReferenceOpen(true)}
          />
        )}

        {currentTab === 'mixed' && (
          <ReactionWorkspace
            key="mixed"
            mode="mixed"
            problems={mixedProblems}
            onOpenReference={() => setIsReferenceOpen(true)}
          />
        )}

        {currentTab === 'homework' && (
          <HomeworkWorkspace onOpenReference={() => setIsReferenceOpen(true)} />
        )}
      </main>

      {/* Slide-Over Reference Drawer */}
      <ReferenceDrawer
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            ReactionLab · High School Inorganic Chemistry Reaction Practice & Homework
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsReferenceOpen(true)}
              className="hover:text-slate-900 underline transition-colors"
            >
              Activity Series & Solubility Charts
            </button>
            <span aria-hidden="true">·</span>
            <span>Honors & AP Chemistry Aligned</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
