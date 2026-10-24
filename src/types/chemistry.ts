export type ReactionType = 'halogen_sr' | 'metal_sr' | 'double_replacement_ppt';

export type StateOfMatter = 'aq' | 's' | 'l' | 'g';

export interface ChemicalSpecies {
  coefficient: number;
  formula: string;
  state: StateOfMatter;
  charge?: number;
}

export interface ReactionProblem {
  id: string;
  type: ReactionType;
  title: string;
  reactants: ChemicalSpecies[];
  isNoReaction: boolean;
  noReactionReason?: string;
  products: ChemicalSpecies[]; // Empty array if isNoReaction = true
  balancedCoefficients: number[]; // Reactants followed by products
  explanation: string;
  hints: string[];
  precipitate?: string; // e.g. "AgCl" or "BaSO4" for double replacement
  difficulty: 'standard' | 'challenge';
  transitionMetalChargeNote?: string; // e.g. "Iron (Fe) will form the Fe²⁺ ion"
}

export interface ProblemAttempt {
  problemId: string;
  identifiedType?: ReactionType;
  predictedProducts: string; // User raw input
  isDeclaredNoReaction: boolean;
  isTypeCorrect?: boolean;
  isProductsCorrect?: boolean;
  userProductStates?: (StateOfMatter | null)[];
  isStatesCorrect?: boolean;
  userCoefficients: number[];
  isBalancedCorrect?: boolean;
  isCompleted: boolean;
  attemptsCount: number;
}

export interface HomeworkSession {
  studentName: string;
  setNumber: number; // Set 1, 2, 3, 4
  startedAt: string;
  completedAt?: string;
  problems: ReactionProblem[];
  attempts: Record<string, ProblemAttempt>;
  currentIndex: number;
  isFinished: boolean;
}
