# サンプル調査チェックリスト（脚注テスト用）

## チェック済み項目の例

このファイルは、PDF生成ツールのテスト用サンプルデータです。

### 都市計画関連
- [x] 用途地域確認
  - notes: `{"sourceUrl":"https://www.city.shibuya.tokyo.jp/urban_planning","checkedAt":"2025-01-15","by":"山田太郎"}`
  - 結果: 第一種住居地域

- [x] 防火地域確認
  - notes: `{"sourceUrl":"https://www.city.shibuya.tokyo.jp/fire_area","checkedAt":"2025-01-15","by":"山田太郎"}`
  - 結果: 準防火地域

- [x] 高度地区確認
  - notes: `{"sourceUrl":"https://www.city.shibuya.tokyo.jp/height_district","checkedAt":"2025-01-15","by":"山田太郎"}`
  - 結果: 第二種高度地区

### 道路関連
- [x] 道路台帳確認
  - notes: `{"sourceUrl":"https://www.city.shibuya.tokyo.jp/road_registry","checkedAt":"2025-01-16","by":"佐藤花子"}`
  - 結果: 幅員6m 公道（建築基準法42条1項1号）

- [x] セットバック要否
  - notes: `{"sourceUrl":"https://www.city.shibuya.tokyo.jp/setback","checkedAt":"2025-01-16","by":"佐藤花子"}`
  - 結果: セットバック不要

### インフラ関連
- [x] 上下水道台帳確認
  - notes: `{"sourceUrl":"https://www.city.shibuya.tokyo.jp/water_supply","checkedAt":"2025-01-16","by":"佐藤花子"}`
  - 結果: 上水道φ200mm配管済み、本下水接続済み

- [x] ガス供給状況
  - notes: `{"sourceUrl":"https://www.tokyo-gas.co.jp/supply","checkedAt":"2025-01-17","by":"鈴木一郎"}`
  - 結果: 都市ガス供給区域

### 防災関連
- [x] ハザードマップ確認
  - notes: `{"sourceUrl":"https://www.city.shibuya.tokyo.jp/hazard_map","checkedAt":"2025-01-17","by":"鈴木一郎"}`
  - 結果: 洪水浸水想定区域外、土砂災害警戒区域外

- [x] 液状化リスク確認
  - notes: `{"sourceUrl":"https://www.bousai.metro.tokyo.lg.jp/liquefaction","checkedAt":"2025-01-17","by":"鈴木一郎"}`
  - 結果: 液状化危険度：低

### 未チェック項目の例
- [ ] 文化財包蔵地確認
  - notes: 未実施

- [ ] 埋蔵文化財調査
  - notes: 未実施

## PDF生成時の挙動
- チェック済み（[x]）の項目のみが脚注として収集されます
- notes に `sourceUrl`, `checkedAt`, `by` の3つのフィールドが必須です
- 脚注は PDF末尾に「出典・参考情報」セクションとして追加されます

## 実装例（HTML）
```html
<input type="checkbox" checked 
  data-notes='{"sourceUrl":"https://example.com","checkedAt":"2025-01-15","by":"担当者名"}'>
```
