import { NextRequest, NextResponse } from 'next/server';
import iconv from 'iconv-lite';

// Dummy data for Artifacts
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

// Dummy data for Reports
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

// Dummy data for Tasks
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

// Convert data to CSV string
function convertToCSV(data: any[], headers: string[]): string {
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

// Format date as yyyyMMdd
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const encoding = searchParams.get('encoding') || 'utf8';

  // Validate type parameter
  if (!type || !['artifacts', 'reports', 'tasks'].includes(type)) {
    return NextResponse.json(
      { error: 'Invalid type parameter. Must be one of: artifacts, reports, tasks' },
      { status: 400 }
    );
  }

  // Validate encoding parameter
  if (!['utf8', 'sjis'].includes(encoding)) {
    return NextResponse.json(
      { error: 'Invalid encoding parameter. Must be one of: utf8, sjis' },
      { status: 400 }
    );
  }

  let csvContent: string;
  let headers: string[];
  
  // Generate CSV based on type
  switch (type) {
    case 'artifacts':
      headers = ['資料名', '種別', '関連項目', '取得先', '取得手段', '取得日', '担当', '備考'];
      csvContent = convertToCSV(artifactsData, headers);
      break;
    case 'reports':
      headers = ['案件名', '地域', '種別', '取得済', '未取得', '所見', '判断'];
      csvContent = convertToCSV(reportsData, headers);
      break;
    case 'tasks':
      headers = ['タスク名', '説明', '優先度', 'ステータス', '担当', 'フェーズ'];
      csvContent = convertToCSV(tasksData, headers);
      break;
    default:
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  // Convert encoding if needed
  let buffer: Buffer;
  if (encoding === 'sjis') {
    buffer = iconv.encode(csvContent, 'shift_jis');
  } else {
    buffer = Buffer.from(csvContent, 'utf-8');
  }

  // Generate filename with current date
  const today = formatDate(new Date());
  const filename = `MAF_${type}_${today}.csv`;

  // Return CSV with appropriate headers
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-cache',
    },
  });
}
