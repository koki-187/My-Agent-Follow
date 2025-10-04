# tools フォルダ方針

このディレクトリには、My Agent Follow システムの各種ツールとテストスクリプトが含まれています。

## テストスクリプト

### CSV Export Tests

#### test-csv-export.js
CSV エクスポート機能の基本テスト
- CSV ヘッダーの検証
- データ行数の検証
- 生成されたCSVファイルの保存と確認

```bash
node tools/test-csv-export.js
```

#### test-encoding.js
文字エンコーディングのテスト
- UTF-8 エンコーディングの検証
- Shift_JIS エンコーディングの検証
- エンコード/デコードの往復変換テスト

```bash
node tools/test-encoding.js
```

#### integration-test.js
統合テスト - 完全なエクスポートフローの検証
- 全データタイプ（artifacts, reports, tasks）のテスト
- 全エンコーディング（UTF-8, Shift_JIS）のテスト
- ファイル名形式の検証
- ファイル保存と読み込みの検証

```bash
node tools/integration-test.js
```

#### test-edge-cases.js
CSV エッジケースのテスト
- カンマを含む値のエスケープ
- 引用符を含む値のエスケープ
- 改行を含む値の処理

```bash
node tools/test-edge-cases.js
```

## 将来的な機能（予定）

以下の機能を追加予定：
- PDF生成スクリプト
- チェックリスト展開ツール
- OCRフックおよび自動連携

## 開発中のツール

### checklist_generator.py
チェックリスト生成ツール（開発中）

## テスト出力

すべてのテストスクリプトは `test-output/` ディレクトリにファイルを生成します。
このディレクトリは `.gitignore` に含まれており、Git では追跡されません。

