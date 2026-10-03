#!/usr/bin/env node
// @ts-check
/**
 * Skills Registry CLI — Resuelve, instala y gestiona skills desde el registry global.
 * 
 * Usage:
 *   npx skills add belentani7/skills-registry open-school
 *   npx skills list
 *   npx skills search "education"
 *   npx skills info open-school
 *   npx skills update all
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { execSync } from 'node:child_process';
import process from 'node:process';

const VERSION = '1.0.0';
const CACHE_DIR = join(homedir(), '.cache', 'skills-registry');
const SKILLS_DIR = join(homedir(), '.qwen', 'skills');

// ─── HELPERS ──────────────────────────────────────────────────

function log(...args) {
  console.log('[skills]', ...args);
}

function error(...args) {
  console.error('\x1b[31m[skills]\x1b[0m', ...args);
}

function ensureDir(path) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  return res.json() as any;
}

function cachePath(id, version) {
  return join(CACHE_DIR, id, `v${version}`, `${id}.json`);
}

function skillInstallPath(id) {
  return join(SKILLS_DIR, id);
}

// ─── COMMANDS ─────────────────────────────────────────────────

async function cmdAdd(repo, skillId) {
  // Parse repo → owner/name
  const [owner, name] = repo.split('/');
  
  log(`Installing ${skillId} from ${owner}/${name}...`);
  
  // Fetch registry
  const registryUrl = `https://raw.githubusercontent.com/${owner}/${name}/main/registry.json`;
  const registry = await fetchJSON(registryUrl);
  
  // Find skill in registry
  const skillEntry = registry.skills.find(s => s.id === skillId);
  if (!skillEntry) {
    error(`Skill "${skillId}" not found in registry.`);
    error(`Available skills: ${registry.skills.map(s => s.id).join(', ')}`);
    process.exit(1);
  }
  
  // Check dependencies
  if (skillEntry.dependencies?.length > 0) {
    log(`Resolving ${skillEntry.dependencies.length} dependency(ies)...`);
    for (const dep of skillEntry.dependencies) {
      await cmdAdd(repo, dep);
    }
  }
  
  // Download skill files
  const installDir = skillInstallPath(skillId);
  ensureDir(installDir);
  
  const baseFiles = ['SKILL.md', 'manifest.json', 'README.md'];
  for (const file of baseFiles) {
    const fileUrl = `https://raw.githubusercontent.com/${owner}/${name}/main/skills/${skillId}/${file}`;
    try {
      const res = await fetch(fileUrl);
      const content = await res.text();
      writeFileSync(join(installDir, file), content);
    } catch (e) {
      // File optional, skip if missing
    }
  }
  
  // Copy manifest.json as the main entry
  const manifestUrl = `https://raw.githubusercontent.com/${owner}/${name}/main/skills/${skillId}/manifest.json`;
  try {
    const res = await fetch(manifestUrl);
    const manifest = await res.json();
    writeFileSync(join(installDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  } catch {}
  
  log(`✓ Installed ${skillId} v${skillEntry.version} in ${installDir}`);
  log(`  Related skills: ${(skillEntry.related_skills || []).join(', ') || 'none'}`);
}

async function cmdList() {
  log('Installed skills:');
  if (!existsSync(SKILLS_DIR)) {
    log('  No skills installed.');
    return;
  }
  
  const dirs = execSync(`ls -d ${SKILLS_DIR}/*/`, { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);
  
  for (const dir of dirs) {
    const manifestPath = join(dir, 'manifest.json');
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      const version = manifest.version || '?';
      const desc = manifest.description || '';
      const deps = manifest.dependencies?.length ? `\n  Dependencies: ${manifest.dependencies.join(', ')}` : '';
      log(`  ${manifest.id || dir.split('/').pop()} v${version}`);
      log(`    ${desc.substring(0, 80)}${desc.length > 80 ? '...' : ''}${deps}`);
    } else {
      log(`  ${dir.split('/').pop()} (no manifest)`);
    }
  }
}

async function cmdSearch(query) {
  const registryUrl = 'https://raw.githubusercontent.com/belentani7/skills-registry/main/registry.json';
  const registry = await fetchJSON(registryUrl);
  
  const results = registry.skills.filter(s =>
    s.id.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase()) ||
    (s.tags || []).some(tag => tag.toLowerCase().includes(query.toLowerCase()))
  );
  
  if (results.length === 0) {
    log(`No skills found matching "${query}".`);
    return;
  }
  
  log(`Found ${results.length} skill(s) matching "${query}":`);
  for (const s of results) {
    log(`  ${s.id} v${s.version} — ${s.description.substring(0, 70)}...`);
    log(`    Category: ${s.category} | Quality: ⭐${s.quality_score} | Downloads: 📥${s.downloads_total || '?'}`);
  }
}

async function cmdInfo(skillId) {
  const registryUrl = 'https://raw.githubusercontent.com/belentani7/skills-registry/main/registry.json';
  const registry = await fetchJSON(registryUrl);
  const skill = registry.skills.find(s => s.id === skillId);
  
  if (!skill) {
    error(`Skill "${skillId}" not found in registry.`);
    process.exit(1);
  }
  
  log(`${skill.name} v${skill.version}`);
  log(`Description: ${skill.description}`);
  log(`Author: ${skill.author}`);
  log(`License: ${skill.license}`);
  log(`Category: ${skill.category}`);
  log(`Quality: ⭐${skill.quality_score}`);
  log(`Downloads: 📥${skill.downloads_total || '—'}`);
  log(`Related: ${(skill.related_skills || []).join(', ') || '—'}`);
  log(`Triggers: ${(skill.trigger_contains || []).join(', ') || '—'}`);
  
  // Check local install
  const installDir = skillInstallPath(skillId);
  if (existsSync(installDir)) {
    const manifestPath = join(installDir, 'manifest.json');
    if (existsSync(manifestPath)) {
      const localManifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      log(`Local version: v${localManifest.version || '?'}`);
      log(`Status: ✓ Installed`);
      
      // Check for updates
      if (localManifest.version !== skill.version) {
        log(`Update available: v${localManifest.version} → v${skill.version}`);
      }
    } else {
      log(`Status: ✓ Installed (legacy format)`);
    }
  } else {
    log(`Status: Not installed`);
  }
}

// ─── MAIN ─────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'add':
      if (args.length < 3) {
        error('Usage: skills add <owner>/<repo> <skill-id>');
        process.exit(1);
      }
      await cmdAdd(args[1], args[2]);
      break;
      
    case 'list':
      await cmdList();
      break;
      
    case 'search':
      if (args.length < 2) {
        error('Usage: skills search <query>');
        process.exit(1);
      }
      await cmdSearch(args[1]);
      break;
      
    case 'info':
      if (args.length < 2) {
        error('Usage: skills info <skill-id>');
        process.exit(1);
      }
      await cmdInfo(args[1]);
      break;
      
    case '--version':
    case '-V':
      log(VERSION);
      break;
      
    default:
      log('Skills Registry CLI v' + VERSION);
      log('');
      log('Commands:');
      log('  add <owner>/<repo> <skill-id>   Install a skill');
      log('  list                            List installed skills');
      log('  search <query>                  Search registry by keyword');
      log('  info <skill-id>                 Show skill details');
      log('');
      log('Example:');
      log('  npx skills add belentani7/skills-registry open-school');
      break;
  }
}

main().catch(e => {
  error(e.message);
  process.exit(1);
});
