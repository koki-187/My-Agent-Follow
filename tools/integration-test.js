#!/usr/bin/env node

/**
 * Integration Test for CSV Export API
 * 
 * This script simulates the API endpoint functionality to verify
 * the complete export flow including:
 * - Data generation
 * - CSV formatting
 * - Encoding (UTF-8 and Shift_JIS)
 * - Filename generation
 */

const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');

// Data definitions (same as in route.ts)
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
  },
  {
    '資料名': '道路台帳',
    '種別': 'インフラ',
    '関連項目': '道路',
    '取得先': '千葉市道路部',
    '取得手段': '郵送',
    '取得日': '2025-01-17',
    '担当': '鈴木',
    '備考': ''
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
  },
  {
    '案件名': 'ダミー住宅案件',
    '地域': '千葉県千葉市',
    '種別': '戸建',
    '取得済': '建築確認済証、道路台帳',
    '未取得': '',
    '所見': '問題なし',
    '判断': '可'
  },
  {
    '案件名': 'サンプル物件A',
    '地域': '東京都新宿区',
    '種別': 'オフィス',
    '取得済': '建築確認済証',
    '未取得': '防火地域証明',
    '所見': '防火地域調査中',
    '判断': '保留'
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
  },
  {
    'タスク名': '非該当項目の折り畳み表示',
    '説明': 'チェックリストで非該当項目を折りたたんで表示',
    '優先度': '低',
    'ステータス': '未着手',
    '担当': '開発チーム',
    'フェーズ': 'フェーズ2'
  },
  {
    'タスク名': 'モバイル余白調整',
    '説明': 'スマートフォン表示時のUI調整',
    '優先度': '高',
    'ステータス': '進行中',
    '担当': 'UI担当',
    'フェーズ': 'フェーズ1'
  },
  {
    'タスク名': 'API連携検討',
    '説明': '自治体オープンデータとのAPI連携',
    '優先度': '中',
    'ステータス': '計画中',
    '担当': 'アーキテクト',
    'フェーズ': 'フェーズ3'
  },
  {
    'タスク名': 'OCR精度向上',
    '説明': '書類読み取り精度の改善',
    '優先度': '高',
    'ステータス': '進行中',
    '担当': 'AI担当',
    'フェーズ': 'フェーズ2'
  },
  {
    'タスク名': 'ダッシュボードUI設計',
    '説明': '進捗管理ダッシュボードの設計',
    '優先度': '中',
    'ステータス': '未着手',
    '担当': 'UI担当',
    'フェーズ': 'フェーズ2'
  }
];

// Helper functions
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

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

// Test configuration
const testCases = [
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

const encodings = ['utf8', 'sjis'];
const outputDir = path.join(__dirname, '..', 'test-output');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🧪 Running CSV Export Integration Tests...\n');

let totalTests = 0;
let passedTests = 0;
const today = formatDate(new Date());

testCases.forEach(testCase => {
  console.log(`\n📦 Testing ${testCase.type}...`);
  
  const csvContent = convertToCSV(testCase.data, testCase.headers);
  
  encodings.forEach(encoding => {
    totalTests++;
    console.log(`\n  🔧 Encoding: ${encoding}`);
    
    try {
      // Generate filename
      const filename = `MAF_${testCase.type}_${today}.csv`;
      console.log(`  📄 Filename: ${filename}`);
      
      // Encode
      let buffer;
      if (encoding === 'sjis') {
        buffer = iconv.encode(csvContent, 'shift_jis');
      } else {
        buffer = Buffer.from(csvContent, 'utf-8');
      }
      
      // Save to file
      const filepath = path.join(outputDir, `${testCase.type}_${encoding}.csv`);
      fs.writeFileSync(filepath, buffer);
      
      // Verify file
      const fileBuffer = fs.readFileSync(filepath);
      let decodedContent;
      if (encoding === 'sjis') {
        decodedContent = iconv.decode(fileBuffer, 'shift_jis');
      } else {
        decodedContent = fileBuffer.toString('utf-8');
      }
      
      // Verify content matches
      if (decodedContent === csvContent) {
        console.log(`  ✅ Encoding/decoding verified`);
        console.log(`  ✅ File saved: ${filepath}`);
        console.log(`  📊 Size: ${buffer.length} bytes`);
        passedTests++;
      } else {
        console.log(`  ❌ Content mismatch after encoding/decoding`);
      }
      
      // Show preview
      const lines = csvContent.split('\n');
      console.log(`  Preview (first 2 lines):`);
      lines.slice(0, 2).forEach(line => {
        console.log(`    ${line.substring(0, 80)}${line.length > 80 ? '...' : ''}`);
      });
      
    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  });
});

console.log('\n\n' + '='.repeat(60));
console.log(`📊 Test Summary: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log('✅ All integration tests passed!');
  console.log('\n📝 Next steps:');
  console.log('1. Review generated CSV files in test-output/ directory');
  console.log('2. Import CSV files to Notion to verify column alignment');
  console.log('3. Check for character encoding issues');
  console.log('4. Verify filename format: MAF_{type}_{yyyyMMdd}.csv');
  process.exit(0);
} else {
  console.log('❌ Some tests failed!');
  process.exit(1);
}
