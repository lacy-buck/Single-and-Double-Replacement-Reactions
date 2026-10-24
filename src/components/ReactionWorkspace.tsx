import React, { useState, useEffect } from 'react';
import {
  ReactionProblem,
  ReactionType,
  StateOfMatter,
} from '../types/chemistry';
import {
  formatSpeciesList,
  formatChemicalFormula,
  validateProductPrediction,
  validateProductStates,
  validateCoefficients,
  getReactionTypeLabel,
  getFullEquation,
  REACTION_READINGS,
} from '../utils/chemistry';
import { SmartFormulaInput } from './SmartFormulaInput';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Flame,
  BookOpen,
  Info,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';

interface ReactionWorkspaceProps {
  mode: 'halogen_sr' | 'metal_sr' | 'double_replacement_ppt' | 'mixed';
  problems: ReactionProblem[];
  onOpenReference: () => void;
}

export const ReactionWorkspace: React.FC<ReactionWorkspaceProps> = ({
  mode,
  problems,
  onOpenReference,
}) => {
  const isMixedMode = mode === 'mixed';

  // Active problem selection
  const [problemIndex, setProblemIndex] = useState(0);
  const currentProblem = problems[problemIndex] || problems[0];

  // Reading Guide toggle (for first 3 tabs)
  const [isReadingExpanded, setIsReadingExpanded] = useState(true);

  // User input states
  const [selectedType, setSelectedType] = useState<ReactionType | null>(null);
  const [isTypeSubmitted, setIsTypeSubmitted] = useState(false);
  const [isTypeCorrect, setIsTypeCorrect] = useState<boolean | null>(null);

  const [predictedInput, setPredictedInput] = useState('');
  const [isDeclaredNoReaction, setIsDeclaredNoReaction] = useState(false);
  const [productFeedback, setProductFeedback] = useState<{ isCorrect: boolean; feedback: string } | null>(null);

  // States of matter selection for each product (starts unselected / null)
  const [selectedProductStates, setSelectedProductStates] = useState<(StateOfMatter | null)[]>([]);
  const [statesFeedback, setStatesFeedback] = useState<{ isCorrect: boolean; feedback: string } | null>(null);

  // Coefficients for reactants followed by products
  const [userCoeffs, setUserCoeffs] = useState<number[]>([]);
  const [balanceFeedback, setBalanceFeedback] = useState<{ isCorrect: boolean; feedback: string } | null>(null);

  // UI state
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [streak, setStreak] = useState(0);

  // Initialize or reset when problem changes
  useEffect(() => {
    if (!currentProblem) return;
    setSelectedType(null);
    setIsTypeSubmitted(!isMixedMode);
    setIsTypeCorrect(!isMixedMode ? true : null);
    setPredictedInput('');
    setIsDeclaredNoReaction(false);
    setProductFeedback(null);
    setSelectedProductStates(currentProblem.products.map(() => null));
    setStatesFeedback(null);
    setBalanceFeedback(null);
    setShowHint(false);
    setHintIndex(0);

    const initialCoeffs = [
      ...currentProblem.reactants.map(() => 1),
      ...(currentProblem.isNoReaction ? [] : currentProblem.products.map(() => 1)),
    ];
    setUserCoeffs(initialCoeffs);
  }, [currentProblem, isMixedMode]);

  if (!currentProblem) {
    return <div className="p-8 text-center text-slate-500">No problems available.</div>;
  }

  const readingGuide = !isMixedMode ? REACTION_READINGS[mode] : null;

  // 1. Step 1: Reaction Type (for mixed mode)
  const handleCheckType = (type: ReactionType) => {
    setSelectedType(type);
    setIsTypeSubmitted(true);
    const correct = type === currentProblem.type;
    setIsTypeCorrect(correct);
  };

  // 2. Step 2: Predicted Products
  const handleCheckProducts = () => {
    const result = validateProductPrediction(predictedInput, currentProblem, isDeclaredNoReaction);
    setProductFeedback(result);
  };

  // 3. Step 3: Verify States of Matter
  const handleCheckStates = () => {
    const result = validateProductStates(selectedProductStates, currentProblem);
    setStatesFeedback(result);
  };

  // 4. Step 4: Equation Balancing
  const handleCheckBalance = () => {
    const result = validateCoefficients(userCoeffs, currentProblem);
    setBalanceFeedback(result);
    if (result.isCorrect) {
      setStreak((s) => s + 1);
    }
  };

  const handleNextProblem = () => {
    setProblemIndex((prev) => (prev + 1) % problems.length);
  };

  // Stage calculations
  const step1Done = !isMixedMode || (isTypeSubmitted && isTypeCorrect === true);
  const step2Done = productFeedback?.isCorrect === true;
  const isNoReactionFinished = step2Done && currentProblem.isNoReaction;
  const step3Done = isNoReactionFinished || statesFeedback?.isCorrect === true;
  const step4Done = isNoReactionFinished || balanceFeedback?.isCorrect === true;

  // Reactants display (without leading coefficients initially)
  const reactantsDisplay = formatSpeciesList(currentProblem.reactants, false, true);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Educational Reading Section for the first 3 tabs */}
      {readingGuide && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <button
            onClick={() => setIsReadingExpanded(!isReadingExpanded)}
            className="w-full px-5 py-3.5 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-sm font-bold text-slate-900">{readingGuide.title}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
              <span>{isReadingExpanded ? 'Collapse Guide' : 'Read Guide'}</span>
              {isReadingExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {isReadingExpanded && (
            <div className="p-5 space-y-3.5 text-xs text-slate-700 border-t border-slate-200 bg-white">
              <div>
                <span className="font-bold text-slate-900">How to identify this reaction:</span>
                <p className="mt-0.5 text-slate-600 leading-relaxed">{readingGuide.howToIdentify}</p>
              </div>

              <div>
                <span className="font-bold text-slate-900">Key steps to predict products:</span>
                <ol className="list-decimal list-inside mt-1 space-y-1 text-slate-600">
                  {readingGuide.predictingSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-1">States of Matter Guide:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                    {readingGuide.statesOfMatterTips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg">
                  <span className="font-bold text-rose-900 block mb-1">When is it "No Reaction"?</span>
                  <p className="text-rose-800 text-[11px] leading-relaxed">{readingGuide.noReactionRule}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Top Banner / Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
            <span>{isMixedMode ? 'Mixed Reaction Practice' : getReactionTypeLabel(currentProblem.type)}</span>
            <span>·</span>
            <span>Problem {problemIndex + 1} of {problems.length}</span>
            {currentProblem.difficulty === 'challenge' && (
              <>
                <span>·</span>
                <span className="text-amber-800 font-bold">Challenge</span>
              </>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900">{currentProblem.title}</h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-800">
            <Flame className="w-4 h-4 text-amber-700" />
            <span>Streak: {streak}</span>
          </div>

          <button
            onClick={() => setProblemIndex(Math.floor(Math.random() * problems.length))}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Random</span>
          </button>
        </div>
      </div>

      {/* Transition Metal Charge Note (Specified whenever present) */}
      {currentProblem.transitionMetalChargeNote && (
        <div className="p-3.5 bg-blue-50/80 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2.5 shadow-2xs">
          <Zap className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <span className="font-bold">Transition Metal Ion Charge: </span>
            <span>{currentProblem.transitionMetalChargeNote}</span>
          </div>
        </div>
      )}

      {/* Progressive Step Tracker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div
          className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-colors ${
            step1Done
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-white border-blue-400 text-blue-900 shadow-xs'
          }`}
        >
          <span>1. {isMixedMode ? 'Reaction Type' : 'Type Confirmed'}</span>
          {step1Done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
        </div>

        <div
          className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-colors ${
            step2Done
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : step1Done
              ? 'bg-white border-blue-400 text-blue-900 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <span>2. Predict Products</span>
          {step2Done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
        </div>

        <div
          className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-colors ${
            step3Done
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : step2Done && !currentProblem.isNoReaction
              ? 'bg-white border-blue-400 text-blue-900 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <span>3. Select States</span>
          {step3Done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
        </div>

        <div
          className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-colors ${
            step4Done
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : step3Done && !currentProblem.isNoReaction
              ? 'bg-white border-blue-400 text-blue-900 shadow-xs'
              : 'bg-slate-50 border-slate-200 text-slate-400'
          }`}
        >
          <span>4. Balance Equation</span>
          {step4Done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {/* Reactants Equation Stage (mixed order) */}
        <div className="p-6 bg-slate-50/70 rounded-t-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Given Reactants (Mixed Order):
          </div>
          <div className="flex items-center flex-wrap gap-3 font-mono text-xl sm:text-2xl font-bold text-slate-900 bg-white p-4 rounded-lg border border-slate-200">
            <span>{reactantsDisplay}</span>
            <span className="text-blue-600">→</span>
            {step2Done ? (
              <span className={currentProblem.isNoReaction ? 'text-rose-600' : 'text-emerald-700'}>
                {currentProblem.isNoReaction
                  ? 'No Reaction'
                  : formatSpeciesList(currentProblem.products, false, step3Done)}
              </span>
            ) : (
              <span className="text-slate-400 italic font-sans text-base">? (Predict products below)</span>
            )}
          </div>
        </div>

        {/* STEP 1: Identify Reaction Type (for Mixed Mode) */}
        {isMixedMode && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 1</span>
                <h2 className="text-base font-bold text-slate-900">What type of reaction will this be?</h2>
              </div>
              {isTypeCorrect === true && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Correct Type</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { type: 'halogen_sr' as ReactionType, label: 'Halogen Single Replacement' },
                { type: 'metal_sr' as ReactionType, label: 'Metal Single Replacement' },
                { type: 'double_replacement_ppt' as ReactionType, label: 'Double Replacement (PPT)' },
              ].map((opt) => {
                const isSelected = selectedType === opt.type;
                const isThisTypeCorrect = currentProblem.type === opt.type;

                let btnStyle = 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/30';
                if (isTypeSubmitted) {
                  if (isSelected && isTypeCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500';
                  } else if (isSelected && !isTypeCorrect) {
                    btnStyle = 'bg-rose-50 border-rose-500 text-rose-900 ring-1 ring-rose-500';
                  } else if (isThisTypeCorrect && !isTypeCorrect) {
                    btnStyle = 'bg-emerald-50/50 border-emerald-300 text-emerald-800';
                  }
                } else if (isSelected) {
                  btnStyle = 'border-blue-600 bg-blue-50 text-blue-900';
                }

                return (
                  <button
                    key={opt.type}
                    disabled={isTypeCorrect === true}
                    onClick={() => handleCheckType(opt.type)}
                    className={`p-4 text-left rounded-lg border text-sm font-semibold transition-all ${btnStyle}`}
                  >
                    <div className="font-sans">{opt.label}</div>
                  </button>
                );
              })}
            </div>

            {isTypeSubmitted && isTypeCorrect === false && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-900 flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Not quite.</span> Look closely at the reactants: uncombined halogen + metal halide, lone metal + salt/acid, or two aqueous ionic compounds?
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Predict Products (or determine No Reaction) */}
        {step1Done && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 2</span>
                <h2 className="text-base font-bold text-slate-900">Predict the Products (or No Reaction)</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Type the predicted chemical formula(s) separated by (+), or click "Insert No Reaction".
                </p>
              </div>

              {step2Done && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Products Verified</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <SmartFormulaInput
                value={predictedInput}
                onChange={(val) => {
                  setPredictedInput(val);
                  setIsDeclaredNoReaction(/^(no\s*reaction|nr)$/i.test(val.trim()));
                  setProductFeedback(null);
                }}
                onSubmit={handleCheckProducts}
                disabled={step2Done}
                placeholder="e.g. 2NaCl + Br2 or AgCl + NaNO3"
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-blue-600 font-medium"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenReference}
                    className="text-xs text-blue-600 hover:text-blue-700 underline font-medium"
                  >
                    Check Reference Tables
                  </button>
                </div>

                {!step2Done && (
                  <button
                    type="button"
                    onClick={handleCheckProducts}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Check Formulas</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {showHint && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center justify-between">
                    <span>Hint {hintIndex + 1} of {currentProblem.hints.length}:</span>
                    {currentProblem.hints.length > 1 && (
                      <button
                        onClick={() => setHintIndex((prev) => (prev + 1) % currentProblem.hints.length)}
                        className="text-amber-800 underline font-semibold text-[11px]"
                      >
                        Next Hint
                      </button>
                    )}
                  </div>
                  <div>{currentProblem.hints[hintIndex]}</div>
                </div>
              )}

              {productFeedback && (
                <div
                  className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                    productFeedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {productFeedback.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">{productFeedback.feedback}</div>
                    {productFeedback.isCorrect && currentProblem.isNoReaction && (
                      <p className="mt-1 text-slate-700 font-sans">{currentProblem.explanation}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Select States of the Products (NEW REQUIREMENT!) */}
        {step2Done && !currentProblem.isNoReaction && (
          <div className="p-6 space-y-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 3</span>
                <h2 className="text-base font-bold text-slate-900">Select States of Matter for Products</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Now that formulas are verified, assign the correct state of matter: (s), (aq), (l), or (g) to each product.
                </p>
              </div>

              {step3Done && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>States Verified</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentProblem.products.map((prod, pIdx) => {
                const currentSelectedState = selectedProductStates[pIdx];
                return (
                  <div
                    key={`state-picker-${pIdx}`}
                    className="p-4 bg-white border border-slate-200 rounded-lg space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-bold text-slate-900">
                        {formatChemicalFormula(prod.formula)}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          currentSelectedState ? 'text-blue-700' : 'text-amber-600'
                        }`}
                      >
                        State: {currentSelectedState ? `(${currentSelectedState})` : '[ Click a state ]'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {(['aq', 's', 'l', 'g'] as const).map((st) => (
                        <button
                          key={st}
                          disabled={step3Done}
                          onClick={() => {
                            const next = [...selectedProductStates];
                            next[pIdx] = st;
                            setSelectedProductStates(next);
                            setStatesFeedback(null);
                          }}
                          className={`py-1.5 text-xs font-mono font-bold rounded border transition-colors ${
                            currentSelectedState === st
                              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          ({st})
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {!step3Done && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleCheckStates}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>Verify States</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {statesFeedback && (
              <div
                className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                  statesFeedback.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {statesFeedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{statesFeedback.feedback}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Balance Equation (unlocked when States verified) */}
        {step3Done && !currentProblem.isNoReaction && (
          <div className="p-6 space-y-4 bg-slate-50/40">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 4</span>
                <h2 className="text-base font-bold text-slate-900">Balance the Chemical Equation</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter integer coefficients for each reactant and product to balance atoms.
                </p>
              </div>

              {step4Done && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Balanced!</span>
                </div>
              )}
            </div>

            {/* Coefficient Balancer Line */}
            <div className="p-4 bg-white border border-slate-200 rounded-lg">
              <div className="flex items-center flex-wrap gap-2 text-base font-mono font-bold text-slate-900">
                {/* Reactants */}
                {currentProblem.reactants.map((reactant, rIdx) => {
                  return (
                    <React.Fragment key={`r-${rIdx}`}>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={userCoeffs[rIdx] || 1}
                          disabled={step4Done}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            const next = [...userCoeffs];
                            next[rIdx] = Math.max(1, val);
                            setUserCoeffs(next);
                            setBalanceFeedback(null);
                          }}
                          className="w-12 h-10 text-center font-mono font-bold text-base bg-blue-50/60 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100"
                        />
                        <span>{formatChemicalFormula(reactant.formula)}</span>
                        {reactant.state && (
                          <span className="text-xs text-slate-500 font-sans">({reactant.state})</span>
                        )}
                      </div>
                      {rIdx < currentProblem.reactants.length - 1 && <span className="text-slate-400">+</span>}
                    </React.Fragment>
                  );
                })}

                <span className="text-blue-600 px-2 font-bold text-xl">→</span>

                {/* Products with verified states */}
                {currentProblem.products.map((product, pIdx) => {
                  const coeffIdx = currentProblem.reactants.length + pIdx;
                  return (
                    <React.Fragment key={`p-${pIdx}`}>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="12"
                          value={userCoeffs[coeffIdx] || 1}
                          disabled={step4Done}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            const next = [...userCoeffs];
                            next[coeffIdx] = Math.max(1, val);
                            setUserCoeffs(next);
                            setBalanceFeedback(null);
                          }}
                          className="w-12 h-10 text-center font-mono font-bold text-base bg-blue-50/60 border border-slate-300 rounded focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100"
                        />
                        <span>{formatChemicalFormula(product.formula)}</span>
                        <span className="text-xs text-slate-500 font-sans">({product.state})</span>
                      </div>
                      {pIdx < currentProblem.products.length - 1 && <span className="text-slate-400">+</span>}
                    </React.Fragment>
                  );
                })}
              </div>

              {!step4Done && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleCheckBalance}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                  >
                    Verify Balanced Equation
                  </button>
                </div>
              )}

              {balanceFeedback && (
                <div
                  className={`mt-4 p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                    balanceFeedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {balanceFeedback.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold">{balanceFeedback.feedback}</div>
                    {balanceFeedback.isCorrect && (
                      <p className="mt-1 text-slate-700 font-sans">{currentProblem.explanation}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Completion Card */}
        {step4Done && (
          <div className="p-6 bg-emerald-50/50 rounded-b-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Reaction Completed!</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Final Equation: <span className="font-mono font-bold text-slate-900">{getFullEquation(currentProblem)}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleNextProblem}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>Next Reaction</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
