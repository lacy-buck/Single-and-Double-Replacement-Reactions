import { jsPDF } from 'jspdf';
import { HomeworkSession } from '../types/chemistry';
import { getFullEquation, getReactionTypeLabel } from './chemistry';

export function exportHomeworkPdf(session: HomeworkSession): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;

  // Header banner styling
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, 40, contentWidth, 58, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('CHEMISTRY REACTION HOMEWORK', margin + 18, 65);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`Single Replacement & Precipitation Assessment · Homework Set ${session.setNumber || 1}`, margin + 18, 80);

  // Calculate score
  let correctCount = 0;
  session.problems.forEach((p) => {
    const attempt = session.attempts[p.id];
    if (attempt) {
      if (p.isNoReaction) {
        if (attempt.isDeclaredNoReaction || attempt.isProductsCorrect) {
          correctCount++;
        }
      } else {
        if (attempt.isProductsCorrect && attempt.isStatesCorrect && attempt.isBalancedCorrect) {
          correctCount++;
        }
      }
    }
  });

  const total = session.problems.length;
  const percentage = Math.round((correctCount / total) * 100);

  // Student details section (Student name, score, and final balanced equations only — no class period)
  let y = 115;
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, y, contentWidth, 50, 4, 4, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text('Student Name:', margin + 16, y + 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(session.studentName || 'Student', margin + 95, y + 22);

  const dateStr = session.completedAt
    ? new Date(session.completedAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.text('Date Completed:', margin + 16, y + 38);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(dateStr, margin + 105, y + 38);

  // Score Badge in box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Score:', margin + contentWidth - 110, y + 22);

  const scoreColor = percentage >= 80 ? [16, 149, 90] : [220, 38, 38];
  doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
  doc.setFontSize(14);
  doc.text(`${correctCount} / ${total} (${percentage}%)`, margin + contentWidth - 110, y + 38);

  // Section Heading
  y += 70;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Final Balanced Chemical Equations', margin, y);

  // Divider line
  y += 8;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + contentWidth, y);
  y += 18;

  // List of problems and their final balanced equations
  session.problems.forEach((problem, index) => {
    const attempt = session.attempts[problem.id];
    let isProblemCorrect = false;
    if (problem.isNoReaction) {
      isProblemCorrect = Boolean(attempt && (attempt.isDeclaredNoReaction || attempt.isProductsCorrect));
    } else {
      isProblemCorrect = Boolean(attempt && attempt.isProductsCorrect && attempt.isStatesCorrect && attempt.isBalancedCorrect);
    }

    const cardHeight = 62;
    if (y + cardHeight > 730) {
      doc.addPage();
      y = 45;
    }

    // Card background
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 4, 4, 'FD');

    // Left status accent line
    doc.setFillColor(isProblemCorrect ? 16 : 220, isProblemCorrect ? 149 : 38, isProblemCorrect ? 90 : 38);
    doc.rect(margin, y, 4, cardHeight, 'F');

    // Problem Number & Type
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Question ${index + 1}: ${getReactionTypeLabel(problem.type)}`, margin + 14, y + 17);

    // Status label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(isProblemCorrect ? 16 : 220, isProblemCorrect ? 149 : 38, isProblemCorrect ? 90 : 38);
    doc.text(isProblemCorrect ? 'CORRECT' : 'INCOMPLETE / INCORRECT', margin + contentWidth - 14, y + 17, { align: 'right' });

    // Final balanced equation with states
    const equation = getFullEquation(problem);
    doc.setFont('courier', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(equation, margin + 14, y + 36);

    // Context note
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    if (problem.isNoReaction) {
      doc.text(`Condition: No Reaction (less active species or soluble spectator ions)`, margin + 14, y + 52);
    } else if (problem.precipitate) {
      doc.text(`Precipitate: Insoluble ${problem.precipitate}(s) forms as a solid precipitate`, margin + 14, y + 52);
    } else {
      doc.text(`Reaction: Single replacement displacement`, margin + 14, y + 52);
    }

    y += cardHeight + 10;
  });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const footerText = `ReactionLab Assessment • Homework Set ${session.setNumber || 1} • Student: ${session.studentName || 'Student'}`;
  doc.text(footerText, margin, 755);

  const safeFilename = `${(session.studentName || 'Chemistry_Student').replace(/[^a-zA-Z0-9]/g, '_')}_Homework_Set_${session.setNumber || 1}.pdf`;
  doc.save(safeFilename);
}
