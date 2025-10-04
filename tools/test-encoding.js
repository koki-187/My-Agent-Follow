#!/usr/bin/env node

/**
 * Encoding Test Script
 * 
 * This script tests UTF-8 and Shift_JIS encoding of CSV files
 */

const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');

// Test data with Japanese characters
const testData = {
  headers: ['資料名', '種別', '備考'],
  rows: [
    ['建築確認済証', '法規', '取得済み'],
    ['開発許可通知書', '法規', 'カンマ,を含むテスト']
  ]
};

function generateCSV(data) {
  const headerRow = data.headers.join(',');
  const dataRows = data.rows.map(row => {
    return row.map(value => {
      if (value.includes(',') || value.includes('"')) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  return [headerRow, ...dataRows].join('\n');
}

const outputDir = path.join(__dirname, '..', 'test-output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🧪 Testing CSV Encoding...\n');

// Generate CSV content
const csvContent = generateCSV(testData);

// Test UTF-8
console.log('Testing UTF-8 encoding:');
const utf8Buffer = Buffer.from(csvContent, 'utf-8');
const utf8File = path.join(outputDir, 'test_utf8.csv');
fs.writeFileSync(utf8File, utf8Buffer);
console.log(`  ✅ UTF-8 file created: ${utf8File}`);
console.log(`  📊 Size: ${utf8Buffer.length} bytes`);

// Test Shift_JIS
console.log('\nTesting Shift_JIS encoding:');
try {
  const sjisBuffer = iconv.encode(csvContent, 'shift_jis');
  const sjisFile = path.join(outputDir, 'test_sjis.csv');
  fs.writeFileSync(sjisFile, sjisBuffer);
  console.log(`  ✅ Shift_JIS file created: ${sjisFile}`);
  console.log(`  📊 Size: ${sjisBuffer.length} bytes`);
  
  // Verify round-trip
  const decodedSjis = iconv.decode(sjisBuffer, 'shift_jis');
  if (decodedSjis === csvContent) {
    console.log('  ✅ Round-trip encoding/decoding successful');
  } else {
    console.log('  ⚠️  Round-trip encoding/decoding has differences');
  }
} catch (error) {
  console.error(`  ❌ Shift_JIS encoding failed: ${error.message}`);
}

// Display sample content
console.log('\n📄 Sample CSV Content (UTF-8):');
console.log('---');
console.log(csvContent);
console.log('---');

console.log('\n✅ Encoding test completed!');
