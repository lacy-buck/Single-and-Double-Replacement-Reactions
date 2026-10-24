import { ReactionProblem, ReactionType, ChemicalSpecies, StateOfMatter } from '../types/chemistry';
import { REACTION_BANK, HOMEWORK_SETS } from '../data/reactions';

const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
};

const REVERSE_SUBSCRIPT_MAP: Record<string, string> = {
  '₀': '0',
  '₁': '1',
  '₂': '2',
  '₃': '3',
  '₄': '4',
  '₅': '5',
  '₆': '6',
  '₇': '7',
  '₈': '8',
  '₉': '9',
};

/**
 * Educational Reading Guides for the 3 reaction types.
 */
export interface ReadingGuide {
  title: string;
  howToIdentify: string;
  predictingSteps: string[];
  statesOfMatterTips: string[];
  noReactionRule: string;
}

export const REACTION_READINGS: Record<ReactionType, ReadingGuide> = {
  halogen_sr: {
    title: 'How to Identify & Solve Halogen Single Replacement Reactions',
    howToIdentify:
      'Look for an uncombined diatomic halogen from Group 17 (F₂, Cl₂, Br₂, or I₂) reacting with an aqueous metal halide ionic compound (e.g., CaBr₂, MgI₂, ZnI₂, AlI₃, or KBr).',
    predictingSteps: [
      'Identify the uncombined elemental halogen and the halide anion currently bonded to the metal.',
      'Compare their Electronegativity values: Fluorine (3.98) > Chlorine (3.16) > Bromine (2.96) > Iodine (2.66).',
      'The halogen with HIGHER electronegativity attracts electrons more strongly and will displace the less electronegative halide ion.',
      'Combine the metal cation with the newly formed halide ion, balancing charges according to the metal’s oxidation state (e.g., Ca²⁺ with Cl⁻ forms CaCl₂; Al³⁺ with Br⁻ forms AlBr₃).',
      'The displaced halide is released as a neutral diatomic halogen element (Cl₂, Br₂, or I₂).',
    ],
    statesOfMatterTips: [
      'Fluorine (F₂) and Chlorine (Cl₂) are gases: (g).',
      'Bromine (Br₂) is a dense reddish-brown liquid: (l).',
      'Iodine (I₂) is a dark crystalline solid: (s).',
      'The resulting metal halide salt dissolves in the aqueous solution: (aq).',
    ],
    noReactionRule:
      'Electronegativity governs this reaction. If the uncombined halogen has a LOWER electronegativity than the halide already bonded in the compound (for example, solid I₂ mixed with CuCl₂), the uncombined halogen is not electronegative enough to pull electrons away from the halide ion. Therefore, NO REACTION occurs.',
  },
  metal_sr: {
    title: 'How to Identify & Solve Metal Single Replacement Reactions',
    howToIdentify:
      'Look for a single pure metal element (e.g. Zn, Fe, Cu, Al, Mg) placed into an aqueous solution of another metal salt (e.g. AgNO₃, CuSO₄) or an acid (e.g. HCl, H₂SO₄).',
    predictingSteps: [
      'Identify the lone metal and the metal cation (or hydrogen H⁺) in the aqueous compound.',
      'Consult the Metal Activity Series: metals at the top (Li, K, Ca, Na, Mg, Al, Zn, Fe...) are more reactive than metals near the bottom (Cu, Ag, Au).',
      'If the lone metal is HIGHER than the metal cation (or H⁺) in the compound, a reaction occurs.',
      'Note the charge of the metal (transition metal charges are specified in each problem) and balance charges with the anion to form the new aqueous salt.',
      'The displaced metal cation becomes a neutral solid metal element (s), or H⁺ ions combine into hydrogen gas: H₂(g).',
    ],
    statesOfMatterTips: [
      'Pure metals are solids (s) at room temperature (except mercury Hg).',
      'Hydrogen gas evolved from acids is diatomic: H₂(g).',
      'The new ionic compound formed dissolves in the water: (aq).',
    ],
    noReactionRule:
      'If the lone metal is BELOW the bonded metal (or below Hydrogen in an acid) on the activity series, it cannot displace it. Mark "No Reaction".',
  },
  double_replacement_ppt: {
    title: 'How to Identify & Solve Precipitation Double Replacement Reactions',
    howToIdentify:
      'Look for two aqueous ionic compounds mixed together (e.g., AgNO₃(aq) + NaCl(aq)). Both reactants are dissolved salts with positive cations and negative anions. (No acids or bases are used here).',
    predictingSteps: [
      'Separate each reactant into its cation (+) and anion (-). For example, Ag⁺ & NO₃⁻, and Na⁺ & Cl⁻.',
      'Swap the partners: pair the first cation with the second anion (Ag⁺ with Cl⁻), and the second cation with the first anion (Na⁺ with NO₃⁻).',
      'Balance charges for both new formulas (e.g., Ag⁺ and Cl⁻ make AgCl; Na⁺ and NO₃⁻ make NaNO₃).',
      'Check the Solubility Rules for both products to determine if either product forms an insoluble solid precipitate.',
    ],
    statesOfMatterTips: [
      'An insoluble compound forms a solid precipitate: (s). (e.g. AgCl, BaSO₄, PbI₂, Cu(OH)₂, CaCO₃).',
      'Soluble salts (all nitrates, alkali metal salts, ammonium salts) remain dissolved in water: (aq).',
    ],
    noReactionRule:
      'If BOTH potential products are soluble in water (both are aq), no chemical bond is formed—all ions simply float as spectator ions in solution. The result is "No Reaction".',
  },
};

/**
 * Converts numbers that immediately follow letters or closing parentheses into Unicode subscripts.
 */
export function formatChemicalFormula(formula: string): string {
  if (!formula) return '';
  return formula.replace(/([A-Za-z)\]])([0-9]+)/g, (_, prefix, digits) => {
    const subDigits = digits
      .split('')
      .map((d: string) => SUBSCRIPT_MAP[d] || d)
      .join('');
    return `${prefix}${subDigits}`;
  });
}

/**
 * Converts Unicode subscripts back to ASCII digits for parsing.
 */
export function normalizeSubscripts(text: string): string {
  if (!text) return '';
  return text
    .split('')
    .map((c) => REVERSE_SUBSCRIPT_MAP[c] || c)
    .join('');
}

/**
 * Formats a list of species into a nice chemical equation string.
 */
export function formatSpeciesList(
  species: ChemicalSpecies[],
  showCoefficients = true,
  includeStates = true
): string {
  if (!species || species.length === 0) return 'No Reaction';
  return species
    .map((s) => {
      const coeff = showCoefficients && s.coefficient > 1 ? `${s.coefficient} ` : '';
      const formula = formatChemicalFormula(s.formula);
      const state = includeStates && s.state ? ` (${s.state})` : '';
      return `${coeff}${formula}${state}`;
    })
    .join(' + ');
}

/**
 * Returns the full balanced chemical equation for a problem.
 */
export function getFullEquation(problem: ReactionProblem): string {
  const reactantsStr = formatSpeciesList(problem.reactants, true, true);
  if (problem.isNoReaction) {
    return `${reactantsStr} → No Reaction`;
  }
  const productsStr = formatSpeciesList(problem.products, true, true);
  return `${reactantsStr} → ${productsStr}`;
}

/**
 * Normalizes a single chemical species formula string for comparison.
 */
export function cleanFormulaToken(token: string): string {
  let cleaned = normalizeSubscripts(token).trim();
  cleaned = cleaned.replace(/\s*\((aq|s|l|g)\)\s*/gi, '');
  cleaned = cleaned.replace(/^\d+\s*/, '');
  cleaned = cleaned.replace(/\s+/g, '');
  return cleaned;
}

/**
 * Checks if user's predicted products match the expected products for a reaction.
 * Enforces proper scientific capitalization (e.g. NaCl, not nacl; CaBr2, not cabr2).
 */
export function validateProductPrediction(
  userInput: string,
  problem: ReactionProblem,
  isDeclaredNoReaction: boolean
): { isCorrect: boolean; feedback: string } {
  const normalizedInput = userInput.trim();

  const textLooksLikeNR =
    /^(no\s*reaction|nr|n\.r\.|none)$/i.test(normalizedInput) || isDeclaredNoReaction;

  if (problem.isNoReaction) {
    if (textLooksLikeNR) {
      return {
        isCorrect: true,
        feedback: 'Correct! There is No Reaction.',
      };
    } else {
      return {
        isCorrect: false,
        feedback:
          problem.noReactionReason ||
          'Check the activity series or electronegativity. Does this reaction actually take place?',
      };
    }
  }

  if (textLooksLikeNR) {
    return {
      isCorrect: false,
      feedback:
        'This reaction actually DOES occur! Check your reference tables or electronegativities.',
    };
  }

  if (!normalizedInput) {
    return {
      isCorrect: false,
      feedback: 'Please enter the predicted product formulas separated by a plus sign (+).',
    };
  }

  const userTokens = normalizedInput
    .split('+')
    .map(cleanFormulaToken)
    .filter((t) => t.length > 0);

  const expectedTokens = problem.products.map((p) => cleanFormulaToken(p.formula));

  if (userTokens.length !== expectedTokens.length) {
    return {
      isCorrect: false,
      feedback: `Expected ${expectedTokens.length} product${
        expectedTokens.length > 1 ? 's' : ''
      }, but found ${userTokens.length}. (Separate products with a "+")`,
    };
  }

  // 1. Check for case sensitivity / capitalization
  const sortedExpectedCase = [...expectedTokens].sort();
  const sortedUserCase = [...userTokens].sort();

  const sortedExpectedLower = [...expectedTokens].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
  const sortedUserLower = [...userTokens].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  const matchesCaseInsensitive = sortedExpectedLower.every(
    (exp, idx) => exp.toLowerCase() === sortedUserLower[idx]?.toLowerCase()
  );

  if (matchesCaseInsensitive) {
    // Check if exact capitalization was used
    const exactCaseMatches = sortedExpectedCase.every(
      (exp, idx) => exp === sortedUserCase[idx]
    );

    if (!exactCaseMatches) {
      return {
        isCorrect: false,
        feedback:
          'Check your capitalization! Chemical element symbols must always start with an uppercase letter (e.g. CaCl₂, NaCl, Br₂, FeSO₄, not lowercase).',
      };
    }

    return {
      isCorrect: true,
      feedback: 'Great job! Your predicted product formulas are chemically correct.',
    };
  }

  return {
    isCorrect: false,
    feedback:
      'Check your chemical formulas and charges. Remember to balance charges in ionic compounds (e.g. Ca²⁺ and Cl⁻ make CaCl₂) and check diatomics (H₂, Cl₂, Br₂, I₂).',
  };
}

/**
 * Validates the student's selected states of matter for each product.
 * Returns error if any state is unselected (null) or incorrect.
 */
export function validateProductStates(
  userStates: (StateOfMatter | null)[],
  problem: ReactionProblem
): { isCorrect: boolean; feedback: string } {
  if (problem.isNoReaction) {
    return { isCorrect: true, feedback: 'No products to assign states to.' };
  }

  // Check if any state is still unselected
  const hasUnselected = userStates.some((st) => st === null || st === undefined);
  if (hasUnselected || userStates.length !== problem.products.length) {
    return {
      isCorrect: false,
      feedback: 'Please select a state of matter: (s), (aq), (l), or (g) for every product.',
    };
  }

  const allMatch = problem.products.every((prod, idx) => {
    return userStates[idx] === prod.state;
  });

  if (allMatch) {
    return {
      isCorrect: true,
      feedback: 'Correct states of matter! Now balance the equation with integer coefficients.',
    };
  }

  return {
    isCorrect: false,
    feedback:
      'Check your states of matter. Hint: Precipitates and pure metals are (s), dissolved salts are (aq), halogens vary (F₂/Cl₂ are gases, Br₂ is a liquid, I₂ is a solid), and H₂ is a gas (g).',
  };
}

/**
 * Checks if the user-entered coefficients correctly balance the equation.
 */
export function validateCoefficients(
  userCoeffs: number[],
  problem: ReactionProblem
): { isCorrect: boolean; feedback: string } {
  if (problem.isNoReaction) {
    return { isCorrect: true, feedback: 'No reaction to balance!' };
  }

  const expected = problem.balancedCoefficients;
  if (userCoeffs.length !== expected.length) {
    return { isCorrect: false, feedback: 'Missing some coefficients.' };
  }

  const matches = userCoeffs.every((coeff, idx) => coeff === expected[idx]);
  if (matches) {
    return {
      isCorrect: true,
      feedback: 'Perfect! The equation is completely balanced.',
    };
  }

  return {
    isCorrect: false,
    feedback:
      'Not quite balanced yet. Count the number of each type of atom on the reactants side and products side.',
  };
}

export function getReactionTypeLabel(type: ReactionType): string {
  switch (type) {
    case 'halogen_sr':
      return 'Halogen Single Replacement';
    case 'metal_sr':
      return 'Metal Single Replacement';
    case 'double_replacement_ppt':
      return 'Double Replacement (Precipitate)';
  }
}

/**
 * Interleaves reaction problems so that mixed practice never has 3 in a row of the same type.
 * e.g., Halogen, Metal, PPT, Halogen, Metal, PPT...
 */
export function getInterleavedMixedProblems(): ReactionProblem[] {
  const halogens = [...REACTION_BANK.filter((r) => r.type === 'halogen_sr')].sort(
    () => Math.random() - 0.5
  );
  const metals = [...REACTION_BANK.filter((r) => r.type === 'metal_sr')].sort(
    () => Math.random() - 0.5
  );
  const ppts = [...REACTION_BANK.filter((r) => r.type === 'double_replacement_ppt')].sort(
    () => Math.random() - 0.5
  );

  const mixed: ReactionProblem[] = [];
  const maxLen = Math.max(halogens.length, metals.length, ppts.length);

  for (let i = 0; i < maxLen; i++) {
    // Rotate starting type to create maximum variety
    const pattern = i % 3;
    if (pattern === 0) {
      if (halogens[i]) mixed.push(halogens[i]);
      if (metals[i]) mixed.push(metals[i]);
      if (ppts[i]) mixed.push(ppts[i]);
    } else if (pattern === 1) {
      if (metals[i]) mixed.push(metals[i]);
      if (ppts[i]) mixed.push(ppts[i]);
      if (halogens[i]) mixed.push(halogens[i]);
    } else {
      if (ppts[i]) mixed.push(ppts[i]);
      if (halogens[i]) mixed.push(halogens[i]);
      if (metals[i]) mixed.push(metals[i]);
    }
  }

  return mixed;
}

/**
 * Returns one of the 4 distinct homework sets (1, 2, 3, or 4).
 */
export function getHomeworkSet(setNumber: number): ReactionProblem[] {
  const safeNumber = ((setNumber - 1) % 4) + 1;
  return HOMEWORK_SETS[safeNumber] || HOMEWORK_SETS[1];
}

// Reference data for the interactive drawer
export const METAL_ACTIVITY_SERIES = [
  { symbol: 'Li', name: 'Lithium', notes: 'Reacts with cold water to produce H₂ and hydroxide' },
  { symbol: 'K', name: 'Potassium', notes: 'Reacts violently with cold water' },
  { symbol: 'Ba', name: 'Barium', notes: 'Reacts with cold water' },
  { symbol: 'Sr', name: 'Strontium', notes: 'Reacts with cold water' },
  { symbol: 'Ca', name: 'Calcium', notes: 'Reacts with cold water' },
  { symbol: 'Na', name: 'Sodium', notes: 'Reacts vigorously with cold water' },
  { symbol: 'Mg', name: 'Magnesium', notes: 'Reacts with steam or hot water, reacts with acids' },
  { symbol: 'Al', name: 'Aluminum', notes: 'Reacts with acids to displace H₂' },
  { symbol: 'Mn', name: 'Manganese', notes: 'Reacts with acids to displace H₂' },
  { symbol: 'Zn', name: 'Zinc', notes: 'Reacts with acids to displace H₂ (forms Zn²⁺)' },
  { symbol: 'Cr', name: 'Chromium', notes: 'Reacts with acids to displace H₂' },
  { symbol: 'Fe', name: 'Iron', notes: 'Reacts with acids to displace H₂ (forms Fe²⁺)' },
  { symbol: 'Cd', name: 'Cadmium', notes: 'Reacts with acids to displace H₂' },
  { symbol: 'Co', name: 'Cobalt', notes: 'Reacts slowly with acids' },
  { symbol: 'Ni', name: 'Nickel', notes: 'Reacts slowly with acids (forms Ni²⁺)' },
  { symbol: 'Sn', name: 'Tin', notes: 'Reacts slowly with acids' },
  { symbol: 'Pb', name: 'Lead', notes: 'Reacts slowly with acids (forms Pb²⁺)' },
  { symbol: '[H]', name: 'Hydrogen', notes: 'Standard reference point (0.00 V)' },
  { symbol: 'Sb', name: 'Antimony', notes: 'Unreactive with non-oxidizing acids' },
  { symbol: 'Bi', name: 'Bismuth', notes: 'Unreactive with non-oxidizing acids' },
  { symbol: 'Cu', name: 'Copper', notes: 'Unreactive with HCl / non-oxidizing acids (forms Cu²⁺)' },
  { symbol: 'Ag', name: 'Silver', notes: 'Unreactive with non-oxidizing acids (forms Ag⁺)' },
  { symbol: 'Pd', name: 'Palladium', notes: 'Very low activity' },
  { symbol: 'Hg', name: 'Mercury', notes: 'Unreactive with non-oxidizing acids' },
  { symbol: 'Pt', name: 'Platinum', notes: 'Noble metal' },
  { symbol: 'Au', name: 'Gold', notes: 'Noble metal, lowest activity' },
];

export const HALOGEN_ELECTRONEGATIVITY_SERIES = [
  { symbol: 'F₂', name: 'Fluorine', electronegativity: '3.98', rank: 1, notes: 'Highest electronegativity on periodic table; displaces all halides. Gas (g).' },
  { symbol: 'Cl₂', name: 'Chlorine', electronegativity: '3.16', rank: 2, notes: 'Displaces Br⁻ and I⁻ from solution. Gas (g).' },
  { symbol: 'Br₂', name: 'Bromine', electronegativity: '2.96', rank: 3, notes: 'Displaces I⁻ only. Liquid (l).' },
  { symbol: 'I₂', name: 'Iodine', electronegativity: '2.66', rank: 4, notes: 'Lowest electronegativity halogen; cannot displace F⁻, Cl⁻, or Br⁻. Solid (s).' },
];

export const SOLUBILITY_RULES = [
  {
    category: 'Nitrates (NO₃⁻) & Acetates (C₂H₃O₂⁻)',
    status: 'Soluble',
    exceptions: 'None (All nitrates and acetates dissolve in water)',
    isPrecipitate: false,
  },
  {
    category: 'Alkali Metal (Li⁺, Na⁺, K⁺) & Ammonium (NH₄⁺)',
    status: 'Soluble',
    exceptions: 'None (All Group 1 and ammonium salts are soluble)',
    isPrecipitate: false,
  },
  {
    category: 'Chlorides (Cl⁻), Bromides (Br⁻), Iodides (I⁻)',
    status: 'Mostly Soluble',
    exceptions: 'Insoluble with Ag⁺, Pb²⁺, and Hg₂²⁺ (forms precipitates like AgCl, PbI₂)',
    isPrecipitate: false,
  },
  {
    category: 'Sulfates (SO₄²⁻)',
    status: 'Mostly Soluble',
    exceptions: 'Insoluble with Ba²⁺, Pb²⁺, Ca²⁺, and Sr²⁺ (forms precipitates like BaSO₄)',
    isPrecipitate: false,
  },
  {
    category: 'Hydroxides (OH⁻)',
    status: 'Insoluble (Precipitates)',
    exceptions: 'Soluble with Group 1 metals, NH₄⁺, and Ba²⁺ (Ca²⁺ is slightly soluble)',
    isPrecipitate: true,
  },
  {
    category: 'Carbonates (CO₃²⁻) & Phosphates (PO₄³⁻)',
    status: 'Insoluble (Precipitates)',
    exceptions: 'Soluble only with Group 1 metals and NH₄⁺',
    isPrecipitate: true,
  },
  {
    category: 'Sulfides (S²⁻)',
    status: 'Insoluble (Precipitates)',
    exceptions: 'Soluble with Group 1, Group 2, and NH₄⁺',
    isPrecipitate: true,
  },
];
