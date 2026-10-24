import React, { useState } from 'react';
import { ReactionProblem, ReactionType, HomeworkSession, ProblemAttempt, StateOfMatter } from '../types/chemistry';
import {
  getHomeworkSet,
  formatSpeciesList,
  formatChemicalFormula,
  validateProductPrediction,
  validateProductStates,
  validateCoefficients,
  getReactionTypeLabel,
  getFullEquation,
} from '../utils/chemistry';
import { exportHomeworkPdf } from '../utils/generatePdf';
import { SmartFormulaInput } from './SmartFormulaInput';
import {
  FileText,
  Download,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Award,
  Zap,
} from 'lucide-react';

interface HomeworkWorkspaceProps {
  onOpenReference: () => void;
}

export const HomeworkWorkspace: React.FC<HomeworkWorkspaceProps> = ({ onOpenReference }) => {
  const [session, setSession] = useState<HomeworkSession | null>(null);
  const [studentNameInput, setStudentNameInput] = useState('');

  // Current problem interaction state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedType, setSelectedType] = useState<ReactionType | null>(null);
  const [predictedInput, setPredictedInput] = useState('');
  const [isDeclaredNoReaction, setIsDeclaredNoReaction] = useState(false);
  const [productFeedback, setProductFeedback] = useState<{ isCorrect: boolean; feedback: string } | null>(null);

  // Product states selection (starts unselected / null)
  const [selectedProductStates, setSelectedProductStates] = useState<(StateOfMatter | null)[]>([]);
  const [statesFeedback, setStatesFeedback] = useState<{ isCorrect: boolean; feedback: string } | null>(null);

  // Coefficients
  const [userCoeffs, setUserCoeffs] = useState<number[]>([]);
  const [balanceFeedback, setBalanceFeedback] = useState<{ isCorrect: boolean; feedback: string } | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Start new homework session (randomly assigned set)
  const handleStartHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNameInput.trim()) return;

    // Randomly assign one of the 4 question sets
    const assignedSetNumber = Math.floor(Math.random() * 4) + 1;
    const problems = getHomeworkSet(assignedSetNumber);

    const initialAttempts: Record<string, ProblemAttempt> = {};
    problems.forEach((p) => {
      initialAttempts[p.id] = {
        problemId: p.id,
        predictedProducts: '',
        isDeclaredNoReaction: false,
        userProductStates: p.products.map(() => null),
        userCoefficients: [
          ...p.reactants.map(() => 1),
          ...(p.isNoReaction ? [] : p.products.map(() => 1)),
        ],
        isCompleted: false,
        attemptsCount: 0,
      };
    });

    const newSession: HomeworkSession = {
      studentName: studentNameInput.trim(),
      setNumber: assignedSetNumber,
      startedAt: new Date().toISOString(),
      problems,
      attempts: initialAttempts,
      currentIndex: 0,
      isFinished: false,
    };

    setSession(newSession);
    setCurrentIdx(0);
    loadProblemState(problems[0], initialAttempts[problems[0].id]);
  };

  const loadProblemState = (problem: ReactionProblem, attempt?: ProblemAttempt) => {
    setSelectedType(attempt?.identifiedType || null);
    setPredictedInput(attempt?.predictedProducts || '');
    setIsDeclaredNoReaction(attempt?.isDeclaredNoReaction || false);
    setSelectedProductStates(
      attempt?.userProductStates?.length
        ? attempt.userProductStates
        : problem.products.map(() => null)
    );
    setUserCoeffs(
      attempt?.userCoefficients?.length
        ? attempt.userCoefficients
        : [
            ...problem.reactants.map(() => 1),
            ...(problem.isNoReaction ? [] : problem.products.map(() => 1)),
          ]
    );
    setProductFeedback(
      attempt?.isProductsCorrect !== undefined
        ? {
            isCorrect: attempt.isProductsCorrect,
            feedback: attempt.isProductsCorrect
              ? 'Products verified.'
              : 'Incorrect products.',
          }
        : null
    );
    setStatesFeedback(
      attempt?.isStatesCorrect !== undefined
        ? {
            isCorrect: attempt.isStatesCorrect,
            feedback: attempt.isStatesCorrect
              ? 'States verified.'
              : 'States incorrect.',
          }
        : null
    );
    setBalanceFeedback(
      attempt?.isBalancedCorrect !== undefined
        ? {
            isCorrect: attempt.isBalancedCorrect,
            feedback: attempt.isBalancedCorrect
              ? 'Equation balanced.'
              : 'Equation not balanced.',
          }
        : null
    );
    setShowHint(false);
  };

  const currentProblem = session?.problems[currentIdx];

  // 1. Verify reaction type
  const handleSelectType = (type: ReactionType) => {
    if (!currentProblem || !session) return;
    setSelectedType(type);
    const isCorrect = type === currentProblem.type;

    const updatedAttempts = {
      ...session.attempts,
      [currentProblem.id]: {
        ...session.attempts[currentProblem.id],
        identifiedType: type,
        isTypeCorrect: isCorrect,
      },
    };
    setSession({ ...session, attempts: updatedAttempts });
  };

  // 2. Verify products
  const handleVerifyProducts = () => {
    if (!currentProblem || !session) return;
    const result = validateProductPrediction(predictedInput, currentProblem, isDeclaredNoReaction);
    setProductFeedback(result);

    const isDone = result.isCorrect && currentProblem.isNoReaction;

    const updatedAttempts = {
      ...session.attempts,
      [currentProblem.id]: {
        ...session.attempts[currentProblem.id],
        predictedProducts: predictedInput,
        isDeclaredNoReaction,
        isProductsCorrect: result.isCorrect,
        isCompleted: isDone,
      },
    };

    setSession({ ...session, attempts: updatedAttempts });
  };

  // 3. Verify states of matter
  const handleVerifyStates = () => {
    if (!currentProblem || !session) return;
    const result = validateProductStates(selectedProductStates, currentProblem);
    setStatesFeedback(result);

    const updatedAttempts = {
      ...session.attempts,
      [currentProblem.id]: {
        ...session.attempts[currentProblem.id],
        userProductStates: selectedProductStates,
        isStatesCorrect: result.isCorrect,
      },
    };

    setSession({ ...session, attempts: updatedAttempts });
  };

  // 4. Verify balance
  const handleVerifyBalance = () => {
    if (!currentProblem || !session) return;
    const result = validateCoefficients(userCoeffs, currentProblem);
    setBalanceFeedback(result);

    const updatedAttempts = {
      ...session.attempts,
      [currentProblem.id]: {
        ...session.attempts[currentProblem.id],
        userCoefficients: userCoeffs,
        isBalancedCorrect: result.isCorrect,
        isCompleted: result.isCorrect,
      },
    };

    setSession({ ...session, attempts: updatedAttempts });
  };

  // Switch question
  const goToQuestion = (idx: number) => {
    if (!session) return;
    setCurrentIdx(idx);
    loadProblemState(session.problems[idx], session.attempts[session.problems[idx].id]);
  };

  // Finish homework
  const handleFinishHomework = () => {
    if (!session) return;
    setSession({
      ...session,
      isFinished: true,
      completedAt: new Date().toISOString(),
    });
  };

  // Screen 1: Name Input Form (Randomly assigned set, NO class period, NO set picker)
  if (!session) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>Assessment Module</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Chemistry Reaction Homework</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Complete 6 reaction problems with mixed reaction types: Halogen Single Replacement, Metal Single Replacement, and Precipitation Double Replacement (including 1–2 No Reaction cases). You will be randomly assigned an assignment set. When finished, you can download your official PDF report.
            </p>
          </div>

          <form onSubmit={handleStartHomework} className="space-y-5 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={studentNameInput}
                onChange={(e) => setStudentNameInput(e.target.value)}
                placeholder="e.g. Maya Lin"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
              <div className="font-bold">Homework Assessment Details:</div>
              <ul className="list-disc list-inside space-y-0.5 text-blue-800">
                <li>A random question set (1 of 4 distinct sets) will be assigned to you</li>
                <li>Contains 6 questions with mixed reaction types to test your understanding</li>
                <li>Identify reaction type, predict products, select states of matter, and balance</li>
                <li>Generates an official PDF with your name, score, and final balanced equations</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={!studentNameInput.trim()}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <span>Begin Randomly Assigned Homework</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate score
  let correctCount = 0;
  session.problems.forEach((p) => {
    const att = session.attempts[p.id];
    if (att) {
      if (p.isNoReaction) {
        if (att.isDeclaredNoReaction || att.isProductsCorrect) correctCount++;
      } else {
        if (att.isProductsCorrect && att.isStatesCorrect && att.isBalancedCorrect) correctCount++;
      }
    }
  });
  const scorePercent = Math.round((correctCount / session.problems.length) * 100);

  // Screen 3: Finished / PDF Summary Screen
  if (session.isFinished) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-xs text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Homework Assessment Complete
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">Excellent Work, {session.studentName}!</h1>
            <p className="text-sm text-slate-600 mt-1">
              You have completed all 6 reactions in this homework set.
            </p>
          </div>

          {/* Score Box */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl max-w-sm mx-auto">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Final Score</div>
            <div className="text-4xl font-extrabold text-slate-900 mt-2 font-mono">
              {correctCount} / {session.problems.length}
            </div>
            <div className={`text-sm font-bold mt-1 ${scorePercent >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {scorePercent}% Correct
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => exportHomeworkPdf(session)}
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Homework PDF</span>
            </button>

            <button
              onClick={() => {
                // Pick a new random set so they get fresh questions!
                setSession(null);
              }}
              className="w-full sm:w-auto px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Start New Random Homework</span>
            </button>
          </div>
        </div>

        {/* Answers Summary Table */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Equations Summary (Set {session.setNumber})</h2>
            <span className="text-xs text-slate-500">Student: {session.studentName}</span>
          </div>

          <div className="divide-y divide-slate-100 font-mono text-xs">
            {session.problems.map((problem, i) => {
              const attempt = session.attempts[problem.id];
              const isCorrect = problem.isNoReaction
                ? attempt?.isDeclaredNoReaction || attempt?.isProductsCorrect
                : attempt?.isProductsCorrect && attempt?.isStatesCorrect && attempt?.isBalancedCorrect;

              return (
                <div key={problem.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 font-sans text-xs text-slate-500">
                      <span className="font-bold text-slate-800">Q{i + 1}.</span>
                      <span>{getReactionTypeLabel(problem.type)}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900 mt-1">
                      {getFullEquation(problem)}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 font-sans font-bold text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-sans font-bold text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Incomplete</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Screen 2: Active Problem Solving
  if (!currentProblem) return null;

  const step1Done = Boolean(selectedType && selectedType === currentProblem.type);
  const step2Done = productFeedback?.isCorrect === true;
  const isNoReactionFinished = step2Done && currentProblem.isNoReaction;
  const step3Done = isNoReactionFinished || statesFeedback?.isCorrect === true;
  const step4Done = isNoReactionFinished || balanceFeedback?.isCorrect === true;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-slate-500">
            Student: <span className="font-bold text-slate-900">{session.studentName}</span>
          </div>
          <div className="text-base font-bold text-slate-900 mt-0.5">
            Question {currentIdx + 1} of {session.problems.length} (Mixed Order)
          </div>
        </div>

        {/* Question Switcher Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {session.problems.map((p, idx) => {
            const att = session.attempts[p.id];
            const isCurrent = currentIdx === idx;
            const isDone = att?.isCompleted;

            let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
            if (isDone) {
              badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
            } else if (isCurrent) {
              badgeStyle = 'bg-blue-600 text-white border-blue-600 font-bold';
            }

            return (
              <button
                key={p.id}
                onClick={() => goToQuestion(idx)}
                className={`w-8 h-8 rounded-lg text-xs border flex items-center justify-center transition-colors ${badgeStyle}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transition metal charge callout if applicable */}
      {currentProblem.transitionMetalChargeNote && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2 shadow-2xs">
          <Zap className="w-4 h-4 text-blue-600 shrink-0" />
          <div>
            <span className="font-bold">Charge Note: </span>
            <span>{currentProblem.transitionMetalChargeNote}</span>
          </div>
        </div>
      )}

      {/* Main Problem Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {/* Reactants Header (mixed reactant order) */}
        <div className="p-6 bg-slate-50/70 rounded-t-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Question {currentIdx + 1}: {currentProblem.title}
          </div>
          <div className="flex items-center flex-wrap gap-3 font-mono text-xl sm:text-2xl font-bold text-slate-900 bg-white p-4 rounded-lg border border-slate-200 mt-2">
            <span>{formatSpeciesList(currentProblem.reactants, false, true)}</span>
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

        {/* Step 1: Type Selection */}
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">1. Identify Reaction Type</h2>
            {step1Done && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { type: 'halogen_sr' as ReactionType, label: 'Halogen Single Replacement' },
              { type: 'metal_sr' as ReactionType, label: 'Metal Single Replacement' },
              { type: 'double_replacement_ppt' as ReactionType, label: 'Double Replacement (PPT)' },
            ].map((opt) => {
              const isSelected = selectedType === opt.type;
              return (
                <button
                  key={opt.type}
                  onClick={() => handleSelectType(opt.type)}
                  className={`p-3 text-left rounded-lg border text-xs font-semibold transition-colors ${
                    isSelected
                      ? opt.type === currentProblem.type
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                        : 'bg-rose-50 border-rose-500 text-rose-900'
                      : 'hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Predict Products */}
        {step1Done && (
          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">2. Predict Products (or No Reaction)</h2>
                <p className="text-xs text-slate-500">
                  Enter product formulas separated by "+", or click "Insert No Reaction".
                </p>
              </div>

              {step2Done && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Correct</span>
                </span>
              )}
            </div>

            <SmartFormulaInput
              value={predictedInput}
              onChange={(val) => {
                setPredictedInput(val);
                setIsDeclaredNoReaction(/^(no\s*reaction|nr)$/i.test(val.trim()));
                setProductFeedback(null);
              }}
              onSubmit={handleVerifyProducts}
              disabled={step2Done}
              placeholder="e.g. CaCl2 + Br2 or AgCl + NaNO3"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1 text-xs text-slate-600 hover:text-blue-600"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
                </button>

                <button
                  onClick={onOpenReference}
                  className="text-xs text-blue-600 hover:text-blue-700 underline font-medium"
                >
                  Reference Tables
                </button>
              </div>

              {!step2Done && (
                <button
                  onClick={handleVerifyProducts}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                >
                  Check Formulas
                </button>
              )}
            </div>

            {showHint && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                {currentProblem.hints[0]}
              </div>
            )}

            {productFeedback && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
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
                <div className="font-bold">{productFeedback.feedback}</div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Select States of Products (Starts unselected) */}
        {step2Done && !currentProblem.isNoReaction && (
          <div className="p-6 space-y-3 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">3. Select States of Matter</h2>
                <p className="text-xs text-slate-500">
                  Assign the correct state of matter: (s), (aq), (l), or (g) for each product.
                </p>
              </div>

              {step3Done && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>States Verified</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentProblem.products.map((prod, pIdx) => {
                const currentSt = selectedProductStates[pIdx];
                return (
                  <div key={pIdx} className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {formatChemicalFormula(prod.formula)}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          currentSt ? 'text-blue-700' : 'text-amber-600'
                        }`}
                      >
                        State: {currentSt ? `(${currentSt})` : '[ Click a state ]'}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1">
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
                          className={`py-1 text-xs font-mono font-bold rounded border transition-colors ${
                            currentSt === st
                              ? 'bg-blue-600 text-white border-blue-600'
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
                  onClick={handleVerifyStates}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                >
                  Verify States
                </button>
              </div>
            )}

            {statesFeedback && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
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
                <div className="font-bold">{statesFeedback.feedback}</div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Balance */}
        {step3Done && !currentProblem.isNoReaction && (
          <div className="p-6 space-y-3 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">4. Balance the Reaction</h2>
              {step4Done && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Balanced!</span>
                </span>
              )}
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-lg flex items-center flex-wrap gap-2 text-base font-mono font-bold">
              {currentProblem.reactants.map((reactant, rIdx) => (
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
                    <span className="text-xs text-slate-500 font-sans">({reactant.state})</span>
                  </div>
                  {rIdx < currentProblem.reactants.length - 1 && <span className="text-slate-400">+</span>}
                </React.Fragment>
              ))}

              <span className="text-blue-600 px-2 font-bold text-xl">→</span>

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
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleVerifyBalance}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                >
                  Verify Balance
                </button>
              </div>
            )}

            {balanceFeedback && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-start gap-2 ${
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
                <div className="font-bold">{balanceFeedback.feedback}</div>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 rounded-b-xl flex items-center justify-between">
          <button
            disabled={currentIdx === 0}
            onClick={() => goToQuestion(currentIdx - 1)}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            {currentIdx < session.problems.length - 1 ? (
              <button
                onClick={() => goToQuestion(currentIdx + 1)}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
              >
                <span>Next Question</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishHomework}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                <Award className="w-4 h-4" />
                <span>Submit Homework</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
