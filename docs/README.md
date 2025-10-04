# ドキュメント

このディレクトリには My Agent Follow システムの各種ドキュメントが含まれています。

## ファイル一覧

### [notion.md](./notion.md)
Notion連携ガイド - CSV エクスポート機能とNotionへのインポート手順を説明しています。

#### 内容
- CSV エクスポート API の使用方法
- UTF-8 / Shift_JIS エンコーディングの選択
- Notion データベースへのインポート手順
- トラブルシューティング
- 列の対応表

## CSVエクスポート API

### エンドポイント
```
GET /api/export/csv?type={type}&encoding={encoding}
```

### パラメータ
- `type`: `artifacts` | `reports` | `tasks` (必須)
- `encoding`: `utf8` | `sjis` (オプション、デフォルト: utf8)

### 使用例
```bash
# Artifactsをエクスポート (UTF-8)
curl "http://localhost:3000/api/export/csv?type=artifacts&encoding=utf8" -o artifacts.csv

# ReportsをShift_JISでエクスポート
curl "http://localhost:3000/api/export/csv?type=reports&encoding=sjis" -o reports.csv

# Tasksをエクスポート (デフォルトUTF-8)
curl "http://localhost:3000/api/export/csv?type=tasks" -o tasks.csv
```

## 対応データ型

### Artifacts (資料)
調査で取得した資料・成果物の情報

### Reports (報告)
不動産調査の報告・所見の情報

### Tasks (タスク)
システム改善タスクや進捗管理情報
