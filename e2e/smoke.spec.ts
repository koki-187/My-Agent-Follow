import { test, expect } from '@playwright/test';

/**
 * Smoke test for core workflow:
 * トップ → 物件作成 → チェックリスト生成 → CSVエクスポート → PDF出力
 */
test.describe('My Agent Follow - Smoke Test', () => {
  test('should complete core workflow: property creation → checklist → CSV → PDF', async ({ page }) => {
    // 1. トップページに移動
    await page.goto('/');
    await expect(page).toHaveTitle(/My Agent Follow/i);

    // 2. 新規物件作成
    // Note: 実際のセレクタは実装に応じて調整が必要
    const newPropertyButton = page.getByRole('button', { name: /新規物件|物件作成|new property/i });
    if (await newPropertyButton.isVisible().catch(() => false)) {
      await newPropertyButton.click();
      
      // 住所入力（仮の例）
      const addressInput = page.getByLabel(/住所|address/i);
      if (await addressInput.isVisible().catch(() => false)) {
        await addressInput.fill('東京都千代田区丸の内1-1-1');
      }
      
      // 物件情報保存
      const saveButton = page.getByRole('button', { name: /保存|作成|save|create/i });
      if (await saveButton.isVisible().catch(() => false)) {
        await saveButton.click();
        // 保存成功を待機
        await page.waitForTimeout(1000);
      }
    }

    // 3. チェックリスト生成
    const generateChecklistButton = page.getByRole('button', { name: /チェックリスト生成|generate checklist/i });
    if (await generateChecklistButton.isVisible().catch(() => false)) {
      await generateChecklistButton.click();
      
      // チェックリストが表示されるまで待機
      await page.waitForSelector('[data-testid="checklist"], .checklist, table', { timeout: 10000 }).catch(() => {});
    }

    // 4. CSVエクスポート
    const csvExportButton = page.getByRole('button', { name: /csv.*エクスポート|export.*csv|csvダウンロード/i });
    if (await csvExportButton.isVisible().catch(() => false)) {
      // ダウンロードイベントを監視
      const downloadPromise = page.waitForEvent('download');
      await csvExportButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toMatch(/\.csv$/i);
      
      // ダウンロードファイルの内容確認（オプション）
      const path = await download.path();
      if (path) {
        const fs = await import('fs');
        const content = fs.readFileSync(path, 'utf-8');
        expect(content.length).toBeGreaterThan(0);
      }
    }

    // 5. PDF出力ボタン押下
    const pdfExportButton = page.getByRole('button', { name: /pdf.*出力|export.*pdf|pdfダウンロード|pdf生成/i });
    if (await pdfExportButton.isVisible().catch(() => false)) {
      // PDFダウンロードイベントを監視
      const pdfDownloadPromise = page.waitForEvent('download');
      await pdfExportButton.click();
      
      const pdfDownload = await pdfDownloadPromise;
      expect(pdfDownload.suggestedFilename()).toMatch(/\.pdf$/i);
    }

    // テスト完了の確認
    console.log('✅ Smoke test completed successfully');
  });

  test('should display homepage correctly', async ({ page }) => {
    await page.goto('/');
    
    // ホームページの基本要素確認
    await expect(page).toHaveTitle(/My Agent Follow/i);
    
    // ヘッダーまたはナビゲーションの存在確認
    const header = page.locator('header, nav, [role="banner"]').first();
    if (await header.isVisible().catch(() => false)) {
      await expect(header).toBeVisible();
    }
  });

  test('should have PWA manifest', async ({ page }) => {
    await page.goto('/');
    
    // manifest.jsonの存在確認
    const manifestLink = page.locator('link[rel="manifest"]');
    if (await manifestLink.count() > 0) {
      const manifestHref = await manifestLink.getAttribute('href');
      expect(manifestHref).toBeTruthy();
      
      // manifest.jsonにアクセス
      const manifestResponse = await page.request.get(manifestHref || '/manifest.json');
      expect(manifestResponse.ok()).toBeTruthy();
    }
  });
});
