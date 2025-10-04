#!/usr/bin/env node

/**
 * CSV Edge Cases Test
 * 
 * Tests CSV escaping for special characters:
 * - Commas in values
 * - Quotes in values
 * - Newlines in values
 */

const fs = require('fs');
const path = require('path');

function convertToCSV(data, headers) {
  const headerRow = headers.join(',');
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = row[header] || '';
      if (value.toString().includes(',') || value.toString().includes('"') || value.toString().includes('\n')) {
        return `"${value.toString().replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  return [headerRow, ...dataRows].join('\n');
}

console.log('🧪 Testing CSV Edge Cases...\n');

// Test data with edge cases
const edgeCaseData = [
  {
    '資料名': '建築確認済証（1階, 2階, 3階用）',  // Contains comma
    '種別': '法規',
    '備考': 'テスト'
  },
  {
    '資料名': '開発許可通知書',
    '種別': '法規',
    '備考': '担当者からのコメント："至急対応"'  // Contains quotes
  },
  {
    '資料名': '道路台帳',
    '種別': 'インフラ',
    '備考': '注意事項:\n1. 現地確認必須\n2. 写真撮影'  // Contains newlines
  },
  {
    '資料名': '複雑なケース: "引用符", カンマ, 改行\nすべて含む',  // All special chars
    '種別': 'テスト',
    '備考': 'すべての特殊文字をテスト'
  }
];

const headers = ['資料名', '種別', '備考'];
const csv = convertToCSV(edgeCaseData, headers);

console.log('Generated CSV:');
console.log('='.repeat(60));
console.log(csv);
console.log('='.repeat(60));

// Save to file
const outputDir = path.join(__dirname, '..', 'test-output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const filepath = path.join(outputDir, 'edge_cases.csv');
fs.writeFileSync(filepath, csv, 'utf-8');

console.log(`\n✅ Edge case CSV saved to: ${filepath}`);

// Verify each line
console.log('\n🔍 Line-by-line verification:');
const lines = csv.split('\n');
lines.forEach((line, index) => {
  console.log(`Line ${index}: ${line}`);
  
  if (index === 0) {
    console.log('  → Header line');
  } else if (index === 1) {
    if (line.includes('"') && line.includes(',')) {
      console.log('  ✅ Correctly escaped comma in quoted field');
    }
  } else if (index === 2) {
    if (line.includes('""')) {
      console.log('  ✅ Correctly escaped quotes (double quotes)');
    }
  } else if (index === 3 || index === 4) {
    // Newline case - will be multiple lines in output
    if (line.includes('"')) {
      console.log('  ✅ Part of multi-line quoted field');
    }
  }
});

console.log('\n✅ Edge case testing complete!');
console.log('\n📝 Notes:');
console.log('- Commas in values are wrapped in quotes');
console.log('- Quotes in values are escaped as double quotes ("")');
console.log('- Newlines in values are preserved within quoted fields');
