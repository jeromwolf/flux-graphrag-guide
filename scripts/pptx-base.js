/**
 * pptx-base.js — PPT 공통 헬퍼
 * GraphRAG 커리큘럼 다크 테마 프레젠테이션 빌더
 */
'use strict';

// ============================================================================
// Design System
// ============================================================================

const colors = {
  // Core
  bgDark: '0A0E17',
  background: '1A2234',
  bgCode: '0D1117',
  border: '1E2D45',

  // Accent
  accent: '06D6A0',
  primary: '118AB2',
  secondary: '8338EC',
  warning: 'F77F00',
  danger: 'EF476F',
  yellow: 'FFD166',
  success: '06D6A0',

  // Text
  white: 'FFFFFF',
  text: 'E8EDF5',
  gray: '8892A4',
  dim: '4A5568',

  // Section cycling
  sectionColors: {
    1: '06D6A0', // cyan
    2: '118AB2', // blue
    3: '8338EC', // purple
    4: 'F77F00', // orange
    5: '06D6A0', // cyan (cycle)
    6: '118AB2', // blue (cycle)
    7: '8338EC', // purple (cycle)
  },
};

const tagStyles = {
  theory:     { bg: '118AB2', color: 'FFFFFF', label: '\ud83d\udcd8 \uc774\ub860' },
  demo:       { bg: 'EF476F', color: 'FFFFFF', label: '\ud83d\udd34 \ub370\ubaa8' },
  practice:   { bg: '06D6A0', color: '0A0E17', label: '\ud83d\udfe2 \uc2e4\uc2b5' },
  discussion: { bg: '8338EC', color: 'FFFFFF', label: '\ud83d\udcac \ud1a0\ub860' },
};

function shadow() {
  return { type: 'outer', blur: 3, offset: 2, color: '000000', opacity: 0.3 };
}

// ============================================================================
// Low-level helpers
// ============================================================================

/** Add left color bar to a slide */
function _addLeftBar(slide, pres, color) {
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: 0.12, h: '100%',
    fill: { type: 'solid', color: color || colors.accent },
  });
}

/** Add tag badge */
function _addTagBadge(slide, tag) {
  const style = tagStyles[tag];
  if (!style) return;
  slide.addShape('rect', {
    x: 0.35, y: 0.25, w: 1.15, h: 0.32,
    fill: { type: 'solid', color: style.bg },
    rectRadius: 0.05,
  });
  slide.addText(style.label, {
    x: 0.35, y: 0.25, w: 1.15, h: 0.32,
    fontSize: 11, fontFace: 'Calibri', color: style.color,
    bold: true, align: 'center', valign: 'middle',
  });
}

// ============================================================================
// Slide Header & Footer (used by custom slides in part content)
// ============================================================================

function addSlideHeader(slide, title, tag) {
  slide.background = { fill: colors.bgDark };
  if (tag) _addTagBadge(slide, tag);
  slide.addText(title, {
    x: 0.35, y: tag ? 0.68 : 0.25, w: 9.3, h: 0.5,
    fontSize: 24, fontFace: 'Trebuchet MS', color: colors.text, bold: true,
  });
}

function addSlideFooter(slide, partNum) {
  slide.addText(`Part ${partNum} · GraphRAG 커리큘럼`, {
    x: 0.3, y: 5.0, w: 9.4, h: 0.3,
    fontSize: 9, fontFace: 'Calibri', color: colors.dim, align: 'right',
  });
}

// ============================================================================
// Title Slide
// ============================================================================

function addTitleSlide(pres, meta) {
  const slide = pres.addSlide();
  slide.background = { fill: colors.bgDark };

  // Top accent bar
  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: 0.25,
    fill: { type: 'solid', color: colors.accent },
  });

  // Badge
  slide.addText(`Part ${meta.part} of 7 \u00b7 ${meta.subtitle}`, {
    x: 0.5, y: 1.0, w: 9, h: 0.4,
    fontSize: 14, fontFace: 'Calibri', color: colors.gray, bold: true,
  });

  // Title
  slide.addText(meta.title, {
    x: 0.5, y: 1.8, w: 9, h: 1.2,
    fontSize: 42, fontFace: 'Trebuchet MS', color: colors.text, bold: true,
    valign: 'middle',
  });

  // Meta row
  const y = 3.6;
  const cards = [
    { x: 0.5, w: 2.4, lines: ['\u23f1\ufe0f \uc18c\uc694\uc2dc\uac04', meta.duration] },
    { x: 3.1, w: 2.4, lines: ['\ub09c\uc774\ub3c4', '\u2b50'.repeat(meta.difficulty)] },
    { x: 5.7, w: 3.8, lines: ['\ud83c\udfc6 \ub9c8\uc77c\uc2a4\ud1a4', meta.milestone] },
  ];
  cards.forEach(c => {
    slide.addShape(pres.ShapeType.rect, {
      x: c.x, y, w: c.w, h: 0.85,
      fill: { type: 'solid', color: colors.background },
      line: { color: colors.border, width: 1 },
    });
    slide.addText([
      { text: c.lines[0] + '\n', options: { fontSize: 10, color: colors.gray } },
      { text: c.lines[1], options: { fontSize: 12, color: colors.text, bold: true } },
    ], { x: c.x, y, w: c.w, h: 0.85, align: 'center', valign: 'middle', fontFace: 'Calibri' });
  });
}

// ============================================================================
// Section Header
// ============================================================================

function addSectionHeader(pres, { sectionNum, sectionTitle, sectionDuration, sectionColor }) {
  const slide = pres.addSlide();
  slide.background = { fill: colors.bgDark };
  const sc = sectionColor || colors.sectionColors[sectionNum] || colors.accent;

  _addLeftBar(slide, pres, sc);

  // Number circle
  slide.addShape(pres.ShapeType.ellipse, {
    x: 1.0, y: 1.8, w: 1.3, h: 1.3,
    fill: { type: 'solid', color: sc },
  });
  slide.addText(String(sectionNum).padStart(2, '0'), {
    x: 1.0, y: 1.8, w: 1.3, h: 1.3,
    fontSize: 44, fontFace: 'Trebuchet MS', color: colors.bgDark,
    bold: true, align: 'center', valign: 'middle',
  });

  // Title
  slide.addText(sectionTitle, {
    x: 2.8, y: 1.9, w: 6.5, h: 0.6,
    fontSize: 32, fontFace: 'Trebuchet MS', color: colors.text, bold: true,
  });

  // Duration
  if (sectionDuration) {
    slide.addText(`\u23f1\ufe0f ${sectionDuration}`, {
      x: 2.8, y: 2.6, w: 3, h: 0.35,
      fontSize: 14, fontFace: 'Calibri', color: colors.gray,
    });
  }
}

// ============================================================================
// Content Slide (generic)
// ============================================================================

function addContentSlide(pres, { title, slideType, content }) {
  const slide = pres.addSlide();
  slide.background = { fill: colors.bgDark };

  if (slideType) _addTagBadge(slide, slideType);

  slide.addText(title, {
    x: 0.35, y: slideType ? 0.68 : 0.25, w: 9.3, h: 0.5,
    fontSize: 24, fontFace: 'Trebuchet MS', color: colors.text, bold: true,
  });

  if (!content) return slide;

  content.forEach(item => {
    const baseY = item.y || 1.4;
    if (item.type === 'large_text') {
      slide.addText(item.text, {
        x: 0.5, y: baseY, w: 9, h: 1.5,
        fontSize: item.fontSize || 28, fontFace: 'Trebuchet MS',
        color: item.color || colors.text, bold: !!item.bold,
        align: 'center', valign: 'middle',
      });
    } else if (item.type === 'text') {
      slide.addText(item.text, {
        x: 0.5, y: baseY, w: 9, h: 1.2,
        fontSize: item.fontSize || 14, fontFace: 'Calibri',
        color: item.color || colors.text, bold: !!item.bold,
        valign: 'top',
      });
    } else if (item.type === 'callout') {
      const cy = item.y || 3.8;
      slide.addShape(pres.ShapeType.rect, {
        x: 0.5, y: cy, w: 9, h: 0.9,
        fill: { type: 'solid', color: colors.background },
        line: { color: item.color || colors.accent, width: 2 },
        shadow: shadow(),
      });
      slide.addText(item.text, {
        x: 0.7, y: cy + 0.1, w: 8.6, h: 0.7,
        fontSize: 14, fontFace: 'Calibri', color: colors.text, valign: 'middle',
      });
    }
  });

  return slide;
}

// ============================================================================
// Code Slide
// ============================================================================

function addCodeSlide(pres, { title, slideType, language, code, notes }) {
  const slide = pres.addSlide();
  slide.background = { fill: colors.bgDark };
  if (slideType) _addTagBadge(slide, slideType);

  slide.addText(title, {
    x: 0.35, y: slideType ? 0.68 : 0.25, w: 9.3, h: 0.5,
    fontSize: 24, fontFace: 'Trebuchet MS', color: colors.text, bold: true,
  });

  const cy = 1.35;
  const codeLines = typeof code === 'string' ? code.split('\n').slice(0, 8) : code.slice(0, 8);

  // Code block (left)
  slide.addShape(pres.ShapeType.rect, {
    x: 0.35, y: cy, w: 5.3, h: 3.7,
    fill: { type: 'solid', color: colors.bgCode },
    line: { color: colors.border, width: 1 },
  });
  if (language) {
    slide.addText(language.toUpperCase(), {
      x: 0.45, y: cy + 0.08, w: 1.2, h: 0.22,
      fontSize: 9, fontFace: 'Calibri', color: colors.dim, bold: true,
    });
  }
  slide.addText(codeLines.join('\n'), {
    x: 0.45, y: cy + 0.35, w: 5.1, h: 3.2,
    fontSize: 10, fontFace: 'Consolas', color: colors.text, valign: 'top',
    paraSpaceAfter: 2,
  });

  // Notes (right)
  if (notes) {
    const noteText = typeof notes === 'string' ? notes : notes.join('\n');
    slide.addShape(pres.ShapeType.rect, {
      x: 5.85, y: cy, w: 3.8, h: 3.7,
      fill: { type: 'solid', color: colors.background },
      line: { color: colors.border, width: 1 },
      shadow: shadow(),
    });
    slide.addText('\ud83d\udca1 \uc124\uba85', {
      x: 6.0, y: cy + 0.15, w: 3.5, h: 0.3,
      fontSize: 13, fontFace: 'Calibri', color: colors.accent, bold: true,
    });
    slide.addText(noteText, {
      x: 6.0, y: cy + 0.55, w: 3.5, h: 3.0,
      fontSize: 12, fontFace: 'Calibri', color: colors.text, valign: 'top',
    });
  }

  return slide;
}

// ============================================================================
// Comparison Table
// ============================================================================

function addComparisonTable(pres, { title, slideType, headers, rows, callout }) {
  const slide = pres.addSlide();
  slide.background = { fill: colors.bgDark };
  if (slideType) _addTagBadge(slide, slideType);

  slide.addText(title, {
    x: 0.35, y: slideType ? 0.68 : 0.25, w: 9.3, h: 0.5,
    fontSize: 24, fontFace: 'Trebuchet MS', color: colors.text, bold: true,
  });

  const ty = 1.35;
  const colW = 9.3 / headers.length;
  const rowH = 0.5;
  const tableRows = [headers, ...rows];

  tableRows.forEach((row, ri) => {
    const isHeader = ri === 0;
    row.forEach((cell, ci) => {
      const x = 0.35 + ci * colW;
      const y = ty + ri * rowH;
      // Cell bg
      slide.addShape(pres.ShapeType.rect, {
        x, y, w: colW, h: rowH,
        fill: { type: 'solid', color: isHeader ? (colors.sectionColors[1]) : (ri % 2 === 0 ? colors.background : colors.bgDark) },
        line: { color: colors.border, width: 0.5 },
      });
      // Cell text
      const cellColor = cell.includes('\u2705') ? '06D6A0'
        : cell.includes('\u274c') ? 'EF476F'
        : cell.includes('\u26a0\ufe0f') ? 'F77F00'
        : isHeader ? colors.bgDark : colors.text;
      slide.addText(cell, {
        x, y, w: colW, h: rowH,
        fontSize: isHeader ? 12 : 11, fontFace: 'Calibri',
        color: cellColor, bold: isHeader,
        align: 'center', valign: 'middle',
      });
    });
  });

  if (callout) {
    const callY = ty + tableRows.length * rowH + 0.3;
    slide.addShape(pres.ShapeType.rect, {
      x: 0.35, y: callY, w: 9.3, h: 0.55,
      fill: { type: 'solid', color: colors.background },
      line: { color: colors.accent, width: 2 },
    });
    slide.addText(callout, {
      x: 0.5, y: callY, w: 9, h: 0.55,
      fontSize: 12, fontFace: 'Calibri', color: colors.text,
      align: 'center', valign: 'middle',
    });
  }

  return slide;
}

// ============================================================================
// Flow Diagram
// ============================================================================

function addFlowDiagram(pres, { title, slideType, steps, bottomText, callout }) {
  const slide = pres.addSlide();
  slide.background = { fill: colors.bgDark };
  if (slideType) _addTagBadge(slide, slideType);

  slide.addText(title, {
    x: 0.35, y: slideType ? 0.68 : 0.25, w: 9.3, h: 0.5,
    fontSize: 24, fontFace: 'Trebuchet MS', color: colors.text, bold: true,
  });

  const n = steps.length;
  const totalW = 9.0;
  const nodeW = Math.min(1.8, (totalW - (n - 1) * 0.6) / n);
  const gap = (totalW - n * nodeW) / Math.max(n - 1, 1);
  const startX = 0.5;
  const nodeY = 2.0;
  const nodeH = 0.9;

  steps.forEach((step, i) => {
    const x = startX + i * (nodeW + gap);
    const fillColor = step.color || colors.accent;

    slide.addShape(pres.ShapeType.rect, {
      x, y: nodeY, w: nodeW, h: nodeH,
      fill: { type: 'solid', color: fillColor },
      line: { color: colors.border, width: 1 },
      shadow: shadow(),
      rectRadius: 0.08,
    });
    slide.addText(step.text, {
      x, y: nodeY, w: nodeW, h: nodeH,
      fontSize: 11, fontFace: 'Calibri', color: colors.white,
      bold: true, align: 'center', valign: 'middle',
    });

    // Arrow
    if (i < n - 1) {
      const arrowX = x + nodeW + 0.05;
      const arrowW = gap - 0.1;
      if (arrowW > 0.1) {
        slide.addShape(pres.ShapeType.rightArrow, {
          x: arrowX, y: nodeY + nodeH / 2 - 0.12, w: arrowW, h: 0.24,
          fill: { type: 'solid', color: colors.dim },
        });
      }
    }
  });

  if (bottomText) {
    slide.addText(bottomText, {
      x: 0.5, y: nodeY + nodeH + 0.4, w: 9, h: 0.4,
      fontSize: 14, fontFace: 'Calibri', color: colors.danger,
      align: 'center', bold: true,
    });
  }

  if (callout) {
    const cy = bottomText ? nodeY + nodeH + 1.0 : nodeY + nodeH + 0.5;
    slide.addShape(pres.ShapeType.rect, {
      x: 0.5, y: cy, w: 9, h: 0.55,
      fill: { type: 'solid', color: colors.background },
      line: { color: colors.accent, width: 2 },
    });
    slide.addText(callout, {
      x: 0.7, y: cy, w: 8.6, h: 0.55,
      fontSize: 13, fontFace: 'Calibri', color: colors.text,
      align: 'center', valign: 'middle',
    });
  }

  return slide;
}

// ============================================================================
// Two-Column Cards
// ============================================================================

function addTwoColumnCards(pres, { title, slideType, leftTitle, leftItems, rightTitle, rightItems }) {
  const slide = pres.addSlide();
  slide.background = { fill: colors.bgDark };
  if (slideType) _addTagBadge(slide, slideType);

  slide.addText(title, {
    x: 0.35, y: slideType ? 0.68 : 0.25, w: 9.3, h: 0.5,
    fontSize: 24, fontFace: 'Trebuchet MS', color: colors.text, bold: true,
  });

  const cy = 1.35;
  const cardW = 4.4;
  const cardH = 3.5;

  // helper: draw one card
  function drawCard(x, cardTitle, items, headerColor) {
    slide.addShape(pres.ShapeType.rect, {
      x, y: cy, w: cardW, h: cardH,
      fill: { type: 'solid', color: colors.background },
      line: { color: colors.border, width: 1 },
      shadow: shadow(),
    });
    // Header
    slide.addShape(pres.ShapeType.rect, {
      x, y: cy, w: cardW, h: 0.5,
      fill: { type: 'solid', color: headerColor },
    });
    slide.addText(cardTitle, {
      x, y: cy, w: cardW, h: 0.5,
      fontSize: 16, fontFace: 'Calibri', color: colors.white,
      bold: true, align: 'center', valign: 'middle',
    });
    // Items
    const itemsText = items.map(it => `\u2022 ${it}`).join('\n');
    slide.addText(itemsText, {
      x: x + 0.2, y: cy + 0.65, w: cardW - 0.4, h: cardH - 0.8,
      fontSize: 13, fontFace: 'Calibri', color: colors.text, valign: 'top',
      lineSpacingMultiple: 1.5,
    });
  }

  drawCard(0.35, leftTitle, leftItems, colors.primary);
  drawCard(5.25, rightTitle, rightItems, colors.secondary);

  return slide;
}

// ============================================================================
// Milestone Slide
// ============================================================================

function addMilestoneSlide(pres, meta) {
  const slide = pres.addSlide();
  slide.background = { fill: colors.bgDark };

  slide.addText('\ud83c\udfc6', {
    x: 3.5, y: 1.0, w: 3, h: 1.2,
    fontSize: 72, align: 'center', valign: 'middle',
  });

  slide.addText(`Part ${meta.part} \uc644\ub8cc`, {
    x: 1, y: 2.3, w: 8, h: 0.7,
    fontSize: 36, fontFace: 'Trebuchet MS', color: colors.text,
    bold: true, align: 'center', valign: 'middle',
  });

  slide.addText(meta.milestone, {
    x: 1, y: 3.1, w: 8, h: 0.8,
    fontSize: 18, fontFace: 'Calibri', color: colors.accent,
    align: 'center', valign: 'middle',
  });
}

// ============================================================================
// Next Preview Slide
// ============================================================================

function addNextPreviewSlide(pres, meta) {
  if (!meta.nextPreview) return;

  const slide = pres.addSlide();
  slide.background = { fill: colors.bgDark };

  slide.addShape(pres.ShapeType.rect, {
    x: 0, y: 0, w: '100%', h: 0.25,
    fill: { type: 'solid', color: colors.secondary },
  });

  slide.addText('\ub2e4\uc74c \uc2dc\uac04\uc5d0...', {
    x: 1, y: 1.5, w: 8, h: 0.5,
    fontSize: 18, fontFace: 'Calibri', color: colors.gray, align: 'center',
  });

  slide.addText(meta.nextPreview.title, {
    x: 1, y: 2.2, w: 8, h: 0.8,
    fontSize: 32, fontFace: 'Trebuchet MS', color: colors.text,
    bold: true, align: 'center', valign: 'middle',
  });

  slide.addText(meta.nextPreview.description, {
    x: 1.5, y: 3.3, w: 7, h: 1.0,
    fontSize: 16, fontFace: 'Calibri', color: colors.gray,
    align: 'center', valign: 'top',
  });
}

// ============================================================================
// Exports
// ============================================================================

module.exports = {
  colors,
  tagStyles,
  shadow,
  addSlideHeader,
  addSlideFooter,
  addTitleSlide,
  addSectionHeader,
  addContentSlide,
  addCodeSlide,
  addComparisonTable,
  addFlowDiagram,
  addTwoColumnCards,
  addMilestoneSlide,
  addNextPreviewSlide,
};
