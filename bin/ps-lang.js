#!/usr/bin/env node

/**
 * PS-LANG CLI - Alpha Testing Phase
 * Claude Code support only
 *
 * Usage:
 *   npx ps-lang init        # Initialize .ps-lang in current project
 *   npx ps-lang check       # Validate PS-LANG syntax
 *   npx ps-lang help        # Show help
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const command = process.argv[2] || 'help';

// Color helpers
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

// Commands
async function init() {
  const cwd = process.cwd();
  const psLangDir = join(cwd, '.ps-lang');

  log('\n🚀 Initializing PS-LANG in your project...\n', 'bright');

  // Check if already initialized
  if (existsSync(psLangDir)) {
    warning('.ps-lang directory already exists!');
    const response = await askQuestion('Overwrite? (y/N): ');
    if (response.toLowerCase() !== 'y') {
      info('Initialization cancelled.');
      return;
    }
  }

  // Create .ps-lang directory
  mkdirSync(psLangDir, { recursive: true });
  success('Created .ps-lang/ directory');

  // Create subdirectories
  const dirs = ['config', 'templates', 'schemas', 'examples'];
  dirs.forEach(dir => {
    mkdirSync(join(psLangDir, dir), { recursive: true });
    success(`Created .ps-lang/${dir}/`);
  });

  // Copy template files
  const templatesDir = join(__dirname, '..', 'templates', '.ps-lang');

  const files = [
    { src: 'config/ps-lang.config.json', dest: 'config/ps-lang.config.json' },
    { src: 'config/claude-commands.json', dest: 'config/claude-commands.json' },
    { src: 'templates/journal-template.psl', dest: 'templates/journal-template.psl' },
    { src: 'templates/log-template.psl', dest: 'templates/log-template.psl' },
    { src: 'schemas/psl-schema.json', dest: 'schemas/psl-schema.json' },
    { src: 'examples/basic-zones.md', dest: 'examples/basic-zones.md' },
    { src: 'README.md', dest: 'README.md' },
  ];

  files.forEach(({ src, dest }) => {
    const srcPath = join(templatesDir, src);
    const destPath = join(psLangDir, dest);

    if (existsSync(srcPath)) {
      copyFileSync(srcPath, destPath);
      success(`Created .ps-lang/${dest}`);
    } else {
      // Create placeholder if template doesn't exist
      const content = generatePlaceholder(dest);
      writeFileSync(destPath, content);
      success(`Generated .ps-lang/${dest}`);
    }
  });

  // Add to .gitignore
  const gitignorePath = join(cwd, '.gitignore');
  let gitignoreContent = existsSync(gitignorePath)
    ? readFileSync(gitignorePath, 'utf-8')
    : '';

  if (!gitignoreContent.includes('.ps-lang/config/user-')) {
    const addition = `
# PS-LANG user-specific files
.ps-lang/config/user-*.json
.ps-lang/.cache/
`;
    writeFileSync(gitignorePath, gitignoreContent + addition);
    success('Updated .gitignore');
  }

  log('\n✨ PS-LANG initialized successfully!\n', 'bright');
  info('Next steps:');
  console.log('  1. Review .ps-lang/config/ps-lang.config.json');
  console.log('  2. Check .ps-lang/examples/basic-zones.md for syntax');
  console.log('  3. Start using PS-LANG zones in your files!');
  console.log('\n  Optional: .ps-lang/config/claude-commands.json has PS-LANG enriched examples');

  // Offer theme setup
  console.log('');
  const wantsTheme = await askQuestion('💅 Apply PS-LANG VS Code theme? (Y/n): ');
  if (wantsTheme.toLowerCase() !== 'n') {
    console.log('');
    log('Available themes:', 'bright');
    console.log('  1. journal      - Warm paper-like (default)');
    console.log('  2. dark-agent   - Dark multi-agent optimized');
    console.log('  3. minimal-light - Clean minimal');
    console.log('  4. zone-focused - High contrast\n');

    const themeChoice = await askQuestion('Select theme (1-4, or press Enter for journal): ');
    const themeMap = { '1': 'journal', '2': 'dark-agent', '3': 'minimal-light', '4': 'zone-focused', '': 'journal' };
    const selectedTheme = themeMap[themeChoice] || 'journal';

    // Apply theme immediately
    const themesSourceDir = join(__dirname, '..', '.vscode', 'themes');
    const themeFiles = {
      'journal': 'journal.json',
      'dark-agent': 'dark-agent.json',
      'minimal-light': 'minimal-light.json',
      'zone-focused': 'zone-focused.json'
    };

    const themeConfigPath = join(themesSourceDir, themeFiles[selectedTheme]);
    if (existsSync(themeConfigPath)) {
      const themeConfig = JSON.parse(readFileSync(themeConfigPath, 'utf-8'));
      const vscodeDir = join(cwd, '.vscode');
      const settingsPath = join(vscodeDir, 'settings.json');

      if (!existsSync(vscodeDir)) {
        mkdirSync(vscodeDir, { recursive: true });
      }

      let settings = {};
      if (existsSync(settingsPath)) {
        settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
      }

      settings['workbench.colorCustomizations'] = {
        ...settings['workbench.colorCustomizations'],
        [`[${themeConfig.name}]`]: themeConfig['workbench.colorCustomizations']
      };

      settings['editor.tokenColorCustomizations'] = {
        ...settings['editor.tokenColorCustomizations'],
        [`[${themeConfig.name}]`]: themeConfig['editor.tokenColorCustomizations']
      };

      writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
      success(`Applied ${themeConfig.name} theme`);
      info('Reload VS Code to see the new theme');
    }
  }

  console.log('\n  Learn more: https://ps-lang.dev\n');
}

function generatePlaceholder(filename) {
  if (filename.endsWith('.json')) {
    return '{}';
  }
  return `# ${filename}\n\nThis file will be populated in future versions.\n`;
}

function check() {
  log('\n🔍 Checking PS-LANG syntax...\n', 'bright');

  const cwd = process.cwd();
  const psLangDir = join(cwd, '.ps-lang');

  if (!existsSync(psLangDir)) {
    error('.ps-lang directory not found!');
    info('Run: npx ps-lang init');
    return;
  }

  // Basic validation
  const configPath = join(psLangDir, 'config', 'ps-lang.config.json');
  if (existsSync(configPath)) {
    try {
      JSON.parse(readFileSync(configPath, 'utf-8'));
      success('ps-lang.config.json is valid');
    } catch (e) {
      error('ps-lang.config.json has invalid JSON');
    }
  } else {
    warning('ps-lang.config.json not found');
  }

  info('\n✓ Basic validation complete');
  info('Full syntax checking coming in future versions\n');
}

function showHelp() {
  log('\n╔═══════════════════════════════════════════════════════╗', 'cyan');
  log('║         PS-LANG CLI - Alpha Testing Phase            ║', 'cyan');
  log('║     Privacy-First Scripting Language v0.2.3-alpha.1  ║', 'cyan');
  log('║     v0.2 Spec Released | Parser Implementation Soon  ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════╝\n', 'cyan');

  console.log('Usage:');
  console.log('  npx ps-lang init                 Initialize .ps-lang in current project');
  console.log('  npx ps-lang zones                Show zone syntax quick reference');
  console.log('  npx ps-lang example <type>       Generate example file');
  console.log('  npx ps-lang extract <file>       Extract zones from file');
  console.log('  npx ps-lang stats                Show project zone statistics');
  console.log('  npx ps-lang theme <list|set>     Manage VS Code themes');
  console.log('  npx ps-lang check                Validate PS-LANG syntax (basic)');
  console.log('  npx ps-lang version              Show version');
  console.log('  npx ps-lang help                 Show this help message\n');

  console.log('Example Types:');
  console.log('  handoff      Agent handoff document');
  console.log('  benchmark    Performance/quality benchmarks');
  console.log('  journal      Daily journal entry');
  console.log('  component    React component with zones\n');

  console.log('Examples:');
  console.log('  npx ps-lang init');
  console.log('  npx ps-lang zones');
  console.log('  npx ps-lang example handoff');
  console.log('  npx ps-lang extract README.md');
  console.log('  npx ps-lang stats');
  console.log('  npx ps-lang theme list');
  console.log('  npx ps-lang theme set journal\n');

  console.log('What is PS-LANG?');
  console.log('  A privacy-first scripting language for multi-agent context control.');
  console.log('  Control what AI agents see in your codebase with zone annotations.\n');

  console.log('Alpha Testing:');
  console.log('  - Claude Code support only');
  console.log('  - .ps-lang folder contains all project-specific config');
  console.log('  - Custom commands auto-loaded by Claude Code\n');

  console.log('v0.2 Syntax (Spec Released):');
  console.log('  - Privacy-first default: <. lazy close syntax');
  console.log('  - Directional context: <-. backward, .-> forward');
  console.log('  - Named zones: <.id:description chaining');
  console.log('  - Full v0.1 syntax support maintained');
  console.log('  - Read: docs/SYNTAX-V2-QUICK-REF.md\n');

  console.log('Learn more:');
  console.log('  Website:   https://ps-lang.dev');
  console.log('  GitHub:    https://github.com/ps-lang/ps-lang');
  console.log('  Docs:      https://ps-lang.dev/docs\n');
}

function showVersion() {
  const packagePath = join(__dirname, '..', 'package.json');
  const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
  log(`\nPS-LANG v${pkg.version}`, 'bright');
  log('v0.2 Syntax: Privacy-first default, lazy close, directional context, named zones', 'cyan');
  log('Status: v0.1 syntax fully supported, v0.2 spec released\n', 'green');
}

function showZones() {
  log('\n╔═══════════════════════════════════════════════════════╗', 'cyan');
  log('║            PS-LANG Zone Quick Reference               ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════╝\n', 'cyan');

  const zones = [
    {
      name: 'CURRENT AGENT ONLY',
      syntax: '<.>',
      description: 'Only current agent sees this context',
      policy: 'export_ok=false, hidden from other agents',
      example: '<. Agent A: note for myself only .>',
      color: 'yellow'
    },
    {
      name: 'PASS-THROUGH',
      syntax: '<#.>',
      description: 'Documentation for next agent',
      policy: 'export_ok=true, immutable',
      example: '<#. Next agent: use JWT tokens #.>',
      color: 'blue'
    },
    {
      name: 'ACTIVE WORKSPACE',
      syntax: '<@.>',
      description: 'Current agent\'s work area',
      policy: 'export_ok=true, mutable by current agent',
      example: '<@. Current task: Implement auth @.>',
      color: 'green'
    },
    {
      name: 'AI-MANAGED',
      syntax: '<~.>',
      description: 'AI-generated metadata',
      policy: 'export_ok=true, agents may transform',
      example: '<~. meta-tags: {"confidence": 0.86} ~.>',
      color: 'cyan'
    },
    {
      name: 'BUSINESS/MONETIZATION',
      syntax: '<$.>',
      description: 'Business strategy, pricing, revenue',
      policy: 'export_ok=false, strategic context',
      example: '<$. Revenue target: $100k MRR $.>',
      color: 'red'
    },
    {
      name: 'QUESTION',
      syntax: '<?.>',
      description: 'Open questions',
      policy: 'export_ok=true, prioritize resolution',
      example: '<?. Which database should we use? ?.>',
      color: 'yellow'
    },
    {
      name: 'BENCHMARK',
      syntax: '<.bm>',
      description: 'Metrics or reference points',
      policy: 'export_ok=true, pii=false enforced',
      example: '<.bm perf login_time: 45ms .bm>',
      color: 'blue'
    }
  ];

  zones.forEach((zone, index) => {
    log(`${index + 1}. ${zone.name}`, 'bright');
    log(`   Syntax: ${zone.syntax}`, zone.color);
    log(`   ${zone.description}`);
    log(`   Policy: ${zone.policy}`, 'cyan');
    log(`   Example: ${zone.example}`, 'yellow');
    console.log('');
  });

  info('Learn more: https://ps-lang.dev/docs\n');
}

function generateExample(type = 'handoff') {
  const cwd = process.cwd();
  const psLangDir = join(cwd, '.ps-lang');

  if (!existsSync(psLangDir)) {
    error('.ps-lang directory not found!');
    info('Run: npx ps-lang init');
    return;
  }

  const examples = {
    handoff: {
      filename: 'agent-handoff-example.md',
      content: `# Agent Handoff Document

<~.
AI-Generated Handoff Metadata
Generated: ${new Date().toISOString().split('T')[0]}
Source Agent: [your-agent-name]
Target Agent: research|analysis|writing|review
Project: [project-name]
Context-Type: Multi-Agent Workflow Handoff
~.>

## Purpose
[Describe what this handoff is for]

---

## Current State

<@.
**Recent Work:**
1. [Task 1]
2. [Task 2]
3. [Task 3]

**Status:** [In Progress | Blocked | Ready for Review]
@.>

---

## Instructions for Next Agent

<#.
**Task:**
[What the next agent should do]

**Context:**
- [Important detail 1]
- [Important detail 2]

**Expected Output:**
[What you need from the next agent]
#.>

---

## Open Questions

<?.
1. [Question 1]
2. [Question 2]
?.>

---

## Private Notes

<.
[Your private notes - agents won't see this]
.>
`
    },
    benchmark: {
      filename: 'benchmark-example.md',
      content: `# Benchmark Template

<.bm project-benchmarks
created: ${new Date().toISOString().split('T')[0]}
type: performance|quality|accuracy
target_date: [YYYY-MM-DD]
.bm>

## Performance Metrics

<.bm performance
metric: [metric-name]
current: [current-value]
target: [target-value]
unit: [ms|req/s|%]
priority: high|medium|low
.bm>

## Quality Metrics

<.bm quality
metric: [metric-name]
current: [current-value]
target: [target-value]
measured_by: [tool|manual]
.bm>

## Notes

<.
Private benchmarking notes
.>
`
    },
    journal: {
      filename: 'journal-entry-example.psl',
      content: `<~.
meta-tags: {
  "entry_type": "daily-journal",
  "date": "${new Date().toISOString().split('T')[0]}",
  "project": "[project-name]",
  "topics": ["topic1", "topic2"],
  "sentiment": "productive|challenging|blocked",
  "complexity": "low|medium|high"
}
~.>

<@. Today's Work: [Brief summary] @.>

## What I Built

[Describe what you worked on today]

## Challenges

<?.
- [Challenge or question 1]
- [Challenge or question 2]
?.>

## Performance

<.bm daily-metrics
hours_worked: [hours]
tasks_completed: [count]
blockers: [count]
.bm>

## Private Thoughts

<.
[Personal reflections - agent-blind]
.>

## Next Session

<#.
For next coding session:
- [Task 1]
- [Task 2]
#.>
`
    },
    component: {
      filename: 'component-example.tsx',
      content: `/**
 * Component Example with PS-LANG zones
 */

<@. Active: Implementing user profile card @.>

import React from 'react';

<#.
Component accepts:
- user: { name: string, email: string, avatar?: string }
- onEdit?: () => void
#.>

export function UserProfileCard({ user, onEdit }) {
  <.
  TODO: Add loading state
  TODO: Handle missing avatar gracefully
  .>

  <.bm component-perf
  render_time_target: 16ms
  current_render_time: 12ms
  accessibility_score: 95/100
  .bm>

  return (
    <div className="profile-card">
      <img src={user.avatar || '/default-avatar.png'} alt={user.name} />
      <h2>{user.name}</h2>

      <$.
      {/* Sensitive: email should be masked in logs */}
      <span className="email">{user.email}</span>
      $.>

      {onEdit && <button onClick={onEdit}>Edit</button>}
    </div>
  );
}

<?.
Should we add a verified badge?
What about social links?
?.>
`
    }
  };

  if (!examples[type]) {
    error(`Unknown example type: ${type}`);
    info('Available types: handoff, benchmark, journal, component');
    return;
  }

  const example = examples[type];
  const outputPath = join(cwd, example.filename);

  if (existsSync(outputPath)) {
    warning(`${example.filename} already exists!`);
    return;
  }

  writeFileSync(outputPath, example.content);
  success(`Created ${example.filename}`);
  info(`Edit the file and customize it for your project\n`);
}

function extractZones(filepath) {
  const cwd = process.cwd();
  const fullPath = join(cwd, filepath);

  if (!existsSync(fullPath)) {
    error(`File not found: ${filepath}`);
    return;
  }

  const content = readFileSync(fullPath, 'utf-8');

  log('\n╔═══════════════════════════════════════════════════════╗', 'cyan');
  log(`║  Zone Extraction: ${filepath.padEnd(36)}║`, 'cyan');
  log('╚═══════════════════════════════════════════════════════╝\n', 'cyan');

  const zonePatterns = [
    { name: 'Current Agent Only', regex: /<\.[\s\S]*?\.>/g, color: 'yellow' },
    { name: 'Pass-Through', regex: /<#\.[\s\S]*?#\.>/g, color: 'blue' },
    { name: 'Active Workspace', regex: /<@\.[\s\S]*?@\.>/g, color: 'green' },
    { name: 'AI-Managed', regex: /<~\.[\s\S]*?~\.>/g, color: 'cyan' },
    { name: 'Business/Monetization', regex: /<\$\.[\s\S]*?\$\.>/g, color: 'red' },
    { name: 'Question', regex: /<\?\.[\s\S]*?\?\.>/g, color: 'yellow' },
    { name: 'Benchmark', regex: /<\.bm[\s\S]*?\.bm>/g, color: 'blue' },
  ];

  let foundAny = false;

  zonePatterns.forEach(({ name, regex, color }) => {
    const matches = content.match(regex);
    if (matches && matches.length > 0) {
      foundAny = true;
      log(`\n${name} (${matches.length} found):`, 'bright');
      matches.forEach((match, i) => {
        log(`  ${i + 1}. ${match.substring(0, 80)}${match.length > 80 ? '...' : ''}`, color);
      });
    }
  });

  if (!foundAny) {
    warning('No PS-LANG zones found in this file');
    info('Use zones to control what AI agents see!');
  }

  console.log('\n');
}

function showStats() {
  const cwd = process.cwd();

  log('\n╔═══════════════════════════════════════════════════════╗', 'cyan');
  log('║         PS-LANG Project Statistics                    ║', 'cyan');
  log('╚═══════════════════════════════════════════════════════╝\n', 'cyan');

  // Check if .ps-lang exists
  const psLangDir = join(cwd, '.ps-lang');
  if (!existsSync(psLangDir)) {
    error('.ps-lang directory not found!');
    info('Run: npx ps-lang init\n');
    return;
  }

  success('PS-LANG initialized ✓');

  // Count files in project
  const { execSync } = require('child_process');

  try {
    // Count markdown files with zones
    const mdFiles = execSync('git ls-files "*.md" 2>/dev/null || find . -name "*.md" -type f 2>/dev/null | head -20', {
      cwd,
      encoding: 'utf-8'
    }).trim().split('\n').filter(Boolean);

    info(`Found ${mdFiles.length} markdown files`);

    let totalZones = 0;
    const zoneTypes = {
      'Current Agent': 0,
      'Pass-Through': 0,
      'Active': 0,
      'AI-Managed': 0,
      'Business': 0,
      'Question': 0,
      'Benchmark': 0
    };

    mdFiles.forEach(file => {
      const filePath = join(cwd, file);
      if (existsSync(filePath)) {
        const content = readFileSync(filePath, 'utf-8');

        const patterns = [
          { name: 'Current Agent', regex: /<\.[\s\S]*?\.>/g },
          { name: 'Pass-Through', regex: /<#\.[\s\S]*?#\.>/g },
          { name: 'Active', regex: /<@\.[\s\S]*?@\.>/g },
          { name: 'AI-Managed', regex: /<~\.[\s\S]*?~\.>/g },
          { name: 'Business', regex: /<\$\.[\s\S]*?\$\.>/g },
          { name: 'Question', regex: /<\?\.[\s\S]*?\?\.>/g },
          { name: 'Benchmark', regex: /<\.bm[\s\S]*?\.bm>/g },
        ];

        patterns.forEach(({ name, regex }) => {
          const matches = content.match(regex);
          if (matches) {
            zoneTypes[name] += matches.length;
            totalZones += matches.length;
          }
        });
      }
    });

    if (totalZones > 0) {
      log(`\nTotal zones found: ${totalZones}`, 'bright');
      console.log('');
      Object.entries(zoneTypes).forEach(([name, count]) => {
        if (count > 0) {
          const bar = '█'.repeat(Math.min(count, 20));
          log(`  ${name.padEnd(15)} ${bar} ${count}`, 'green');
        }
      });
    } else {
      warning('No PS-LANG zones found in project');
      info('Start using zones to control agent context!');
    }

  } catch (err) {
    warning('Could not analyze project files');
  }

  console.log('\n');
}

function askQuestion(question) {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    readline.question(question, (answer) => {
      readline.close();
      resolve(answer);
    });
  });
}

function manageTheme(action) {
  const cwd = process.cwd();
  const vscodeDir = join(cwd, '.vscode');
  const settingsPath = join(vscodeDir, 'settings.json');
  const themesSourceDir = join(__dirname, '..', '.vscode', 'themes');

  const themes = [
    {
      id: 'journal',
      name: 'PS-LANG Journal',
      description: 'Warm, paper-like theme for journaling and documentation',
      file: 'journal.json'
    },
    {
      id: 'dark-agent',
      name: 'PS-LANG Dark Agent',
      description: 'Dark theme optimized for multi-agent development',
      file: 'dark-agent.json'
    },
    {
      id: 'minimal-light',
      name: 'PS-LANG Minimal Light',
      description: 'Clean, minimal light theme for focused work',
      file: 'minimal-light.json'
    },
    {
      id: 'zone-focused',
      name: 'PS-LANG Zone Focused',
      description: 'High contrast theme with zone-aware colors',
      file: 'zone-focused.json'
    },
    {
      id: 'disable',
      name: 'Disable PS-LANG Theme',
      description: 'Remove PS-LANG theme customizations',
      file: null
    }
  ];

  if (action === 'list') {
    log('\n╔═══════════════════════════════════════════════════════╗', 'cyan');
    log('║            PS-LANG VS Code Themes                     ║', 'cyan');
    log('╚═══════════════════════════════════════════════════════╝\n', 'cyan');

    themes.forEach((theme, i) => {
      log(`${i + 1}. ${theme.name}`, 'bright');
      log(`   ${theme.description}`, 'cyan');
      if (theme.file) {
        log(`   Command: npx ps-lang theme set ${theme.id}`, 'yellow');
      }
      console.log('');
    });

    info('Themes can be overridden in your .vscode/settings.json\n');
    return;
  }

  if (action === 'set') {
    const themeId = process.argv[4];
    if (!themeId) {
      error('Please specify a theme');
      info('Usage: npx ps-lang theme set <theme-id>');
      info('Run: npx ps-lang theme list');
      return;
    }

    const theme = themes.find(t => t.id === themeId);
    if (!theme) {
      error(`Unknown theme: ${themeId}`);
      info('Run: npx ps-lang theme list');
      return;
    }

    // Handle disable
    if (themeId === 'disable') {
      if (existsSync(settingsPath)) {
        let settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
        delete settings['workbench.colorCustomizations'];
        delete settings['editor.tokenColorCustomizations'];
        writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
        success('PS-LANG theme customizations removed');
        info('Reload VS Code to apply changes\n');
      } else {
        info('No .vscode/settings.json found\n');
      }
      return;
    }

    // Load theme config
    const themeConfigPath = join(themesSourceDir, theme.file);
    if (!existsSync(themeConfigPath)) {
      error(`Theme file not found: ${theme.file}`);
      return;
    }

    const themeConfig = JSON.parse(readFileSync(themeConfigPath, 'utf-8'));

    // Create .vscode if doesn't exist
    if (!existsSync(vscodeDir)) {
      mkdirSync(vscodeDir, { recursive: true });
    }

    // Load or create settings.json
    let settings = {};
    if (existsSync(settingsPath)) {
      settings = JSON.parse(readFileSync(settingsPath, 'utf-8'));
    }

    // Apply theme
    settings['workbench.colorCustomizations'] = {
      ...settings['workbench.colorCustomizations'],
      [`[${themeConfig.name}]`]: themeConfig['workbench.colorCustomizations']
    };

    settings['editor.tokenColorCustomizations'] = {
      ...settings['editor.tokenColorCustomizations'],
      [`[${themeConfig.name}]`]: themeConfig['editor.tokenColorCustomizations']
    };

    writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

    success(`Applied ${theme.name} theme`);
    info('Set VS Code color theme to match:');
    console.log(`  1. Open Command Palette (Ctrl+Shift+P / Cmd+Shift+P)`);
    console.log(`  2. Type "Preferences: Color Theme"`);
    console.log(`  3. Select "${themeConfig.name}"`);
    console.log('\n  Or reload VS Code to see changes\n');
  }
}

// Main command router
(async function main() {
  try {
    switch (command) {
      case 'init':
        await init();
        break;
      case 'check':
      case 'validate':
        check();
        break;
      case 'zones':
      case 'zone':
        showZones();
        break;
      case 'example':
      case 'examples':
        const exampleType = process.argv[3] || 'handoff';
        generateExample(exampleType);
        break;
      case 'extract':
        const filepath = process.argv[3];
        if (!filepath) {
          error('Please provide a file path');
          info('Usage: npx ps-lang extract <file>');
        } else {
          extractZones(filepath);
        }
        break;
      case 'stats':
      case 'statistics':
        showStats();
        break;
      case 'theme':
      case 'themes':
        const themeAction = process.argv[3] || 'list';
        manageTheme(themeAction);
        break;
      case 'version':
      case '-v':
      case '--version':
        showVersion();
        break;
      case 'help':
      case '-h':
      case '--help':
      default:
        showHelp();
        break;
    }
  } catch (err) {
    error(`Error: ${err.message}`);
    process.exit(1);
  }
})();
