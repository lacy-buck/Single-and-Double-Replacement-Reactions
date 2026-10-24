import React, { useState } from 'react';
import { X, Search, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  METAL_ACTIVITY_SERIES,
  HALOGEN_ELECTRONEGATIVITY_SERIES,
  SOLUBILITY_RULES,
} from '../utils/chemistry';

interface ReferenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferenceDrawer: React.FC<ReferenceDrawerProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'metals' | 'halogens' | 'solubility' | 'ions'>('metals');
  const [metalSearch, setMetalSearch] = useState('');

  // Interactive Solubility Tester
  const [testCation, setTestCation] = useState('Ag+');
  const [testAnion, setTestAnion] = useState('Cl-');

  if (!isOpen) return null;

  const filteredMetals = METAL_ACTIVITY_SERIES.filter(
    (m) =>
      m.name.toLowerCase().includes(metalSearch.toLowerCase()) ||
      m.symbol.toLowerCase().includes(metalSearch.toLowerCase())
  );

  // Quick solubility check calculator
  const checkSolubility = (cation: string, anion: string) => {
    // Group 1 or ammonium is always soluble
    if (['Na+', 'K+', 'Li+', 'NH4+'].includes(cation)) return { soluble: true, reason: 'All Group 1 (alkali) and ammonium salts are soluble.' };
    // Nitrate is always soluble
    if (anion === 'NO3-') return { soluble: true, reason: 'All nitrate salts are soluble.' };

    // Chlorides / Bromides / Iodides
    if (['Cl-', 'Br-', 'I-'].includes(anion)) {
      if (['Ag+', 'Pb2+', 'Hg2+'].includes(cation)) {
        return { soluble: false, reason: `Precipitate! Halides form insoluble precipitates with Ag⁺, Pb²⁺, and Hg₂²⁺.` };
      }
      return { soluble: true, reason: 'Halides are soluble with most cations.' };
    }

    // Sulfates
    if (anion === 'SO4 2-') {
      if (['Ba2+', 'Pb2+', 'Ca2+', 'Sr2+'].includes(cation)) {
        return { soluble: false, reason: 'Precipitate! Sulfates form insoluble precipitates with Ba²⁺, Pb²⁺, Ca²⁺, and Sr²⁺.' };
      }
      return { soluble: true, reason: 'Sulfates are generally soluble in water.' };
    }

    // Hydroxides
    if (anion === 'OH-') {
      if (['Na+', 'K+', 'Li+', 'Ba2+'].includes(cation)) {
        return { soluble: true, reason: 'Hydroxides are soluble with alkali metals and Ba²⁺.' };
      }
      return { soluble: false, reason: 'Precipitate! Most metal hydroxides are insoluble in water.' };
    }

    // Carbonates & Phosphates
    if (['CO3 2-', 'PO4 3-'].includes(anion)) {
      if (['Na+', 'K+', 'Li+', 'NH4+'].includes(cation)) {
        return { soluble: true, reason: 'Carbonates and phosphates are only soluble with Group 1 metals and NH₄⁺.' };
      }
      return { soluble: false, reason: 'Precipitate! Carbonates and phosphates are insoluble with transition and alkaline earth metals.' };
    }

    return { soluble: true, reason: 'Soluble in aqueous solution.' };
  };

  const testResult = checkSolubility(testCation, testAnion);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside
        aria-label="Chemistry Reference Tables"
        className="relative z-10 w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Chemistry Reference Charts</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close reference drawer"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-white px-2 pt-2 gap-1 overflow-x-auto">
          {[
            { id: 'metals', label: 'Metal Activity' },
            { id: 'halogens', label: 'Halogen Activity' },
            { id: 'solubility', label: 'Solubility Rules' },
            { id: 'ions', label: 'Polyatomic Ions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-2 text-xs font-semibold rounded-t-md transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* 1. Metal Activity Series */}
          {activeTab === 'metals' && (
            <div className="space-y-4">
              <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-lg text-xs text-blue-900">
                <span className="font-bold">Single Replacement Rule:</span> A metal can displace any metal (or hydrogen) that is <span className="underline font-semibold">below</span> it on this list from an aqueous compound. If the lone metal is below the bonded metal, <span className="font-semibold text-rose-700">NO REACTION</span> occurs.
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={metalSearch}
                  onChange={(e) => setMetalSearch(e.target.value)}
                  placeholder="Filter by symbol or name (e.g. Zn, Copper)..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 flex justify-between">
                  <span>Metal (Most Reactive at Top ↓)</span>
                  <span>Behavior & Reactivity</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto font-mono text-xs">
                  {filteredMetals.map((metal, index) => {
                    const isHydrogen = metal.symbol === '[H]';
                    return (
                      <div
                        key={metal.symbol}
                        className={`px-3 py-2 flex items-center justify-between ${
                          isHydrogen
                            ? 'bg-amber-50 font-bold text-amber-900 border-y border-amber-200'
                            : index < 6
                            ? 'bg-emerald-50/40'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-slate-600 font-sans w-5 text-right">{index + 1}.</span>
                          <span className="font-bold text-slate-900 text-sm">{metal.symbol}</span>
                          <span className="text-slate-600 font-sans">({metal.name})</span>
                        </div>
                        <span className="text-slate-600 font-sans text-xs max-w-xs text-right">
                          {metal.notes}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 2. Halogen Electronegativity Series */}
          {activeTab === 'halogens' && (
            <div className="space-y-4">
              <div className="bg-purple-50/70 border border-purple-200 p-3 rounded-lg text-xs text-purple-900">
                <span className="font-bold">Electronegativity Governs Halogen Replacement:</span> Halogen reactivity is determined by electronegativity (the ability to attract electrons to form halide anions). A halogen with <span className="underline font-semibold">higher electronegativity</span> displaces a halide ion with lower electronegativity. If the uncombined halogen has a lower electronegativity, <span className="font-semibold text-rose-700">NO REACTION</span> occurs.
              </div>

              <div className="space-y-2.5">
                {HALOGEN_ELECTRONEGATIVITY_SERIES.map((hal) => (
                  <div
                    key={hal.symbol}
                    className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between shadow-xs hover:border-purple-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                        #{hal.rank}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-base text-slate-900">{hal.symbol}</span>
                          <span className="text-xs text-slate-600">({hal.name})</span>
                          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                            EN: {hal.electronegativity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{hal.notes}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700">
                <span className="font-bold">Electronegativity Comparison Examples:</span>
                <ul className="list-disc list-inside mt-1 space-y-1 font-mono text-[11px]">
                  <li>Cl₂ + CaBr₂ → CaCl₂ + Br₂ (Cl: 3.16 &gt; Br: 2.96 → REACTION)</li>
                  <li>I₂ + CuCl₂ → No Reaction (I: 2.66 &lt; Cl: 3.16 → NO REACTION)</li>
                  <li>Br₂ + BaF₂ → No Reaction (Br: 2.96 &lt; F: 3.98 → NO REACTION)</li>
                </ul>
              </div>
            </div>
          )}

          {/* 3. Solubility Rules & Interactive Checker */}
          {activeTab === 'solubility' && (
            <div className="space-y-4">
              <div className="bg-teal-50/70 border border-teal-200 p-3 rounded-lg text-xs text-teal-900">
                <span className="font-bold">Precipitation Rule:</span> In double replacement, if both new combinations remain soluble (aq), <span className="font-semibold text-rose-700">NO REACTION</span> occurs because all ions remain spectator ions. A reaction only occurs if an <span className="underline font-semibold">insoluble precipitate (s)</span> forms.
              </div>

              {/* Interactive Solubility Tester Tool */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Interactive Precipitate Checker</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">Select Cation (+):</label>
                    <select
                      value={testCation}
                      onChange={(e) => setTestCation(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Ag+">Ag⁺ (Silver)</option>
                      <option value="Pb2+">Pb²⁺ (Lead)</option>
                      <option value="Ba2+">Ba²⁺ (Barium)</option>
                      <option value="Ca2+">Ca²⁺ (Calcium)</option>
                      <option value="Cu2+">Cu²⁺ (Copper)</option>
                      <option value="Fe3+">Fe³⁺ (Iron III)</option>
                      <option value="Na+">Na⁺ (Sodium)</option>
                      <option value="K+">K⁺ (Potassium)</option>
                      <option value="NH4+">NH₄⁺ (Ammonium)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 font-medium">Select Anion (-):</label>
                    <select
                      value={testAnion}
                      onChange={(e) => setTestAnion(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Cl-">Cl⁻ (Chloride)</option>
                      <option value="Br-">Br⁻ (Bromide)</option>
                      <option value="I-">I⁻ (Iodide)</option>
                      <option value="SO4 2-">SO₄²⁻ (Sulfate)</option>
                      <option value="CO3 2-">CO₃²⁻ (Carbonate)</option>
                      <option value="OH-">OH⁻ (Hydroxide)</option>
                      <option value="NO3-">NO₃⁻ (Nitrate)</option>
                      <option value="PO4 3-">PO₄³⁻ (Phosphate)</option>
                    </select>
                  </div>
                </div>

                <div
                  className={`p-2.5 rounded border text-xs flex items-start gap-2 ${
                    testResult.soluble
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {testResult.soluble ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">
                      {testResult.soluble ? 'SOLUBLE (aq) — Stays dissolved' : 'INSOLUBLE (s) — Forms Precipitate!'}
                    </div>
                    <div className="text-[11px] opacity-90 mt-0.5">{testResult.reason}</div>
                  </div>
                </div>
              </div>

              {/* Table of Rules */}
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-2 text-left">Ion Category</th>
                      <th className="p-2 text-left">General Status</th>
                      <th className="p-2 text-left">Exceptions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SOLUBILITY_RULES.map((rule, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 font-medium text-slate-900">{rule.category}</td>
                        <td className="p-2">
                          <span
                            className={`font-semibold ${
                              rule.isPrecipitate ? 'text-amber-700' : 'text-blue-700'
                            }`}
                          >
                            {rule.status}
                          </span>
                        </td>
                        <td className="p-2 text-slate-600 text-[11px]">{rule.exceptions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. Common Polyatomic Ions */}
          {activeTab === 'ions' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600">
                Formula charges for balancing ionic compounds in replacement reactions:
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { name: 'Nitrate', formula: 'NO₃⁻', charge: '-1' },
                  { name: 'Hydroxide', formula: 'OH⁻', charge: '-1' },
                  { name: 'Sulfate', formula: 'SO₄²⁻', charge: '-2' },
                  { name: 'Carbonate', formula: 'CO₃²⁻', charge: '-2' },
                  { name: 'Phosphate', formula: 'PO₄³⁻', charge: '-3' },
                  { name: 'Ammonium', formula: 'NH₄⁺', charge: '+1' },
                  { name: 'Acetate', formula: 'C₂H₃O₂⁻', charge: '-1' },
                  { name: 'Chlorate', formula: 'ClO₃⁻', charge: '-1' },
                ].map((ion) => (
                  <div
                    key={ion.name}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{ion.formula}</span>
                      <div className="font-sans text-[11px] text-slate-600">{ion.name}</div>
                    </div>
                    <span className="text-blue-700 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                      {ion.charge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Close Reference
          </button>
        </div>
      </aside>
    </div>
  );
};
