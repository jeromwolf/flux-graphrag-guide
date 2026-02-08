#!/usr/bin/env node
'use strict';

const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

const base = require('./pptx-base');

// Part metadata for filenames
const PARTS = [
  { part: 1, title: '왜_GraphRAG인가', file: 'part1-slides' },
  { part: 2, title: '수작업_KG', file: 'part2-slides' },
  { part: 3, title: 'LLM_자동화', file: 'part3-slides' },
  { part: 4, title: 'Entity_Resolution', file: 'part4-slides' },
  { part: 5, title: '멀티모달_VLM', file: 'part5-slides' },
  { part: 6, title: '통합_검색', file: 'part6-slides' },
  { part: 7, title: '실무_적용_가이드', file: 'part7-slides' },
];

async function buildPart(partInfo) {
  const contentPath = path.join(__dirname, 'content', `${partInfo.file}.js`);

  if (!fs.existsSync(contentPath)) {
    console.log(`  ⏭️  Part ${partInfo.part} — 콘텐츠 파일 없음, 건너뜀`);
    return null;
  }

  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'Root Bricks / Kelly';
  pres.company = 'Root Bricks Co., Ltd.';
  pres.subject = `GraphRAG 커리큘럼 Part ${partInfo.part}`;

  // Set default slide background
  pres.defineSlideMaster({
    title: 'DARK_BG',
    background: { color: '0A0E17' },
  });

  const buildSlides = require(contentPath);
  await buildSlides(pres, base);

  // Ensure output directory exists
  const outputDir = path.join(__dirname, '..', 'output', 'pptx');
  fs.mkdirSync(outputDir, { recursive: true });

  const filename = `Part${partInfo.part}_${partInfo.title}.pptx`;
  const outputPath = path.join(outputDir, filename);

  await pres.writeFile({ fileName: outputPath });
  console.log(`  ✅ ${filename}`);
  return outputPath;
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node scripts/build-pptx.js --all          모든 Part 빌드');
    console.log('  node scripts/build-pptx.js --part 1       Part 1만 빌드');
    console.log('  node scripts/build-pptx.js --part 1 3 5   Part 1,3,5 빌드');
    process.exit(0);
  }

  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  📊 GraphRAG 커리큘럼 PPT 빌드');
  console.log('═══════════════════════════════════════════');
  console.log('');

  let partsToBuild = [];

  if (args.includes('--all')) {
    partsToBuild = PARTS;
  } else if (args.includes('--part')) {
    const partIdx = args.indexOf('--part');
    const partNums = args.slice(partIdx + 1)
      .filter(a => !a.startsWith('--'))
      .map(Number)
      .filter(n => n >= 1 && n <= 7);

    if (partNums.length === 0) {
      console.error('Error: --part 뒤에 1~7 사이 숫자를 지정하세요');
      process.exit(1);
    }

    partsToBuild = PARTS.filter(p => partNums.includes(p.part));
  }

  console.log(`  빌드 대상: Part ${partsToBuild.map(p => p.part).join(', ')}`);
  console.log('');

  const results = [];
  for (const partInfo of partsToBuild) {
    console.log(`  🔨 Part ${partInfo.part}: ${partInfo.title}...`);
    try {
      const result = await buildPart(partInfo);
      if (result) results.push(result);
    } catch (err) {
      console.error(`  ❌ Part ${partInfo.part} 실패:`, err.message);
    }
  }

  console.log('');
  console.log('───────────────────────────────────────────');
  console.log(`  완료: ${results.length}/${partsToBuild.length} PPT 생성`);
  console.log(`  출력: output/pptx/`);
  console.log('───────────────────────────────────────────');
  console.log('');
}

main().catch(err => {
  console.error('빌드 오류:', err);
  process.exit(1);
});
