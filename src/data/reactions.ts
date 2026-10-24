import { ReactionProblem } from '../types/chemistry';

export const REACTION_BANK: ReactionProblem[] = [
  // =========================================================================
  // 1. NON-METAL (HALOGEN) SINGLE REPLACEMENT
  // Varied metal charges: Ca²⁺, Mg²⁺, Zn²⁺, Al³⁺, Fe²⁺, Ba²⁺, K⁺, Na⁺
  // Governed by ELECTRONEGATIVITY: F (3.98) > Cl (3.16) > Br (2.96) > I (2.66)
  // =========================================================================
  {
    id: 'hal-1',
    type: 'halogen_sr',
    title: 'Calcium bromide solution with chlorine gas bubbled in',
    reactants: [
      { coefficient: 1, formula: 'CaBr2', state: 'aq' },
      { coefficient: 1, formula: 'Cl2', state: 'g' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'CaCl2', state: 'aq' },
      { coefficient: 1, formula: 'Br2', state: 'l' },
    ],
    balancedCoefficients: [1, 1, 1, 1],
    transitionMetalChargeNote: 'Calcium is an alkaline earth metal with a +2 charge (Ca²⁺).',
    explanation: 'Chlorine (electronegativity = 3.16) is more electronegative than bromine (electronegativity = 2.96). Because chlorine attracts electrons more strongly, it oxidizes bromide ions (Br⁻) and takes their place, forming aqueous calcium chloride (CaCl₂) and liquid bromine (Br₂).',
    hints: [
      'Compare electronegativity values: Cl (3.16) > Br (2.96).',
      'Because chlorine is more electronegative, it displaces bromide.',
      'Calcium forms Ca²⁺, requiring two Cl⁻ ions: CaCl₂. Bromine is a liquid: Br₂(l).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'hal-2',
    type: 'halogen_sr',
    title: 'Bromine liquid added to magnesium iodide solution',
    reactants: [
      { coefficient: 1, formula: 'Br2', state: 'l' },
      { coefficient: 1, formula: 'MgI2', state: 'aq' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'MgBr2', state: 'aq' },
      { coefficient: 1, formula: 'I2', state: 's' },
    ],
    balancedCoefficients: [1, 1, 1, 1],
    transitionMetalChargeNote: 'Magnesium has a +2 charge (Mg²⁺).',
    explanation: 'Bromine has a higher electronegativity (2.96) than iodine (2.66). The more electronegative bromine displaces iodide ions from solution to form aqueous magnesium bromide (MgBr₂) and solid crystalline iodine (I₂).',
    hints: [
      'Compare electronegativity: Br (2.96) vs I (2.66).',
      'The more electronegative halogen pulls electrons to become the halide anion.',
      'Mg forms Mg²⁺, so the formula is MgBr₂(aq). Iodine is solid: I₂(s).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'hal-3',
    type: 'halogen_sr',
    title: 'Copper(II) chloride solution mixed with solid iodine',
    reactants: [
      { coefficient: 1, formula: 'CuCl2', state: 'aq' },
      { coefficient: 1, formula: 'I2', state: 's' },
    ],
    isNoReaction: true,
    noReactionReason: 'Iodine has a lower electronegativity (2.66) than chlorine (3.16). Iodine cannot pull electrons away from chloride ions to displace them.',
    products: [],
    balancedCoefficients: [1, 1],
    transitionMetalChargeNote: 'Copper has a +2 charge in CuCl₂ (Cu²⁺).',
    explanation: 'NO REACTION: In halogen displacement, a halogen with lower electronegativity cannot displace a more electronegative halogen. Since iodine (2.66) is less electronegative than chlorine (3.16), no electron transfer occurs.',
    hints: [
      'Compare electronegativity values: Iodine (2.66) vs Chlorine (3.16).',
      'Does iodine attract electrons more strongly than chlorine?',
      'Since iodine has lower electronegativity, no reaction occurs.',
    ],
    difficulty: 'standard',
  },
  {
    id: 'hal-4',
    type: 'halogen_sr',
    title: 'Zinc iodide solution with chlorine gas bubbled in',
    reactants: [
      { coefficient: 1, formula: 'ZnI2', state: 'aq' },
      { coefficient: 1, formula: 'Cl2', state: 'g' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'ZnCl2', state: 'aq' },
      { coefficient: 1, formula: 'I2', state: 's' },
    ],
    balancedCoefficients: [1, 1, 1, 1],
    transitionMetalChargeNote: 'Zinc forms the Zn²⁺ ion.',
    explanation: 'Chlorine is significantly more electronegative (3.16) than iodine (2.66). Chlorine easily oxidizes the iodide ions in ZnI₂ to form aqueous zinc chloride (ZnCl₂) and solid iodine (I₂).',
    hints: [
      'Chlorine electronegativity (3.16) > Iodine electronegativity (2.66).',
      'Zinc forms Zn²⁺, balancing with two Cl⁻ ions: ZnCl₂(aq).',
      'Solid iodine forms: I₂(s).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'hal-5',
    type: 'halogen_sr',
    title: 'Barium fluoride solution mixed with liquid bromine',
    reactants: [
      { coefficient: 1, formula: 'BaF2', state: 'aq' },
      { coefficient: 1, formula: 'Br2', state: 'l' },
    ],
    isNoReaction: true,
    noReactionReason: 'Bromine has a much lower electronegativity (2.96) than fluorine (3.98). Fluorine is the most electronegative element and cannot be displaced by bromine.',
    products: [],
    balancedCoefficients: [1, 1],
    transitionMetalChargeNote: 'Barium has a +2 charge (Ba²⁺).',
    explanation: 'NO REACTION: Fluorine has the highest electronegativity of all elements (3.98). Bromine (2.96) cannot take electrons from fluoride ions, so no reaction happens.',
    hints: [
      'Fluorine has the highest electronegativity on the periodic table (3.98).',
      'Bromine (2.96) is less electronegative than fluorine.',
      'A halogen with lower electronegativity cannot displace fluoride.',
    ],
    difficulty: 'standard',
  },
  {
    id: 'hal-6',
    type: 'halogen_sr',
    title: 'Aluminum iodide solution mixed with liquid bromine',
    reactants: [
      { coefficient: 2, formula: 'AlI3', state: 'aq' },
      { coefficient: 3, formula: 'Br2', state: 'l' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 2, formula: 'AlBr3', state: 'aq' },
      { coefficient: 3, formula: 'I2', state: 's' },
    ],
    balancedCoefficients: [2, 3, 2, 3],
    transitionMetalChargeNote: 'Aluminum forms the Al³⁺ ion (Group 13 metal).',
    explanation: 'Bromine has a higher electronegativity (2.96) than iodine (2.66). Bromine displaces iodide from AlI₃ to form aqueous aluminum bromide (AlBr₃) and solid iodine crystals (I₂).',
    hints: [
      'Bromine (2.96) is more electronegative than iodine (2.66).',
      'Aluminum is +3 (Al³⁺) and bromide is -1 (Br⁻) -> AlBr₃(aq).',
      'Balance carefully with coefficients: 2 AlI₃ + 3 Br₂ -> 2 AlBr₃ + 3 I₂.',
    ],
    difficulty: 'challenge',
  },
  {
    id: 'hal-7',
    type: 'halogen_sr',
    title: 'Potassium bromide solution with solid iodine added',
    reactants: [
      { coefficient: 2, formula: 'KBr', state: 'aq' },
      { coefficient: 1, formula: 'I2', state: 's' },
    ],
    isNoReaction: true,
    noReactionReason: 'Iodine has a lower electronegativity (2.66) than bromine (2.96). Iodine cannot displace bromide from potassium bromide.',
    products: [],
    balancedCoefficients: [2, 1],
    explanation: 'NO REACTION: Iodine (electronegativity = 2.66) is less electronegative than bromine (2.96). Iodine cannot remove electrons from bromide ions, resulting in no reaction.',
    hints: [
      'Iodine electronegativity (2.66) < Bromine electronegativity (2.96).',
      'Since iodine is less electronegative, it cannot displace bromide.',
    ],
    difficulty: 'standard',
  },
  {
    id: 'hal-8',
    type: 'halogen_sr',
    title: 'Iron(II) bromide solution with chlorine gas bubbled in',
    reactants: [
      { coefficient: 1, formula: 'FeBr2', state: 'aq' },
      { coefficient: 1, formula: 'Cl2', state: 'g' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'FeCl2', state: 'aq' },
      { coefficient: 1, formula: 'Br2', state: 'l' },
    ],
    balancedCoefficients: [1, 1, 1, 1],
    transitionMetalChargeNote: 'Iron has a +2 charge in this reaction (Fe²⁺).',
    explanation: 'Chlorine is more electronegative (3.16) than bromine (2.96). Chlorine displaces bromide from FeBr₂ to yield aqueous iron(II) chloride (FeCl₂) and liquid bromine (Br₂).',
    hints: [
      'Cl (3.16) is more electronegative than Br (2.96).',
      'Iron retains its +2 charge: FeCl₂(aq).',
      'Elemental bromine is a liquid: Br₂(l).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'hal-9',
    type: 'halogen_sr',
    title: 'Potassium fluoride solution mixed with solid iodine',
    reactants: [
      { coefficient: 2, formula: 'KF', state: 'aq' },
      { coefficient: 1, formula: 'I2', state: 's' },
    ],
    isNoReaction: true,
    noReactionReason: 'Iodine has a far lower electronegativity (2.66) than fluorine (3.98). Iodine cannot displace fluoride.',
    products: [],
    balancedCoefficients: [2, 1],
    explanation: 'NO REACTION: Fluorine has the highest electronegativity on the periodic table (3.98), while iodine is much lower (2.66). No reaction occurs.',
    hints: [
      'Compare electronegativity: Iodine is 2.66, Fluorine is 3.98.',
      'Iodine cannot displace fluoride ions.',
    ],
    difficulty: 'standard',
  },
  {
    id: 'hal-10',
    type: 'halogen_sr',
    title: 'Fluorine gas bubbled through calcium chloride solution',
    reactants: [
      { coefficient: 1, formula: 'F2', state: 'g' },
      { coefficient: 1, formula: 'CaCl2', state: 'aq' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'CaF2', state: 'aq' },
      { coefficient: 1, formula: 'Cl2', state: 'g' },
    ],
    balancedCoefficients: [1, 1, 1, 1],
    transitionMetalChargeNote: 'Calcium has a +2 charge (Ca²⁺).',
    explanation: 'Fluorine (electronegativity = 3.98) is significantly more electronegative than chlorine (3.16). Fluorine displaces chloride to form CaF₂ and chlorine gas Cl₂(g).',
    hints: [
      'Fluorine (3.98) is more electronegative than chlorine (3.16).',
      'Calcium is +2: CaF₂(aq). Chlorine is a gas: Cl₂(g).',
    ],
    difficulty: 'standard',
  },

  // ==========================================
  // 2. METAL SINGLE REPLACEMENT
  // ==========================================
  {
    id: 'met-1',
    type: 'metal_sr',
    title: 'Hydrochloric acid with zinc metal placed into it',
    reactants: [
      { coefficient: 2, formula: 'HCl', state: 'aq' },
      { coefficient: 1, formula: 'Zn', state: 's' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'ZnCl2', state: 'aq' },
      { coefficient: 1, formula: 'H2', state: 'g' },
    ],
    balancedCoefficients: [2, 1, 1, 1],
    transitionMetalChargeNote: 'Zinc forms the Zn²⁺ ion in compounds.',
    explanation: 'Zinc is above hydrogen in the metal activity series. Zinc displaces H⁺ from hydrochloric acid to produce aqueous zinc chloride (ZnCl₂) and bubbles of hydrogen gas (H₂).',
    hints: [
      'Look up Zn and H in the metal activity series.',
      'Zinc forms Zn²⁺, requiring two Cl⁻ ions: ZnCl₂(aq).',
      'Hydrogen gas is diatomic: H₂(g).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'met-2',
    type: 'metal_sr',
    title: 'Copper wire placed in silver nitrate solution',
    reactants: [
      { coefficient: 1, formula: 'Cu', state: 's' },
      { coefficient: 2, formula: 'AgNO3', state: 'aq' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'Cu(NO3)2', state: 'aq' },
      { coefficient: 2, formula: 'Ag', state: 's' },
    ],
    balancedCoefficients: [1, 2, 1, 2],
    transitionMetalChargeNote: 'Copper forms the Cu²⁺ ion, and Silver forms the Ag⁺ ion.',
    explanation: 'Copper is higher than silver in the activity series (Cu > Ag). Copper oxidizes to Cu²⁺, displacing silver ions to form blue aqueous copper(II) nitrate and metallic solid silver crystals (Ag).',
    hints: [
      'Copper is above silver in the activity series.',
      'Copper forms Cu²⁺ with nitrate (NO₃⁻), producing Cu(NO₃)₂(aq).',
      'Solid silver precipitates as Ag(s).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'met-3',
    type: 'metal_sr',
    title: 'Hydrochloric acid with copper metal placed in it',
    reactants: [
      { coefficient: 2, formula: 'HCl', state: 'aq' },
      { coefficient: 1, formula: 'Cu', state: 's' },
    ],
    isNoReaction: true,
    noReactionReason: 'Copper (Cu) is below Hydrogen (H) in the metal activity series. It cannot displace hydrogen from non-oxidizing acids.',
    products: [],
    balancedCoefficients: [2, 1],
    transitionMetalChargeNote: 'Copper forms the Cu²⁺ ion.',
    explanation: 'NO REACTION: Copper is less active than hydrogen (Cu is below [H] in the activity series). Copper cannot reduce H⁺ ions to hydrogen gas under standard conditions.',
    hints: [
      'Find copper and hydrogen on the metal activity series.',
      'Copper is below hydrogen, so no reaction occurs with HCl.',
    ],
    difficulty: 'standard',
  },
  {
    id: 'met-4',
    type: 'metal_sr',
    title: 'Copper(II) sulfate solution with an iron nail added',
    reactants: [
      { coefficient: 1, formula: 'CuSO4', state: 'aq' },
      { coefficient: 1, formula: 'Fe', state: 's' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'FeSO4', state: 'aq' },
      { coefficient: 1, formula: 'Cu', state: 's' },
    ],
    balancedCoefficients: [1, 1, 1, 1],
    transitionMetalChargeNote: 'Iron forms the Fe²⁺ ion, and Copper forms the Cu²⁺ ion.',
    explanation: 'Iron is higher than copper in the activity series (Fe > Cu). Iron displaces copper, forming aqueous iron(II) sulfate (FeSO₄) and plating solid elemental copper (Cu).',
    hints: [
      'Fe is above Cu in the activity series.',
      'Iron forms Fe²⁺ with sulfate (SO₄²⁻), giving FeSO₄(aq).',
      'Solid copper is produced: Cu(s).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'met-5',
    type: 'metal_sr',
    title: 'Silver metal placed into copper(II) nitrate solution',
    reactants: [
      { coefficient: 2, formula: 'Ag', state: 's' },
      { coefficient: 1, formula: 'Cu(NO3)2', state: 'aq' },
    ],
    isNoReaction: true,
    noReactionReason: 'Silver (Ag) is below Copper (Cu) in the metal activity series. Silver cannot replace copper from its aqueous salt.',
    products: [],
    balancedCoefficients: [2, 1],
    transitionMetalChargeNote: 'Silver forms Ag⁺, and Copper forms Cu²⁺.',
    explanation: 'NO REACTION: In the activity series, copper is more reactive than silver. A less active metal cannot displace a more active metal ion.',
    hints: [
      'Check the relative positions of Ag and Cu.',
      'Silver is lower than copper on the series.',
    ],
    difficulty: 'standard',
  },
  {
    id: 'met-6',
    type: 'metal_sr',
    title: 'Copper(II) chloride solution with aluminum metal added',
    reactants: [
      { coefficient: 3, formula: 'CuCl2', state: 'aq' },
      { coefficient: 2, formula: 'Al', state: 's' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 2, formula: 'AlCl3', state: 'aq' },
      { coefficient: 3, formula: 'Cu', state: 's' },
    ],
    balancedCoefficients: [3, 2, 2, 3],
    transitionMetalChargeNote: 'Copper forms the Cu²⁺ ion in CuCl₂, and Aluminum forms Al³⁺.',
    explanation: 'Aluminum is much higher than copper in the activity series. Aluminum forms Al³⁺ ions with chloride to yield AlCl₃(aq), releasing metallic copper Cu(s).',
    hints: [
      'Al is higher than Cu on the activity series.',
      'Al forms Al³⁺ and Cl is Cl⁻ -> AlCl₃(aq).',
      'Solid copper plates out: Cu(s).',
    ],
    difficulty: 'challenge',
  },
  {
    id: 'met-7',
    type: 'metal_sr',
    title: 'Zinc chloride solution with lead metal added',
    reactants: [
      { coefficient: 1, formula: 'ZnCl2', state: 'aq' },
      { coefficient: 1, formula: 'Pb', state: 's' },
    ],
    isNoReaction: true,
    noReactionReason: 'Lead (Pb) is below Zinc (Zn) in the activity series. Lead cannot displace zinc.',
    products: [],
    balancedCoefficients: [1, 1],
    transitionMetalChargeNote: 'Lead forms the Pb²⁺ ion, and Zinc forms Zn²⁺.',
    explanation: 'NO REACTION: Zinc is more reactive than lead (Zn is above Pb in the activity series). Lead cannot displace zinc cations.',
    hints: [
      'Find Pb and Zn on the activity series chart.',
      'Lead is below zinc, so it cannot react.',
    ],
    difficulty: 'standard',
  },
  {
    id: 'met-8',
    type: 'metal_sr',
    title: 'Sulfuric acid with magnesium ribbon added',
    reactants: [
      { coefficient: 1, formula: 'H2SO4', state: 'aq' },
      { coefficient: 1, formula: 'Mg', state: 's' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'MgSO4', state: 'aq' },
      { coefficient: 1, formula: 'H2', state: 'g' },
    ],
    balancedCoefficients: [1, 1, 1, 1],
    explanation: 'Magnesium is well above hydrogen in the activity series. It vigorously reacts with sulfuric acid to produce aqueous magnesium sulfate (MgSO₄) and hydrogen gas (H₂).',
    hints: [
      'Mg is high on the activity series above H.',
      'Sulfate is SO₄²⁻, and Mg forms Mg²⁺.',
      'Hydrogen gas evolves: H₂(g).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'met-9',
    type: 'metal_sr',
    title: 'Silver nitrate solution with nickel metal strip',
    reactants: [
      { coefficient: 2, formula: 'AgNO3', state: 'aq' },
      { coefficient: 1, formula: 'Ni', state: 's' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'Ni(NO3)2', state: 'aq' },
      { coefficient: 2, formula: 'Ag', state: 's' },
    ],
    balancedCoefficients: [2, 1, 1, 2],
    transitionMetalChargeNote: 'Nickel forms the Ni²⁺ ion, and Silver forms Ag⁺.',
    explanation: 'Nickel is higher than silver in the activity series (Ni > Ag). Nickel displaces silver to form aqueous nickel(II) nitrate and metallic solid silver crystals.',
    hints: [
      'Ni is higher than Ag on the activity series.',
      'Nickel forms Ni²⁺ with nitrate (NO₃⁻) -> Ni(NO₃)₂(aq).',
      'Solid silver precipitates: Ag(s).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'met-10',
    type: 'metal_sr',
    title: 'Magnesium sulfate solution with an iron nail added',
    reactants: [
      { coefficient: 1, formula: 'MgSO4', state: 'aq' },
      { coefficient: 1, formula: 'Fe', state: 's' },
    ],
    isNoReaction: true,
    noReactionReason: 'Iron (Fe) is below Magnesium (Mg) in the activity series. Iron cannot replace magnesium from its salt.',
    products: [],
    balancedCoefficients: [1, 1],
    transitionMetalChargeNote: 'Iron forms the Fe²⁺ ion.',
    explanation: 'NO REACTION: Magnesium is much higher in the activity series than iron. Iron cannot displace magnesium ions from solution.',
    hints: [
      'Look at Mg vs Fe in the activity series.',
      'Fe is lower than Mg, so no reaction happens.',
    ],
    difficulty: 'standard',
  },

  // ==========================================
  // 3. DOUBLE REPLACEMENT (PRECIPITATION)
  // ==========================================
  {
    id: 'ppt-1',
    type: 'double_replacement_ppt',
    title: 'Sodium chloride mixed with silver nitrate solution',
    reactants: [
      { coefficient: 1, formula: 'NaCl', state: 'aq' },
      { coefficient: 1, formula: 'AgNO3', state: 'aq' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'AgCl', state: 's' },
      { coefficient: 1, formula: 'NaNO3', state: 'aq' },
    ],
    balancedCoefficients: [1, 1, 1, 1],
    precipitate: 'AgCl',
    explanation: 'Silver ions (Ag⁺) combine with chloride ions (Cl⁻) to form silver chloride (AgCl), which is insoluble in water according to solubility rules and forms a white solid precipitate. Sodium nitrate remains dissolved in aqueous solution.',
    hints: [
      'Swap the positive ions: Ag⁺ with Cl⁻, and Na⁺ with NO₃⁻.',
      'Solubility rules: Chlorides are soluble EXCEPT with Ag⁺, Pb²⁺, and Hg₂²⁺.',
      'AgCl is an insoluble solid precipitate: AgCl(s).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'ppt-2',
    type: 'double_replacement_ppt',
    title: 'Sodium sulfate mixed with barium chloride solution',
    reactants: [
      { coefficient: 1, formula: 'Na2SO4', state: 'aq' },
      { coefficient: 1, formula: 'BaCl2', state: 'aq' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'BaSO4', state: 's' },
      { coefficient: 2, formula: 'NaCl', state: 'aq' },
    ],
    balancedCoefficients: [1, 1, 1, 2],
    precipitate: 'BaSO4',
    explanation: 'Barium ions (Ba²⁺) and sulfate ions (SO₄²⁻) form barium sulfate (BaSO₄), a heavy insoluble white solid precipitate. Sodium chloride remains dissolved as NaCl(aq).',
    hints: [
      'Swap the positive ions: Ba²⁺ with SO₄²⁻, and Na⁺ with Cl⁻.',
      'Sulfates are generally soluble EXCEPT with Ba²⁺, Pb²⁺, and Ca²⁺/Sr²⁺.',
      'BaSO₄ precipitates as a solid: BaSO₄(s).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'ppt-3',
    type: 'double_replacement_ppt',
    title: 'Potassium nitrate mixed with sodium chloride solution',
    reactants: [
      { coefficient: 1, formula: 'KNO3', state: 'aq' },
      { coefficient: 1, formula: 'NaCl', state: 'aq' },
    ],
    isNoReaction: true,
    noReactionReason: 'Both potential products, NaNO₃ and KCl, are completely soluble in water. Since no precipitate forms, all ions remain dissolved spectator ions in solution.',
    products: [],
    balancedCoefficients: [1, 1],
    explanation: 'NO REACTION: Swapping ions yields NaNO₃ and KCl. All nitrates (NO₃⁻) and all alkali metal salts (Na⁺, K⁺) are fully soluble. No solid precipitate forms, so no chemical change occurs.',
    hints: [
      'Predict the potential double replacement products: NaNO₃ and KCl.',
      'Check solubility rules: are either of these insoluble?',
      'Since both products remain aqueous (aq), there is No Reaction.',
    ],
    difficulty: 'standard',
  },
  {
    id: 'ppt-4',
    type: 'double_replacement_ppt',
    title: 'Potassium iodide mixed with lead(II) nitrate solution',
    reactants: [
      { coefficient: 2, formula: 'KI', state: 'aq' },
      { coefficient: 1, formula: 'Pb(NO3)2', state: 'aq' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'PbI2', state: 's' },
      { coefficient: 2, formula: 'KNO3', state: 'aq' },
    ],
    balancedCoefficients: [2, 1, 1, 2],
    precipitate: 'PbI2',
    explanation: 'Lead(II) ions (Pb²⁺) combine with iodide ions (I⁻) to form lead(II) iodide (PbI₂), which forms a brilliant golden yellow solid precipitate. Potassium nitrate remains dissolved in solution.',
    hints: [
      'Lead(II) is Pb²⁺, Iodide is I⁻ -> PbI₂(s).',
      'Iodides are soluble EXCEPT with Ag⁺, Pb²⁺, and Hg₂²⁺.',
      'PbI₂ is an insoluble solid (s).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'ppt-5',
    type: 'double_replacement_ppt',
    title: 'Sodium hydroxide mixed with copper(II) sulfate solution',
    reactants: [
      { coefficient: 2, formula: 'NaOH', state: 'aq' },
      { coefficient: 1, formula: 'CuSO4', state: 'aq' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'Cu(OH)2', state: 's' },
      { coefficient: 1, formula: 'Na2SO4', state: 'aq' },
    ],
    balancedCoefficients: [2, 1, 1, 1],
    precipitate: 'Cu(OH)2',
    explanation: 'Copper(II) ions (Cu²⁺) combine with hydroxide ions (OH⁻) to form copper(II) hydroxide, Cu(OH)₂, a light blue insoluble solid precipitate. Sodium sulfate remains dissolved.',
    hints: [
      'Hydroxides (OH⁻) are insoluble EXCEPT with alkali metals (Group 1) and Ba²⁺.',
      'Cu²⁺ with OH⁻ forms Cu(OH)₂(s).',
      'Na₂SO₄ remains aqueous (aq).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'ppt-6',
    type: 'double_replacement_ppt',
    title: 'Sodium nitrate mixed with ammonium chloride solution',
    reactants: [
      { coefficient: 1, formula: 'NaNO3', state: 'aq' },
      { coefficient: 1, formula: 'NH4Cl', state: 'aq' },
    ],
    isNoReaction: true,
    noReactionReason: 'Both potential products, NH₄NO₃ and NaCl, are completely soluble salts. All ions remain spectator ions in water.',
    products: [],
    balancedCoefficients: [1, 1],
    explanation: 'NO REACTION: Ammonium (NH₄⁺), sodium (Na⁺), and nitrate (NO₃⁻) salts are completely soluble. No insoluble solid precipitate forms.',
    hints: [
      'Check solubility for ammonium salts, sodium salts, and nitrate salts.',
      'If both products remain aqueous (aq), no precipitate forms.',
    ],
    difficulty: 'standard',
  },
  {
    id: 'ppt-7',
    type: 'double_replacement_ppt',
    title: 'Sodium carbonate mixed with calcium chloride solution',
    reactants: [
      { coefficient: 1, formula: 'Na2CO3', state: 'aq' },
      { coefficient: 1, formula: 'CaCl2', state: 'aq' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'CaCO3', state: 's' },
      { coefficient: 2, formula: 'NaCl', state: 'aq' },
    ],
    balancedCoefficients: [1, 1, 1, 2],
    precipitate: 'CaCO3',
    explanation: 'Calcium ions (Ca²⁺) react with carbonate ions (CO₃²⁻) to form calcium carbonate (CaCO₃), an insoluble chalk-like white solid precipitate.',
    hints: [
      'Carbonates (CO₃²⁻) are insoluble EXCEPT with Group 1 metals and ammonium.',
      'CaCO₃ is an insoluble solid precipitate: CaCO₃(s).',
    ],
    difficulty: 'standard',
  },
  {
    id: 'ppt-8',
    type: 'double_replacement_ppt',
    title: 'Sodium hydroxide mixed with iron(III) chloride solution',
    reactants: [
      { coefficient: 3, formula: 'NaOH', state: 'aq' },
      { coefficient: 1, formula: 'FeCl3', state: 'aq' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'Fe(OH)3', state: 's' },
      { coefficient: 3, formula: 'NaCl', state: 'aq' },
    ],
    balancedCoefficients: [3, 1, 1, 3],
    precipitate: 'Fe(OH)3',
    explanation: 'Iron(III) ions (Fe³⁺) combine with hydroxide ions (OH⁻) to form rust-colored iron(III) hydroxide, Fe(OH)₃, which is insoluble in water and forms a solid precipitate.',
    hints: [
      'Fe³⁺ requires three OH⁻ ions: Fe(OH)₃(s).',
      'Hydroxides of transition metals form insoluble precipitates.',
    ],
    difficulty: 'challenge',
  },
  {
    id: 'ppt-9',
    type: 'double_replacement_ppt',
    title: 'Potassium chloride mixed with barium nitrate solution',
    reactants: [
      { coefficient: 2, formula: 'KCl', state: 'aq' },
      { coefficient: 1, formula: 'Ba(NO3)2', state: 'aq' },
    ],
    isNoReaction: true,
    noReactionReason: 'Both potential products, BaCl₂ and KNO₃, are completely soluble in water. Since no solid precipitate forms, there is no reaction.',
    products: [],
    balancedCoefficients: [2, 1],
    explanation: 'NO REACTION: BaCl₂ is soluble in water, and all nitrate salts (KNO₃) are soluble. All ions remain spectator ions in solution.',
    hints: [
      'Potential products: BaCl₂ and KNO₃.',
      'Check if either is an insoluble precipitate according to solubility rules.',
    ],
    difficulty: 'standard',
  },
  {
    id: 'ppt-10',
    type: 'double_replacement_ppt',
    title: 'Silver nitrate mixed with potassium phosphate solution',
    reactants: [
      { coefficient: 3, formula: 'AgNO3', state: 'aq' },
      { coefficient: 1, formula: 'K3PO4', state: 'aq' },
    ],
    isNoReaction: false,
    products: [
      { coefficient: 1, formula: 'Ag3PO4', state: 's' },
      { coefficient: 3, formula: 'KNO3', state: 'aq' },
    ],
    balancedCoefficients: [3, 1, 1, 3],
    precipitate: 'Ag3PO4',
    explanation: 'Silver ions (Ag⁺) react with phosphate ions (PO₄³⁻) to form silver phosphate (Ag₃PO₄), a yellow insoluble solid precipitate. KNO₃ remains dissolved.',
    hints: [
      'Phosphates are insoluble except with Group 1 and ammonium.',
      'Ag⁺ with PO₄³⁻ forms Ag₃PO₄(s).',
    ],
    difficulty: 'challenge',
  },
];

// ==========================================
// 4 DISTINCT HOMEWORK QUESTION SETS
// Shuffled/interleaved reaction types (never 3 in a row of the same type)
// ==========================================
export const HOMEWORK_SETS: Record<number, ReactionProblem[]> = {
  // SET 1: Metal SR, Precipitation, Halogen SR (with CaBr2), Halogen SR (NR: hal-3 with CuCl2), Metal SR, Precipitation
  1: [
    REACTION_BANK.find((r) => r.id === 'met-1')!, // Metal SR
    REACTION_BANK.find((r) => r.id === 'ppt-1')!, // PPT
    REACTION_BANK.find((r) => r.id === 'hal-1')!, // Halogen SR (CaBr2 + Cl2)
    REACTION_BANK.find((r) => r.id === 'ppt-2')!, // PPT
    REACTION_BANK.find((r) => r.id === 'hal-3')!, // Halogen SR (NR: CuCl2 + I2)
    REACTION_BANK.find((r) => r.id === 'met-2')!, // Metal SR
  ],

  // SET 2: PPT, Halogen SR (MgI2), Metal SR (NR: met-3), PPT (NR: ppt-3), Halogen SR (ZnI2), Metal SR
  2: [
    REACTION_BANK.find((r) => r.id === 'ppt-4')!, // PPT
    REACTION_BANK.find((r) => r.id === 'hal-2')!, // Halogen SR (MgI2 + Br2)
    REACTION_BANK.find((r) => r.id === 'met-3')!, // Metal SR (NR)
    REACTION_BANK.find((r) => r.id === 'ppt-3')!, // PPT (NR)
    REACTION_BANK.find((r) => r.id === 'hal-4')!, // Halogen SR (ZnI2 + Cl2)
    REACTION_BANK.find((r) => r.id === 'met-4')!, // Metal SR
  ],

  // SET 3: Halogen SR (AlI3 + Br2), Metal SR (NR: met-5), PPT, Halogen SR (NR: BaF2 + Br2), PPT, Metal SR
  3: [
    REACTION_BANK.find((r) => r.id === 'hal-6')!, // Halogen SR (AlI3 + Br2)
    REACTION_BANK.find((r) => r.id === 'met-5')!, // Metal SR (NR)
    REACTION_BANK.find((r) => r.id === 'ppt-5')!, // PPT
    REACTION_BANK.find((r) => r.id === 'hal-5')!, // Halogen SR (NR: BaF2 + Br2)
    REACTION_BANK.find((r) => r.id === 'ppt-7')!, // PPT
    REACTION_BANK.find((r) => r.id === 'met-6')!, // Metal SR
  ],

  // SET 4: Metal SR, PPT (NR: ppt-6), Halogen SR (FeBr2 + Cl2), Metal SR, PPT, Halogen SR (NR: hal-7)
  4: [
    REACTION_BANK.find((r) => r.id === 'met-8')!, // Metal SR
    REACTION_BANK.find((r) => r.id === 'ppt-6')!, // PPT (NR)
    REACTION_BANK.find((r) => r.id === 'hal-8')!, // Halogen SR (FeBr2 + Cl2)
    REACTION_BANK.find((r) => r.id === 'met-9')!, // Metal SR
    REACTION_BANK.find((r) => r.id === 'ppt-8')!, // PPT
    REACTION_BANK.find((r) => r.id === 'hal-7')!, // Halogen SR (NR: KBr + I2)
  ],
};
