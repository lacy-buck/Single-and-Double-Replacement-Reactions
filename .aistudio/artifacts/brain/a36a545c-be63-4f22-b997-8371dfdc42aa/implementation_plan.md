# ReactionLab: High School Chemistry Reaction Predictor & Homework

An interactive educational mastery platform designed for high school chemistry students to practice predicting products, identifying reaction types, determining "No Reaction" conditions, balancing chemical equations, and completing graded homework sets with clean PDF generation.

> [!IMPORTANT]
> **Confirmed User Decisions:**
> - **Product Entry:** Smart text input featuring live automatic subscript formatting and whitespace/order-independent formula parsing.
> - **Reference Charts:** Quick-access interactive slide-over drawer featuring the Metal Activity Series, Halogen Activity Series, and Precipitation Solubility Rules.
> - **Homework PDF Export:** Concise, publication-grade PDF containing Student Name, Date/Period, Total Score/Percentage, and the Final Balanced Equations (or No Reaction designations).

---

## 1. Overview & Core Concept

**ReactionLab** teaches students the core principles governing inorganic replacement reactions in introductory and AP Chemistry:
1. **Halogen Single Replacement**: Relative activity of halogens ($F_2 > Cl_2 > Br_2 > I_2$).
2. **Metal Single Replacement**: Activity series of metals relative to aqueous metal cations and hydrogen ions.
3. **Double Replacement (Precipitation)**: Identifying whether mixing two aqueous ionic salts produces an insoluble precipitate ($s$) via solubility guidelines, or yields "No Reaction" when both ion pairs remain soluble spectator ions.
4. **Mixed Practice**: Three-phase mastery flow:
   - **Phase 1**: Classify the reaction type.
   - **Phase 2**: Predict the chemical formulas of the products (or recognize "No Reaction").
   - **Phase 3**: Balance the resulting equation with integer coefficients.
5. **Graded Homework Module**: A randomized or fixed 6-question assignment containing exactly 2 Halogen SR, 2 Metal SR, and 2 Double Replacement Precipitation questions with 1–2 "No Reaction" problems. Upon completing the set, students can download a clean PDF report displaying their name, score, and final balanced equations.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme
- **Theme**: Laboratory Workbench Clean Light Aesthetic (`#F8FAFC` slate canvas, `#FFFFFF` crisp card surfaces, `1px solid #E2E8F0` hairline borders).
- **Typography**: Display typography using clean geometric sans (`Plus Jakarta Sans`), body in high-legibility sans, and chemical equations rendered in monospace tabular typography (`IBM Plex Mono` / `JetBrains Mono` / KaTeX style).
- **Color Budget (60-30-10)**:
  - 60% neutral laboratory background (`#F8FAFC`).
  - 30% structural cards and reference tables (`#FFFFFF` with subtle slate borders).
  - 10% educational focal accents (Deep Navy `#0F172A`, Cobalt Blue `#2563EB` for active selections, Emerald `#059669` for correct validation, Amber `#D97706` for hints and warnings).

### Interactive Flow & Navigation
- **Top Navigation Bar**: Single-line brand mark (`ReactionLab`), tab switcher with 5 focused modes (*Halogen SR*, *Metal SR*, *Double Replacement*, *Mixed Practice*, *Homework Assessment*), and an "Open Reference Tables" toggle button.
- **Problem Card**:
  - Clear reaction reactants banner (e.g., $\text{Cl}_2\ (g) + \text{KBr}\ (aq) \rightarrow \text{?}$).
  - Live Chemical Formula Bar with smart auto-subscripting (typing `NaCl + Br2` renders as $\text{NaCl} + \text{Br}_2$).
  - Quick "No Reaction (NR)" toggle with reasoning selection.
  - Interactive coefficient steppers for balancing once products are verified.
  - Step-by-step guidance and immediate explanation on demand.
- **Reference Drawer**:
  - **Metal Activity Series**: Listed from Lithium down to Gold, annotated with reactions with water, acids, and oxygen.
  - **Halogen Activity Series**: Clean vertical hierarchy ($F_2 > Cl_2 > Br_2 > I_2$).
  - **Solubility Guidelines**: Soluble ionic categories vs insoluble precipitate rules with common exceptions.
  - **Common Polyatomic Ions**: Quick charges cheat sheet ($NO_3^-$, $SO_4^{2-}$, $CO_3^{2-}$, $PO_4^{3-}$, $OH^-$, $NH_4^+$).

---

## 3. Key Architectural Decisions & Problem Engine

```
┌─────────────────────────────────────────────────────────────┐
│                       Top Navigation Bar                    │
│  [ReactionLab]  [Halogen] [Metal] [Precip] [Mixed] [Homework]  │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│       Practice / Mixed       │ │     Homework Module (6 Qs)   │
│  - Step 1: Type Selection    │ │  - 2 Halogen SR              │
│  - Step 2: Product Predict   │ │  - 2 Metal SR                │
│    (Smart auto-subscripting) │ │  - 2 Double Replacement PPT  │
│  - Step 3: Equation Balance  │ │  - 1-2 No Reaction Scenarios │
│  - Immediate feedback & hint │ │  - Score tally & validation  │
└──────────────┬───────────────┘ └──────────────┬───────────────┘
               │                                │
               │                                ▼
               │                 ┌──────────────────────────────┐
               │                 │       jsPDF Generator        │
               │                 │  - Student Name & Score      │
               │                 │  - Final Balanced Equations  │
               │                 └──────────────────────────────┘
               ▼
┌──────────────────────────────────────────────────────────────┐
│                 Slide-Over Reference Drawer                  │
│  - Metal Activity Series · Halogen Activity · Solubility     │
└──────────────────────────────────────────────────────────────┘
```

### 1. Robust Chemistry Engine (`chemistryEngine.ts`)
- Curated bank of real high school chemistry reactions across all three categories, with accurate states of matter, balanced stoichiometry, and scientifically verified "No Reaction" cases.
- **Smart Formula Normalization**:
  - Automatically parses chemical formulas, handles polyatomic groupings (e.g. `Ca(NO3)2`), and supports commutative product order (e.g., `2NaCl + Br2` or `Br2 + 2NaCl`).
  - Distinguishes "No Reaction" from standard products.
- **Auto-Subscript Parser**:
  - Live input formatter converts trailing digits into subscripts (e.g., `H2SO4` $\to$ $\text{H}_2\text{SO}_4$) while allowing normal editing, backspacing, and plus signs.

### 2. Client-Side PDF Generation with `jspdf`
- Lightweight, zero-server-dependency PDF generation directly in the browser using `jspdf`.
- Formatted as a clean academic score sheet with:
  - Header: School Chemistry Department / ReactionLab Report
  - Student Name, Submission Date, and Class Period
  - Final Performance Score (e.g., 6 / 6 — 100%)
  - Clean table with Question #, Reaction Type, Initial Reactants, Final Balanced Equation / NR Status, and Result.

---

## 4. Implementation Steps & Milestones

1. **Install Dependencies**: Install `jspdf` for client-side PDF document generation.
2. **Chemistry Data & Logic**: Implement `src/data/reactions.ts` and `src/utils/chemistry.ts` containing the full curriculum bank of Halogen SR, Metal SR, and Precipitation double replacements with activity series checks and solubility tables.
3. **Smart Formula Input Component**: Build `src/components/SmartFormulaInput.tsx` with live subscript formatting, clear error handling, and keyboard conveniences.
4. **Interactive Practice Views**:
   - Single Replacement (Halogen) tab.
   - Single Replacement (Metal) tab.
   - Double Replacement (Precipitation) tab.
   - Mixed Practice tab (Sequential: Identify Type $\to$ Predict Products $\to$ Balance).
5. **Interactive Reference Drawer**: Build `src/components/ReferenceDrawer.tsx` for fast student reference during problem solving.
6. **Homework Module & PDF Generator**:
   - Build 6-question homework session with progress tracking and completion review.
   - Implement `src/utils/generatePdf.ts` generating the concise PDF report (student name, score, balanced equations).
7. **Verification**: Run `compile_applet` and verify all reactive flows and edge cases.
