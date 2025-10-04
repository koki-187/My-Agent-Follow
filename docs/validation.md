# CSV Export - Validation & Testing Guide

## 概要
このドキュメントは、CSV エクスポート機能の検証手順とDefinition of Done (DoD) の確認項目を記載しています。

## DoD 確認項目

### ✅ 1. API エンドポイントの実装
- [x] `app/api/export/csv/route.ts` が実装されている
- [x] GET メソッドで `type` パラメータを受け付ける（artifacts/reports/tasks）
- [x] GET メソッドで `encoding` パラメータを受け付ける（utf8/sjis）
- [x] デフォルトエンコーディングは utf8
- [x] 不正なパラメータに対してエラーレスポンス（400）を返す

### ✅ 2. CSV 生成機能
- [x] ヘッダー行が正しく生成される
- [x] データ行が正しく生成される
- [x] 特殊文字のエスケープが正しく機能する：
  - [x] カンマ(,)を含む値が引用符で囲まれる
  - [x] 引用符(")が二重引用符("")でエスケープされる
  - [x] 改行が引用符付きフィールド内で保持される

### ✅ 3. エンコーディング対応
- [x] UTF-8 エンコーディングで出力可能
- [x] Shift_JIS エンコーディングで出力可能
- [x] エンコード/デコードの往復変換が正しく機能する
- [x] 日本語文字が文字化けしない

### ✅ 4. ファイル名形式
- [x] `MAF_{type}_{yyyyMMdd}.csv` の形式で生成される
- [x] Content-Disposition ヘッダーが正しく設定される
- [x] 日付が正しい形式（yyyyMMdd）で含まれる

### ✅ 5. Notion テンプレート互換性
- [x] Artifacts: ヘッダーが `Notion/ArtifactsDB.csv` と一致
- [x] Reports: ヘッダーが `Notion/ReportsDB.csv` と一致
- [x] Tasks: ヘッダーが `Notion/TasksDB.csv` と一致

### ✅ 6. ドキュメント
- [x] `docs/notion.md` が作成されている
- [x] Notion インポート手順が記載されている
- [x] 列の対応表が記載されている
- [x] 文字エンコーディングの注意事項が記載されている
- [x] トラブルシューティングが記載されている

### 🔄 7. Notion インポート検証（手動確認が必要）
- [ ] Artifacts CSV を Notion にインポート
  - [ ] 列がズレていない
  - [ ] 文字化けがない
  - [ ] データが正しく取り込まれている
- [ ] Reports CSV を Notion にインポート
  - [ ] 列がズレていない
  - [ ] 文字化けがない
  - [ ] データが正しく取り込まれている
- [ ] Tasks CSV を Notion にインポート
  - [ ] 列がズレていない
  - [ ] 文字化けがない
  - [ ] データが正しく取り込まれている

## 自動テスト結果

### CSV 生成テスト
```bash
$ node tools/test-csv-export.js
✅ All tests passed!
```

### エンコーディングテスト
```bash
$ node tools/test-encoding.js
✅ UTF-8 encoding: OK
✅ Shift_JIS encoding: OK
✅ Round-trip conversion: OK
```

### 統合テスト
```bash
$ node tools/integration-test.js
✅ 6/6 tests passed
```

### エッジケーステスト
```bash
$ node tools/test-edge-cases.js
✅ Comma escaping: OK
✅ Quote escaping: OK
✅ Newline handling: OK
```

## 手動検証手順

### 1. ローカルサーバー起動
```bash
npm install
npm run dev
```

### 2. ブラウザでアクセス
http://localhost:3000

### 3. CSV ダウンロード
各タイプの CSV をダウンロード：
- Artifacts (UTF-8): `/api/export/csv?type=artifacts&encoding=utf8`
- Artifacts (Shift_JIS): `/api/export/csv?type=artifacts&encoding=sjis`
- Reports (UTF-8): `/api/export/csv?type=reports&encoding=utf8`
- Reports (Shift_JIS): `/api/export/csv?type=reports&encoding=sjis`
- Tasks (UTF-8): `/api/export/csv?type=tasks&encoding=utf8`
- Tasks (Shift_JIS): `/api/export/csv?type=tasks&encoding=sjis`

### 4. ファイル名確認
ダウンロードされたファイル名が以下の形式であることを確認：
- `MAF_artifacts_20251004.csv`
- `MAF_reports_20251004.csv`
- `MAF_tasks_20251004.csv`

### 5. CSV 内容確認
テキストエディタで開き、以下を確認：
- [x] ヘッダー行が正しい（日本語）
- [x] データが正しく表示される
- [x] 文字化けがない（UTF-8の場合）
- [x] 特殊文字が正しくエスケープされている

### 6. Notion インポート手順

#### 6.1 Notion データベース作成
1. Notion で新しいデータベースを作成
2. `docs/notion.md` のスキーマに従って列を作成

#### 6.2 CSV インポート
1. Notion データベースの右上「…」メニューをクリック
2. 「Import」→「CSV」を選択
3. ダウンロードした CSV ファイルを選択
4. 「1行目をヘッダーとして使用」にチェック
5. 列のマッピングを確認
6. 「Import」をクリック

#### 6.3 インポート後の確認
- [ ] すべてのデータが取り込まれている
- [ ] 列がズレていない（正しい列に配置されている）
- [ ] 日本語が文字化けしていない
- [ ] カンマを含むデータが正しく1つのセルに収まっている
- [ ] 引用符を含むデータが正しく表示されている
- [ ] 改行を含むデータが正しく表示されている

## トラブルシューティング

### 文字化けが発生する場合
1. UTF-8 でエクスポートした CSV を使用
2. それでも解決しない場合は Shift_JIS を試す
3. Notion のインポート設定でエンコーディングを確認

### 列がズレる場合
1. CSV のヘッダー行と Notion データベースの列名が一致しているか確認
2. データ内のカンマが正しくエスケープされているか確認
3. Notion のインポート設定で「列のマッピング」を手動調整

### データが欠損する場合
1. CSV ファイルをテキストエディタで開き、データが存在するか確認
2. 空白や特殊文字が原因でないか確認
3. Notion データベースの列タイプと CSV データの形式が一致しているか確認

## 本番環境デプロイ前チェックリスト

- [ ] すべての自動テストが通過している
- [ ] Notion への手動インポートテストが完了している
- [ ] ドキュメントが最新の状態である
- [ ] エラーハンドリングが適切に実装されている
- [ ] セキュリティ上の問題がない（機密情報の漏洩など）
- [ ] パフォーマンステストが完了している（大量データでの動作確認）

## 既知の制限事項

1. **ダミーデータ使用**
   - 現在は in-memory のダミーデータを使用
   - 本番環境では Prisma または実際のデータベースと連携が必要

2. **Notion インポート制限**
   - Notion には一度にインポートできる行数に制限がある可能性がある
   - 大量データの場合は複数回に分けてインポートを推奨

3. **エンコーディング**
   - Shift_JIS は一部の特殊文字に対応していない可能性がある
   - 基本的に UTF-8 の使用を推奨

## 次のステップ

1. Prisma との連携実装
2. 実データでのテスト
3. ページネーション機能の追加（大量データ対応）
4. エクスポート履歴の記録機能
5. スケジュール実行機能（定期エクスポート）
