#!/usr/bin/env node
/* eslint-disable unused-imports/no-unused-vars */

/**
 * Automatic CHANGELOG.md updater
 *
 * This script parses the latest git commit message (excluding changelog updates)
 * and updates the CHANGELOG.md file accordingly.
 *
 * Usage: node scripts/update-changelog.js
 */

const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Configuration
const CHANGELOG_PATH = path.join(process.cwd(), 'CHANGELOG.md');
const VERSION_INCREMENT = process.env.VERSION_INCREMENT || 'patch'; // 'major', 'minor', or 'patch'

// Get the current version from package.json
const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8'));
const currentVersion = packageJson.version;

// Parse the current version
const [major, minor, patch] = currentVersion.split('.').map(Number);

// Calculate the new version based on VERSION_INCREMENT
let newVersion;
switch (VERSION_INCREMENT) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
  default:
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

// Get the current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

// Get the repository URL for commit links
function getRepoUrl() {
  try {
    // Try to get the repository URL from package.json
    if (packageJson.repository) {
      if (typeof packageJson.repository === 'string') {
        return packageJson.repository.replace(/\.git$/, '');
      } else if (packageJson.repository.url) {
        return packageJson.repository.url.replace(/\.git$/, '');
      }
    }

    // If not found in package.json, try to get it from git remote
    const remoteUrl = execSync('git remote get-url origin').toString().trim();
    if (remoteUrl.startsWith('git@github.com:')) {
      // Convert SSH URL to HTTPS URL
      return `https://github.com/${remoteUrl.slice(15).replace(/\.git$/, '')}`;
    } else if (remoteUrl.startsWith('https://')) {
      return remoteUrl.replace(/\.git$/, '');
    }

    // If all else fails, return null
    return null;
  } catch (error) {
    console.warn('Could not determine repository URL:', error.message);
    return null;
  }
}

// Get the latest commit
function getLatestCommit() {
  try {
    // Get the latest commit, excluding any changelog update commits
    const latestCommit = execSync('git log -1 --grep="chore: update changelog" --invert-grep --pretty=format:"%s|%h|%an|%at"').toString().trim();

    if (!latestCommit) {
      console.log('No commits found or the latest commit is a changelog update.');
      process.exit(0);
    }

    const [message, hash, author, timestamp] = latestCommit.split('|');
    console.log(`Latest commit: ${message} (${hash})`);

    return [{
      message,
      hash,
      author,
      timestamp: new Date(Number.parseInt(timestamp) * 1000),
    }];
  } catch (error) {
    console.error('Error getting latest commit:', error.message);
    process.exit(1);
  }
}

// Categorize commits by type (feature, fix, etc.)
function categorizeCommits(commits) {
  const categories = {
    features: [],
    fixes: [],
    chore: [],
    docs: [],
    refactor: [],
    test: [],
    other: [],
  };

  commits.forEach((commit) => {
    const { message, hash, author, timestamp } = commit;

    // Parse conventional commit format: type(scope): message
    const match = message.match(/^(\w+)(?:\(([^)]+)\))?: (.+)$/);

    if (match) {
      const [, type, scope, commitMessage] = match;

      const entry = {
        message: commitMessage,
        hash,
        author,
        timestamp,
        scope,
      };

      switch (type.toLowerCase()) {
        case 'feat':
          categories.features.push(entry);
          break;
        case 'fix':
          categories.fixes.push(entry);
          break;
        case 'chore':
          categories.chore.push(entry);
          break;
        case 'docs':
          categories.docs.push(entry);
          break;
        case 'refactor':
          categories.refactor.push(entry);
          break;
        case 'test':
          categories.test.push(entry);
          break;
        default:
          categories.other.push(entry);
          break;
      }
    } else {
      categories.other.push({
        message,
        hash,
        author,
        timestamp,
        scope: null,
      });
    }
  });

  return categories;
}

// Generate changelog entry for the new version
function generateChangelogEntry(categories) {
  let entry = `## [${newVersion}] - ${currentDate}\n\n`;
  const repoUrl = getRepoUrl();

  // Helper function to generate commit entry
  const generateCommitEntry = (item) => {
    const { message, hash, scope } = item;
    const scopeText = scope ? `**${scope}**: ` : '';

    if (repoUrl) {
      return `* ${scopeText}${message} ([${hash.substring(0, 7)}](${repoUrl}/commit/${hash}))\n`;
    } else {
      return `* ${scopeText}${message} (${hash.substring(0, 7)})\n`;
    }
  };

  // Features
  if (categories.features.length > 0) {
    entry += '### Features\n\n';
    categories.features.forEach((item) => {
      entry += generateCommitEntry(item);
    });
    entry += '\n';
  }

  // Fixes
  if (categories.fixes.length > 0) {
    entry += '### Bug Fixes\n\n';
    categories.fixes.forEach((item) => {
      entry += generateCommitEntry(item);
    });
    entry += '\n';
  }

  // Documentation
  if (categories.docs.length > 0) {
    entry += '### Documentation\n\n';
    categories.docs.forEach((item) => {
      entry += generateCommitEntry(item);
    });
    entry += '\n';
  }

  // Refactoring
  if (categories.refactor.length > 0) {
    entry += '### Code Refactoring\n\n';
    categories.refactor.forEach((item) => {
      entry += generateCommitEntry(item);
    });
    entry += '\n';
  }

  // Chores
  if (categories.chore.length > 0) {
    entry += '### Chores\n\n';
    categories.chore.forEach((item) => {
      entry += generateCommitEntry(item);
    });
    entry += '\n';
  }

  // Tests
  if (categories.test.length > 0) {
    entry += '### Tests\n\n';
    categories.test.forEach((item) => {
      entry += generateCommitEntry(item);
    });
    entry += '\n';
  }

  // Other changes
  if (categories.other.length > 0) {
    entry += '### Other Changes\n\n';
    categories.other.forEach((item) => {
      entry += generateCommitEntry(item);
    });
    entry += '\n';
  }

  return entry;
}

// Update the CHANGELOG.md file
function updateChangelog(newEntry) {
  let changelog;

  try {
    changelog = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  } catch (error) {
    // If CHANGELOG.md doesn't exist, create it
    changelog = '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n';
  }

  // Insert the new entry after the header
  const updatedChangelog = changelog.replace(
    /# Changelog.*?\n\n/s,
    `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n${newEntry}`,
  );

  fs.writeFileSync(CHANGELOG_PATH, updatedChangelog);
  console.log(`CHANGELOG.md updated with version ${newVersion}`);
}

// Update package.json with the new version
function updatePackageVersion() {
  packageJson.version = newVersion;
  fs.writeFileSync(
    path.join(process.cwd(), 'package.json'),
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
  console.log(`package.json updated to version ${newVersion}`);
}

// Main function
function main() {
  console.log(`Generating changelog for version ${newVersion}...`);

  const commits = getLatestCommit();
  const categories = categorizeCommits(commits);
  const changelogEntry = generateChangelogEntry(categories);

  updateChangelog(changelogEntry);
  updatePackageVersion();

  console.log('Done!');
}

main();
