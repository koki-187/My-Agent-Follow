# Notion連携ガイド

## 概要
My Agent Follow（MAF）システムから、Artifacts（資料）、Reports（調査報告）、Tasks（タスク）の3種類のデータをCSV形式でエクスポートし、Notionデータベースにインポートする手順を説明します。

---

## CSVエクスポート方法

### API エンドポイント
```
GET /api/export/csv?type={type}&encoding={encoding}
```

### パラメータ

#### type（必須）
エクスポートするデータの種類を指定します。
- `artifacts` - 資料・成果物データ
- `reports` - 調査報告データ
- `tasks` - タスクデータ

#### encoding（オプション、デフォルト: utf8）
CSVファイルの文字エンコーディングを指定します。
- `utf8` - UTF-8エンコーディング（推奨）
- `sjis` - Shift_JISエンコーディング（Windows Excel用）

### 使用例

#### Artifacts（資料）をUTF-8でエクスポート
```
GET /api/export/csv?type=artifacts&encoding=utf8
```

#### Reports（報告）をShift_JISでエクスポート
```
GET /api/export/csv?type=reports&encoding=sjis
```

#### Tasks（タスク）をエクスポート（デフォルトUTF-8）
```
GET /api/export/csv?type=tasks
```

### ファイル名形式
ダウンロードされるCSVファイルは以下の形式で自動生成されます：
```
MAF_{type}_{yyyyMMdd}.csv
```

例：
- `MAF_artifacts_20250115.csv`
- `MAF_reports_20250115.csv`
- `MAF_tasks_20250115.csv`

---

## NotionへのCSVインポート手順

### 1. Notionデータベースの準備

各タイプに対応するNotionデータベースを作成します。以下の列構成を使用してください。

#### Artifacts Database（資料データベース）
| 列名 | タイプ | 説明 |
|-----|------|------|
| 資料名 | Title | 資料の名称 |
| 種別 | Select | 資料の種別（法規、インフラ等） |
| 関連項目 | Text | 関連する法令・項目 |
| 取得先 | Text | 資料の取得元 |
| 取得手段 | Select | 取得方法（窓口、オンライン、郵送） |
| 取得日 | Date | 取得した日付 |
| 担当 | Person or Text | 担当者 |
| 備考 | Text | 補足情報 |

#### Reports Database（報告データベース）
| 列名 | タイプ | 説明 |
|-----|------|------|
| 案件名 | Title | 案件・物件名 |
| 地域 | Text | 所在地域 |
| 種別 | Select | 物件種別（マンション、戸建等） |
| 取得済 | Text | 取得済みの資料 |
| 未取得 | Text | 未取得の資料 |
| 所見 | Text | 調査所見 |
| 判断 | Select | 判断結果（可、条件付き可、保留等） |

#### Tasks Database（タスクデータベース）
| 列名 | タイプ | 説明 |
|-----|------|------|
| タスク名 | Title | タスクの名称 |
| 説明 | Text | タスクの詳細説明 |
| 優先度 | Select | 優先度（高、中、低） |
| ステータス | Select | 状態（未着手、進行中、完了等） |
| 担当 | Person or Text | 担当者・チーム |
| フェーズ | Select | 開発フェーズ |

### 2. CSVファイルのエクスポート

MAFシステムから該当するCSVをダウンロードします。

**重要：文字エンコーディングの選択**
- **Notionで直接インポートする場合**: `encoding=utf8` を使用（推奨）
- **Windows Excelで加工してからインポートする場合**: `encoding=sjis` を使用

### 3. Notionへのインポート実行

1. Notionの対象データベースを開く
2. 右上の「…」メニューをクリック
3. 「Import」を選択
4. 「CSV」を選択
5. エクスポートしたCSVファイルを選択
6. インポート設定画面で以下を確認：
   - **「1行目をヘッダーとして使用」にチェック**
   - **列の対応が正しいことを確認**
   - 必要に応じて列のマッピングを調整

### 4. インポート後の確認事項

#### 文字化け確認
- 日本語が正しく表示されているか確認
- 文字化けが発生した場合は `encoding=sjis` または `encoding=utf8` を切り替えて再試行

#### 列のズレ確認
- 各データが正しい列に配置されているか確認
- データにカンマ(,)や改行が含まれる場合、正しくエスケープされているか確認

#### データ型確認
- 日付列が正しく認識されているか（YYYY-MM-DD形式）
- Select型の列の選択肢が適切か

---

## トラブルシューティング

### 文字化けが発生する場合

**問題**: インポート後に日本語が文字化けする

**解決策**:
1. UTF-8でエクスポートしたCSVを使用
   ```
   GET /api/export/csv?type=artifacts&encoding=utf8
   ```
2. Notionのインポート設定でエンコーディングを確認
3. それでも解決しない場合は、Shift_JISでエクスポートを試す
   ```
   GET /api/export/csv?type=artifacts&encoding=sjis
   ```

### 列がズレる・データが不正な位置に入る場合

**問題**: CSVインポート後、データが意図しない列に配置される

**解決策**:
1. CSVの1行目（ヘッダー行）とNotionデータベースの列名が一致しているか確認
2. データ内にカンマ(,)や二重引用符(")が含まれる場合、適切にエスケープされているか確認
3. Notionのインポート設定で「列のマッピング」を手動で調整

### データが欠損する場合

**問題**: 一部のデータがインポートされない

**解決策**:
1. CSVファイルをテキストエディタで開き、データが正しく存在するか確認
2. 空白のセルや特殊文字が原因でないか確認
3. Notionデータベースの列タイプとCSVデータの形式が一致しているか確認

---

## ベストプラクティス

### 文字コードの選択
- **推奨**: UTF-8を使用（`encoding=utf8`）
  - Notionは標準でUTF-8をサポート
  - 文字化けのリスクが最小
- **Windows環境**: Shift_JISを使用（`encoding=sjis`）
  - Excelで開いて確認・編集する場合に便利

### インポート前の準備
1. テンプレートとなるNotionデータベースをあらかじめ作成
2. 少量のサンプルデータで事前テスト
3. 本番データのインポート前にバックアップを取得

### 定期的なエクスポート
- プロジェクトの節目でCSVエクスポートを実施
- バージョン管理のためファイル名に日付が自動付与される
- 複数バージョンを保持して履歴管理

---

## 列の対応表（クイックリファレンス）

### Artifacts（資料）
| CSV列名 | Notion列名 | 備考 |
|---------|-----------|------|
| resourceName | 資料名 | Title型 |
| type | 種別 | Select型 |
| relatedItem | 関連項目 | Text型 |
| source | 取得先 | Text型 |
| method | 取得手段 | Select型 |
| acquisitionDate | 取得日 | Date型 |
| assignee | 担当 | Person/Text型 |
| notes | 備考 | Text型 |

### Reports（報告）
| CSV列名 | Notion列名 | 備考 |
|---------|-----------|------|
| projectName | 案件名 | Title型 |
| region | 地域 | Text型 |
| type | 種別 | Select型 |
| acquired | 取得済 | Text型 |
| notAcquired | 未取得 | Text型 |
| findings | 所見 | Text型 |
| decision | 判断 | Select型 |

### Tasks（タスク）
| CSV列名 | Notion列名 | 備考 |
|---------|-----------|------|
| taskName | タスク名 | Title型 |
| description | 説明 | Text型 |
| priority | 優先度 | Select型 |
| status | ステータス | Select型 |
| assignee | 担当 | Person/Text型 |
| phase | フェーズ | Select型 |

---

## 注意事項

### 文字エンコーディング
- **UTF-8**: 国際標準、Notion推奨
- **Shift_JIS**: 日本語Windows環境向け、Excelとの互換性が高い
- どちらを選択するかは使用環境に応じて決定してください

### データのプライバシー
- エクスポートしたCSVファイルには機密情報が含まれる可能性があります
- ファイルの取り扱いには十分注意してください
- 不要になったファイルは適切に削除してください

### Notionの制限
- Notionのインポート機能には、一度にインポートできる行数に制限がある場合があります
- 大量データの場合は、複数回に分けてインポートすることを推奨します
