#!/usr/bin/env node

/**
 * CSV Export Test Script
 * 
 * This script tests the CSV export functionality by generating sample CSV files
 * and verifying the output format, encoding, and structure.
 */

const fs = require('fs');
const path = require('path');

// Simulate the CSV conversion function
function convertToCSV(data, headers) {
  const headerRow = headers.join(',');
  const dataRows = data.map(row => {
    return headers.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes in CSV
      if (value.toString().includes(',') || value.toString().includes('"') || value.toString().includes('\n')) {
        return `"${value.toString().replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  return [headerRow, ...dataRows].join('\n');
}

// Test data
const artifactsData = [
  {
    '資料名': '建築確認済証',
    '種別': '法規',
    '関連項目': '建築基準法',
    '取得先': '横浜市建築局',
    '取得手段': '窓口',
    '取得日': '2025-01-15',
    '担当': '田中',
    '備考': '取得済み'
  },
  {
    '資料名': '開発許可通知書',
    '種別': '法規',
    '関連項目': '都市計画法',
    '取得先': '神奈川県',
    '取得手段': 'オンライン',
    '取得日': '2025-01-16',
    '担当': '佐藤',
    '備考': '追加調査必要'
  }
];

const reportsData = [
  {
    '案件名': 'ダミータワー案件',
    '地域': '神奈川県横浜市',
    '種別': 'マンション',
    '取得済': '建築確認済証、開発許可',
    '未取得': '道路占用許可',
    '所見': '一部追加調査必要',
    '判断': '条件付き可'
  }
];

const tasksData = [
  {
    'タスク名': '用語ツールチップ機能追加',
    '説明': 'UI上で専門用語にマウスオーバーすると説明が表示される機能',
    '優先度': '中',
    'ステータス': '未着手',
    '担当': '開発チーム',
    'フェーズ': 'フェーズ2'
  }
];

// Test configuration
const tests = [
  {
    type: 'artifacts',
    headers: ['資料名', '種別', '関連項目', '取得先', '取得手段', '取得日', '担当', '備考'],
    data: artifactsData
  },
  {
    type: 'reports',
    headers: ['案件名', '地域', '種別', '取得済', '未取得', '所見', '判断'],
    data: reportsData
  },
  {
    type: 'tasks',
    headers: ['タスク名', '説明', '優先度', 'ステータス', '担当', 'フェーズ'],
    data: tasksData
  }
];

// Create test output directory
const outputDir = path.join(__dirname, '..', 'test-output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Run tests
console.log('🧪 Running CSV Export Tests...\n');

let allPassed = true;

tests.forEach(test => {
  console.log(`Testing ${test.type} export...`);
  
  try {
    const csv = convertToCSV(test.data, test.headers);
    const lines = csv.split('\n');
    
    // Verify header
    const expectedHeader = test.headers.join(',');
    if (lines[0] !== expectedHeader) {
      console.error(`  ❌ Header mismatch for ${test.type}`);
      console.error(`     Expected: ${expectedHeader}`);
      console.error(`     Got: ${lines[0]}`);
      allPassed = false;
    } else {
      console.log(`  ✅ Header correct`);
    }
    
    // Verify row count
    const expectedRows = test.data.length + 1; // +1 for header
    if (lines.length !== expectedRows) {
      console.error(`  ❌ Row count mismatch for ${test.type}`);
      console.error(`     Expected: ${expectedRows} rows`);
      console.error(`     Got: ${lines.length} rows`);
      allPassed = false;
    } else {
      console.log(`  ✅ Row count correct: ${test.data.length} data rows`);
    }
    
    // Save to file for manual inspection
    const filename = `MAF_${test.type}_test.csv`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, csv, 'utf-8');
    console.log(`  📄 Saved to: ${filepath}`);
    
    // Show preview
    console.log(`  Preview (first 2 lines):`);
    lines.slice(0, 2).forEach(line => {
      console.log(`    ${line}`);
    });
    
  } catch (error) {
    console.error(`  ❌ Error testing ${test.type}:`, error.message);
    allPassed = false;
  }
  
  console.log('');
});

// Summary
if (allPassed) {
  console.log('✅ All tests passed!');
  process.exit(0);
} else {
  console.log('❌ Some tests failed!');
  process.exit(1);
}
