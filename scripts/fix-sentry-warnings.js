#!/usr/bin/env node
/* eslint-disable no-template-curly-in-string */

/**
 * Fix Sentry Warnings Script
 *
 * This script modifies the webpack configuration to fix Sentry warnings
 * about serializing big strings in the webpack cache.
 *
 * Usage: node scripts/fix-sentry-warnings.js
 */

const fs = require('node:fs');
const path = require('node:path');

// Paths to check for webpack configuration
const possiblePaths = [
  path.join(process.cwd(), '.next', 'cache', 'webpack'),
  path.join(process.cwd(), 'node_modules', '.cache', 'webpack'),
];

// Function to recursively find webpack configuration files
function findWebpackConfigFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findWebpackConfigFiles(filePath, fileList);
    } else if (file === 'PackFileCacheStrategy.js' || file.includes('webpack-config')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to modify webpack configuration files
function modifyWebpackConfigFiles(filePaths) {
  let modifiedCount = 0;

  filePaths.forEach((filePath) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // Fix for PackFileCacheStrategy.js
      if (filePath.includes('PackFileCacheStrategy.js')) {
        // Check if the file contains the warning about serializing big strings
        if (content.includes('Serializing big strings')) {
          // Modify the serialization logic to use Buffer for large strings
          const newContent = content.replace(
            /(\s*)(serializedContent = JSON\.stringify\(content\);)/g,
            '$1// Modified by fix-sentry-warnings.js\n$1if (typeof content === "string" && content.length > 100000) {\n$1  serializedContent = Buffer.from(content).toString("base64");\n$1  serializedContent = `__BUFFER_BASE64__${serializedContent}`;\n$1} else {\n$1  $2\n$1}',
          );

          // Modify the deserialization logic to handle Buffer
          const newContent2 = newContent.replace(
            /(\s*)(const deserializedContent = JSON\.parse\(serializedContent\);)/g,
            '$1// Modified by fix-sentry-warnings.js\n$1let deserializedContent;\n$1if (serializedContent.startsWith("__BUFFER_BASE64__")) {\n$1  const base64Content = serializedContent.substring(16);\n$1  deserializedContent = Buffer.from(base64Content, "base64").toString();\n$1} else {\n$1  deserializedContent = JSON.parse(serializedContent);\n$1}',
          );

          if (newContent2 !== content) {
            fs.writeFileSync(filePath, newContent2);
            modified = true;
            modifiedCount++;
          }
        }
      }

      // Fix for webpack-config files
      if (filePath.includes('webpack-config')) {
        // Check if the file contains cache configuration
        if (content.includes('cache:') && !content.includes('cacheUnaffected')) {
          // Add cache optimization
          const newContent = content.replace(
            /(\s*)(cache:\s*\{)/g,
            '$1$2\n$1  // Modified by fix-sentry-warnings.js\n$1  cacheUnaffected: true,',
          );

          if (newContent !== content) {
            fs.writeFileSync(filePath, newContent);
            modified = true;
            modifiedCount++;
          }
        }
      }

      if (modified) {
        console.log(`Modified: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error modifying ${filePath}:`, error);
    }
  });

  return modifiedCount;
}

// Main function
function main() {
  console.log('Searching for webpack configuration files...');

  let allFiles = [];
  possiblePaths.forEach((dir) => {
    const files = findWebpackConfigFiles(dir);
    allFiles = [...allFiles, ...files];
  });

  console.log(`Found ${allFiles.length} webpack configuration files.`);

  if (allFiles.length === 0) {
    console.log('No webpack configuration files found. Run a build first.');
    return;
  }

  const modifiedCount = modifyWebpackConfigFiles(allFiles);

  if (modifiedCount > 0) {
    console.log(`Successfully modified ${modifiedCount} webpack configuration files.`);
    console.log('Sentry warnings about serializing big strings should be fixed now.');
  } else {
    console.log('No files needed modification or modifications failed.');
  }
}

main();
