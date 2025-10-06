#!/usr/bin/env node

/**
 * Version Update Script
 * Updates version across all project files
 *
 * Usage:
 *   node scripts/update-version.js 0.2.3-alpha.1
 *   npm run version:update 0.2.3-alpha.1
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const newVersion = process.argv[2];

if (!newVersion) {
  console.error('❌ Error: Please provide a version number');
  console.log('Usage: node scripts/update-version.js 0.2.3-alpha.1');
  process.exit(1);
}

// Validate version format
if (!/^\d+\.\d+\.\d+-alpha\.\d+$/.test(newVersion)) {
  console.error('❌ Error: Invalid version format');
  console.log('Expected format: X.Y.Z-alpha.N (e.g., 0.2.3-alpha.1)');
  process.exit(1);
}

console.log(`\n🔄 Updating version to v${newVersion}...\n`);

// Files to update
const files = [
  {
    path: 'package.json',
    replacements: [
      { pattern: /"version":\s*"[^"]+",/, replacement: `"version": "${newVersion}",` }
    ]
  },
  {
    path: 'VERSION_STATUS.md',
    replacements: [
      { pattern: /\*\*Current Version:\*\* v[\d.]+-alpha\.\d+/, replacement: `**Current Version:** v${newVersion}` },
      { pattern: /## What's in v[\d.]+-alpha\.\d+\?/, replacement: `## What's in v${newVersion}?` },
      { pattern: /package\.json → v[\d.]+-alpha\.\d+/, replacement: `package.json → v${newVersion}` },
      { pattern: /\*\*Published:\*\* `ps-lang@[\d.]+-alpha\.\d+`/, replacement: `**Published:** \`ps-lang@${newVersion}\`` },
      { pattern: /### v[\d.]+-alpha\.\d+ \(Current\)/, replacement: `### v${newVersion} (Current)` },
      { pattern: /### Current \(v[\d.]+-alpha\.\d+\)/, replacement: `### Current (v${newVersion})` }
    ]
  },
  {
    path: 'README.md',
    replacements: [
      { pattern: /<strong>Version:<\/strong> [\d.]+-alpha\.\d+/, replacement: `<strong>Version:</strong> ${newVersion}` },
      { pattern: /## 🎉 New in v[\d.]+-alpha\.\d+/, replacement: `## 🎉 New in v${newVersion}` },
      { pattern: /\*\*PS-LANG™ v[\d.]+-alpha\.\d+\*\*/, replacement: `**PS-LANG™ v${newVersion}**` }
    ]
  },
  {
    path: 'ps-lang.dev/app/about/page.tsx',
    replacements: [
      { pattern: /v[\d.]+-alpha\.\d+ — Spec Released/, replacement: `v${newVersion} — Spec Released` }
    ]
  },
  {
    path: 'llms.txt',
    replacements: [
      { pattern: /# llms\.txt — PS-LANG v[\d.]+-alpha\.\d+/, replacement: `# llms.txt — PS-LANG v${newVersion}` },
      { pattern: /PS-LANG: Privacy-First Scripting Language for Multi-Agent Context Control \(v[\d.]+-alpha\.\d+\)/, replacement: `PS-LANG: Privacy-First Scripting Language for Multi-Agent Context Control (v${newVersion})` }
    ]
  },
  {
    path: 'llms-full.txt',
    replacements: [
      { pattern: /# llms-full\.txt — PS-LANG v[\d.]+-alpha\.\d+/, replacement: `# llms-full.txt — PS-LANG v${newVersion}` },
      { pattern: /Version: [\d.]+-alpha\.\d+/, replacement: `Version: ${newVersion}` },
      { pattern: /PS-LANG: Privacy-First Scripting Language for Multi-Agent Context Control \(v[\d.]+-alpha\.\d+\)/, replacement: `PS-LANG: Privacy-First Scripting Language for Multi-Agent Context Control (v${newVersion})` }
    ]
  },
  {
    path: 'bin/ps-lang.js',
    replacements: [
      { pattern: /Privacy-First Scripting Language v[\d.]+-alpha\.\d+/, replacement: `Privacy-First Scripting Language v${newVersion}` }
    ]
  }
];

let updatedCount = 0;

files.forEach(({ path: filePath, replacements }) => {
  const fullPath = path.join(ROOT, filePath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  Warning: ${filePath} not found, skipping`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let fileUpdated = false;

  replacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      fileUpdated = true;
    }
  });

  if (fileUpdated) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Updated ${filePath}`);
    updatedCount++;
  } else {
    console.log(`⏭️  No changes needed in ${filePath}`);
  }
});

console.log(`\n✨ Version update complete! Updated ${updatedCount} file(s)\n`);
console.log('Next steps:');
console.log('  1. Review changes: git diff');
console.log('  2. Commit: git add -A && git commit -m "chore: bump version to v' + newVersion + '"');
console.log('  3. Publish: npm publish --tag alpha');
console.log('  4. Push: git push\n');
