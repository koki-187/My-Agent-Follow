# Tools ディレクトリ - 技術仕様

My Agent Follow（MAF）のツール群に関する技術仕様と設置方針

## 概要

このディレクトリには、MAFの各種機能を実現するためのツールスクリプトと設定ファイルを配置します。

## 主要ツール

### 1. チェックリスト展開ツール

#### checklist_generator.py
**目的**: 物件情報に基づいて必要な調査項目を自動生成

**入力**:
- 物件情報（住所、用途、規模等）
- checklist_master.csv（調査項目マスタ）

**出力**:
- カスタマイズされたチェックリスト（MD/CSV形式）
- Notion用インポートデータ

**主要ロジック**:
```python
def generate_checklist(property_info, master_csv):
    """
    物件情報から必要な調査項目を抽出
    - 用途に応じた必須項目の選定
    - 所在地（自治体）に応じた追加項目
    - 規模に応じた特別項目（大規模建築等）
    """
    pass
```

**実装予定機能**:
- [ ] 物件種別による項目フィルタリング
- [ ] 自治体別の特殊項目追加
- [ ] 優先度の自動設定
- [ ] Notionへの自動アップロード

### 2. PDF生成ツール

#### report_pdf_generator.py
**目的**: Markdown形式の報告書をPDFに変換

**技術スタック**:
- WeasyPrint または Puppeteer
- CSSテンプレート（日本語フォント対応）

**入力**:
- 報告書MDファイル
- テンプレートCSS

**出力**:
- PDF形式の報告書
- メタデータ埋め込み（作成日、案件ID等）

**設置方針**:
```python
def generate_pdf(markdown_file, output_path, template='default'):
    """
    Markdownを整形されたPDFに変換
    - 日本語フォント（Noto Sans JP）の適用
    - ヘッダー/フッターの自動生成
    - ページ番号の挿入
    - 目次の自動生成
    """
    pass
```

**カスタマイズポイント**:
- [ ] 会社ロゴの挿入
- [ ] フォントサイズ・行間の調整
- [ ] 余白設定のカスタマイズ
- [ ] 透かし（DRAFT/CONFIDENTIAL等）

### 3. OCRフック

#### ocr_processor.py
**目的**: スキャン画像から自動的にテキストを抽出し、データ化

**技術選択肢**:
1. **Tesseract OCR**（オープンソース）
   - 利点: 無料、オフライン動作可能
   - 欠点: 精度が若干低い

2. **Google Cloud Vision API**（クラウド）
   - 利点: 高精度、手書き対応
   - 欠点: API利用料が発生

3. **AWS Textract**（クラウド）
   - 利点: 表形式の抽出に強い
   - 欠点: API利用料が発生

**推奨**: 開発時はTesseract、本番環境はCloud Vision API

**処理フロー**:
```python
def process_scanned_document(image_path, doc_type):
    """
    1. 画像の前処理（傾き補正、ノイズ除去）
    2. OCRによるテキスト抽出
    3. 書類種別に応じた構造化
    4. データベースへの自動入力
    """
    pass
```

**対応書類タイプ**:
- [ ] 登記事項証明書
- [ ] 公図
- [ ] 用途地域証明書
- [ ] 道路台帳
- [ ] 建築計画概要書

**エラーハンドリング**:
- 認識精度が低い場合のアラート
- 手動確認フラグの設定
- 抽出失敗時のフォールバック処理

### 4. データ同期ツール

#### notion_sync.py
**目的**: NotionデータベースとローカルCSVの双方向同期

**機能**:
```python
def sync_to_notion(csv_file, database_id):
    """CSVデータをNotionにアップロード"""
    pass

def sync_from_notion(database_id, csv_file):
    """NotionデータをCSVにエクスポート"""
    pass
```

**設定項目**:
- Notion API Token
- データベースID
- 同期間隔（手動/自動）
- 競合解決ルール（Notionを優先 or ローカルを優先）

### 5. テンプレート差し込みツール

#### template_filler.py
**目的**: テンプレートに物件情報・依頼者情報を自動挿入

**対応テンプレート**:
- 委任状
- 報告書
- 問い合わせメール

**変数形式**: `{{変数名}}`

**実装例**:
```python
def fill_template(template_file, data_dict, output_file):
    """
    テンプレートの{{変数}}を実データで置換
    - 日付の自動挿入（{{今日の日付}}等）
    - 条件分岐（建物の場合のみ表示等）
    - リストの展開（取得書類一覧等）
    """
    pass
```

## ディレクトリ構造

```
tools/
├── README_tools.md              # このファイル
├── checklist_generator.py       # チェックリスト生成
├── report_pdf_generator.py      # PDF生成
├── ocr_processor.py             # OCR処理
├── notion_sync.py               # Notion同期
├── template_filler.py           # テンプレート差し込み
├── config/                      # 設定ファイル
│   ├── ocr_config.json         # OCR設定
│   ├── pdf_template.css        # PDFテンプレート
│   └── notion_config.json      # Notion設定
├── tests/                       # テストコード
│   └── test_*.py
└── utils/                       # ユーティリティ
    ├── image_processor.py      # 画像処理
    └── text_parser.py          # テキスト解析
```

## 環境構築

### 必要なパッケージ

```bash
# Python依存関係
pip install -r requirements.txt

# requirements.txt 内容例:
# pandas
# openpyxl
# pillow
# pytesseract
# weasyprint
# notion-client
# google-cloud-vision
```

### 環境変数

```bash
# .env ファイルに設定
NOTION_API_TOKEN=secret_xxxxx
NOTION_ARTIFACTS_DB=xxxxx
NOTION_TASKS_DB=xxxxx
NOTION_REPORTS_DB=xxxxx
GOOGLE_CLOUD_CREDENTIALS=/path/to/credentials.json
```

## 使用方法

### チェックリスト生成
```bash
python checklist_generator.py --property-info property.json --output checklist.md
```

### PDF生成
```bash
python report_pdf_generator.py --input report.md --output report.pdf
```

### OCR処理
```bash
python ocr_processor.py --image scan.jpg --type 登記事項証明書 --output data.json
```

### Notion同期
```bash
python notion_sync.py --action upload --csv Data/checklist_master.csv --db artifacts
```

## セキュリティ考慮事項

- [ ] API Keyは環境変数で管理（.envファイル、Gitにコミットしない）
- [ ] OCR処理時の画像は一時フォルダに保存し、処理後削除
- [ ] 個人情報を含むログは記録しない
- [ ] PDF生成時の透かし挿入（機密情報保護）

## パフォーマンス最適化

- [ ] OCR処理の並列化（複数画像の同時処理）
- [ ] PDF生成時のキャッシュ利用
- [ ] Notion API呼び出しのレート制限対応
- [ ] バッチ処理による効率化

## 今後の拡張予定

1. **自動メール送信**: 報告書完成時に自動送信
2. **Slack通知**: タスク完了時の通知
3. **音声入力**: 現場でのメモ入力
4. **QRコード生成**: 書類管理用
5. **データ分析**: 調査傾向の可視化

---
最終更新: 2024年3月
技術責任者: 開発チーム
