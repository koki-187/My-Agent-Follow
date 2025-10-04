# My Agent Follow（役所調査支援システム）

![CI](https://github.com/koki-187/My-Agent-Follow/actions/workflows/ci.yml/badge.svg)
![CodeQL](https://github.com/koki-187/My-Agent-Follow/actions/workflows/codeql.yml/badge.svg)
![Release](https://img.shields.io/github/v/release/koki-187/My-Agent-Follow)

## 概要
My Agent Follow（MAF）は、不動産売買において必要となる「役所調査」を効率化・標準化するためのWebアプリケーションです。  
主に一都三県（東京・神奈川・埼玉・千葉）の不動産取引に対応し、重要事項説明書や契約書作成に必要な調査を網羅的にサポートします。

### 主な機能
- ✅ 物件情報を入力 → 調査チェックリストを自動生成  
- ✅ 調査項目ごとに「オンライン／郵送／窓口」取得方法をガイド表示  
- ✅ 委任状・申請書・問い合わせメール文例などをテンプレートから自動生成  
- ✅ 取得済み情報を集約して調査報告書・重説用レポートをPDF出力  
- ✅ 成果物をNotion/CSV形式でエクスポートし、社内共有・進捗管理が可能  

---

## 📂 ディレクトリ構成

/
├─ Data/               # マスタデータ（checklist_master.csv, certificates_master.csv, profile.csv）
├─ Templates/          # 委任状、報告書、重説例文、問い合わせメール文例（Markdown形式）
├─ Guides/             # 自治体別フロー（取得フロー_横浜.md, 取得フロー_千葉.md 等）、運用ルール
├─ Reports/            # テスト調査レポート（東京都/神奈川/埼玉/千葉の事例）
├─ Tasks/              # 改善タスクリスト（CSV＋Markdown）
├─ Notion/             # Notion連携用CSVテンプレ（ArtifactsDB.csv, TasksDB.csv, ReportsDB.csv）
├─ tools/              # PDF生成やチェックリスト展開用のスクリプト
└─ README.md

---

## 🚀 導入方法
### 1) クローン
```bash
git clone https://github.com/koki-187/My-Agent-Follow.git
cd My-Agent-Follow
```
2) ローカル起動  
```bash
npm run dev
```

→ http://localhost:3000 でアクセス可能

### 使い方
1. ブラウザで http://localhost:3000 にアクセス
2. 調査項目チェックリストから項目をクリック
3. 項目詳細ドロワーで取得方法を確認
   - 取得方法バッジ（オンライン/郵送/窓口）
   - 窓口名、所要日数、手数料
   - 公式サイトへのリンク
   - 必要な持参物
   - 注記と自治体別ガイドへのリンク

---

🛠 今後の改善ロードマップ
	•	OCR機能による取得書類の自動読取と反映
	•	API連携による自治体オープンデータの自動取得
	•	モバイルUI最適化（iOS/Android対応）
	•	専門用語ツールチップ、非該当項目の折り畳みUI
	•	進捗ダッシュボード機能の拡充
	•	CodeQL/Dependabotによるセキュリティ自動監視

---

🔒 セキュリティと運用ルール
	•	APIキーや認証情報は必ず GitHub Actions Secrets / Vault 管理
	•	main ブランチは PR 必須 & CI/CodeQL パス必須
	•	脆弱性報告ルート：GitHub Security Advisories または security@
	•	重大度に応じて SLA を定義（High: 48h以内対応 / Medium: 7日 / Low: 30日）

---

📦 リリース管理
	•	バージョンは SemVer 準拠 (v1.1.0 = 拡張フェーズ完了)
	•	CHANGELOG.md で変更履歴を管理
	•	GitHub Releases にタグ＋リリースノートを作成

---

📱 PWA 対応メモ
	•	/public/manifest.json にアイコン・カラー等を定義
	•	/public/service-worker.js にキャッシュ制御を記載
	•	iOS Safari 向けに apple-touch-icon, metaタグを追加
