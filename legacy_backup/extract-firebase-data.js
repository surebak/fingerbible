#!/usr/bin/env node

/**
 * Firebase Data Extraction Script
 * 
 * This script extracts all bible data from Firebase Realtime Database
 * and saves it as static JSON files.
 * 
 * Usage: node extract-firebase-data.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Firebase config (from index.html)
const FIREBASE_CONFIG = {
  databaseURL: "https://bibles-da0c4.firebaseio.com"
};

// List of all 66 bible books with their codes
const BIBLE_BOOKS = [
  { code: 'gen', chapters: 50 },
  { code: 'exo', chapters: 40 },
  { code: 'lev', chapters: 27 },
  { code: 'num', chapters: 36 },
  { code: 'deut', chapters: 34 },
  { code: 'jos', chapters: 24 },
  { code: 'jdg', chapters: 21 },
  { code: 'rth', chapters: 4 },
  { code: '1sam', chapters: 31 },
  { code: '2sam', chapters: 24 },
  { code: '1kgs', chapters: 22 },
  { code: '2kgs', chapters: 25 },
  { code: '1chr', chapters: 29 },
  { code: '2chr', chapters: 36 },
  { code: 'ezr', chapters: 10 },
  { code: 'neh', chapters: 13 },
  { code: 'esth', chapters: 10 },
  { code: 'job', chapters: 42 },
  { code: 'psm', chapters: 150 },
  { code: 'prv', chapters: 31 },
  { code: 'ecc', chapters: 12 },
  { code: 'song', chapters: 8 },
  { code: 'isa', chapters: 66 },
  { code: 'jer', chapters: 52 },
  { code: 'lam', chapters: 5 },
  { code: 'ezk', chapters: 48 },
  { code: 'dan', chapters: 12 },
  { code: 'hos', chapters: 14 },
  { code: 'joel', chapters: 3 },
  { code: 'amos', chapters: 9 },
  { code: 'obad', chapters: 1 },
  { code: 'jon', chapters: 4 },
  { code: 'mic', chapters: 7 },
  { code: 'nah', chapters: 3 },
  { code: 'hab', chapters: 3 },
  { code: 'zep', chapters: 3 },
  { code: 'hag', chapters: 2 },
  { code: 'zec', chapters: 14 },
  { code: 'mal', chapters: 4 },
  { code: 'mat', chapters: 28 },
  { code: 'mrk', chapters: 16 },
  { code: 'luk', chapters: 24 },
  { code: 'john', chapters: 21 },
  { code: 'acts', chapters: 28 },
  { code: 'rom', chapters: 16 },
  { code: '1cor', chapters: 16 },
  { code: '2cor', chapters: 13 },
  { code: 'gal', chapters: 6 },
  { code: 'eph', chapters: 6 },
  { code: 'phil', chapters: 4 },
  { code: 'col', chapters: 4 },
  { code: '1the', chapters: 5 },
  { code: '2the', chapters: 3 },
  { code: '1tim', chapters: 6 },
  { code: '2tim', chapters: 4 },
  { code: 'tit', chapters: 3 },
  { code: 'phm', chapters: 1 },
  { code: 'heb', chapters: 13 },
  { code: 'jas', chapters: 5 },
  { code: '1pet', chapters: 5 },
  { code: '2pet', chapters: 3 },
  { code: '1jn', chapters: 5 },
  { code: '2jn', chapters: 1 },
  { code: '3jn', chapters: 1 },
  { code: 'jud', chapters: 1 },
  { code: 'rev', chapters: 22 }
];

const VERSIONS = ['krv', 'rnksv'];

// Create output directories
function createDirectories() {
  const baseDir = path.join(__dirname, 'public', 'data');
  
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }
  
  VERSIONS.forEach(version => {
    const versionDir = path.join(baseDir, version);
    if (!fs.existsSync(versionDir)) {
      fs.mkdirSync(versionDir, { recursive: true });
    }
  });
  
  console.log('✅ Created directory structure: public/data/');
}

// Fetch data from Firebase
function fetchFromFirebase(path) {
  return new Promise((resolve, reject) => {
    const url = `${FIREBASE_CONFIG.databaseURL}${path}.json`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          reject(new Error(`Failed to parse JSON from ${path}: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Failed to fetch ${path}: ${error.message}`));
    });
  });
}

// Extract data for a single book
async function extractBook(version, bookInfo) {
  const { code, chapters } = bookInfo;
  const bookData = {};
  
  console.log(`  Extracting ${version}/${code}...`);
  
  try {
    // Fetch all chapters for this book
    for (let i = 1; i <= chapters; i++) {
      const chapterPath = `/${version}/${code}/c${i}`;
      const chapterData = await fetchFromFirebase(chapterPath);
      
      if (chapterData) {
        bookData[`c${i}`] = chapterData;
        process.stdout.write('.');
      } else {
        console.warn(`\n    ⚠️  No data for ${chapterPath}`);
      }
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Save to file
    const outputPath = path.join(__dirname, 'public', 'data', version, `${code}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(bookData, null, 2), 'utf8');
    
    console.log(` ✅ Saved to data/${version}/${code}.json`);
    
    return true;
  } catch (error) {
    console.error(`\n    ❌ Error extracting ${version}/${code}:`, error.message);
    return false;
  }
}

// Main extraction function
async function extractAllData() {
  console.log('🚀 Starting Firebase data extraction...\n');
  
  createDirectories();
  
  let totalBooks = 0;
  let successCount = 0;
  let failCount = 0;
  
  for (const version of VERSIONS) {
    console.log(`\n📖 Extracting ${version.toUpperCase()} version...\n`);
    
    for (const book of BIBLE_BOOKS) {
      totalBooks++;
      const success = await extractBook(version, book);
      
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 Extraction Summary:');
  console.log('='.repeat(60));
  console.log(`Total books processed: ${totalBooks}`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  
  // Calculate total size
  const dataDir = path.join(__dirname, 'public', 'data');
  let totalSize = 0;
  
  function getDirSize(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        getDirSize(filePath);
      }
    });
  }
  
  getDirSize(dataDir);
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  
  console.log(`📦 Total data size: ${totalSizeMB} MB (uncompressed)`);
  console.log(`📦 Estimated gzip size: ~${(totalSizeMB / 3).toFixed(2)} MB`);
  console.log('='.repeat(60));
  
  if (failCount === 0) {
    console.log('\n✅ All data extracted successfully!');
    console.log('\nNext steps:');
    console.log('  1. Check the data in public/data/');
    console.log('  2. Update index.html to use static JSON files');
    console.log('  3. Update service-worker.js to cache all data files');
  } else {
    console.log('\n⚠️  Some books failed to extract. Please check the errors above.');
  }
}

// Run the extraction
extractAllData().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
