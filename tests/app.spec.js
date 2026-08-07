const { test, expect } = require('@playwright/test');

test.describe('Nevi Web Center E2E & Console Verification', () => {
  let jsExceptions = [];

  test.beforeEach(({ page }) => {
    jsExceptions = [];
    page.on('console', msg => {
      // ネットワーク接続拒否(オプショナルローカルバックエンド試行)以外のJSエラーを記録
      if (msg.type() === 'error' && !msg.text().includes('ERR_CONNECTION_REFUSED') && !msg.text().includes('Failed to load resource')) {
        jsExceptions.push(`[Console Error] ${msg.text()}`);
      }
    });
    page.on('pageerror', err => {
      jsExceptions.push(`[JS Exception] ${err.message}`);
    });
  });

  test('Title and Login Security Gate verification', async ({ page }) => {
    await page.goto('http://localhost:8080/');

    // Title check
    await expect(page).toHaveTitle(/Nevi Web Center/);

    // Gate should be visible initially (unauthenticated)
    const gate = page.locator('#gate');
    await expect(gate).toBeVisible();

    // Clicking login without ID shows error
    await page.click('#loginBtn');
    await expect(page.locator('#gateMsg')).toContainText('許可リストが空です');

    // Inputting valid ID and clicking login opens consent panel
    await page.fill('#gateAdminIdInput', '108927491234567890');
    await page.click('#loginBtn');
    await expect(page.locator('#panelConsent')).toBeVisible();

    // Verify zero JS exceptions
    expect(jsExceptions).toEqual([]);
  });

  test('Admin OAuth Login, Dashboard UI, System Metrics & CRUD Operations', async ({ page }) => {
    await page.goto('http://localhost:8080/');

    // Perform Admin Login with ID input
    await page.fill('#gateAdminIdInput', '108927491234567890');
    await page.click('#loginBtn');
    await page.click('#consentAdmin');

    // Dashboard should become visible
    const app = page.locator('#app');
    await expect(app).toBeVisible();

    // Check Identity Chip in header
    const chipName = page.locator('#chipName');
    await expect(chipName).toContainText('ご主人さま');

    // Verify PC Resource Gauges are rendered
    const valCpu = page.locator('#val-cpu');
    const valMem = page.locator('#val-mem');
    const valDisk = page.locator('#val-disk');

    await expect(valCpu).not.toHaveText('--');
    await expect(valMem).not.toHaveText('--');
    await expect(valDisk).not.toHaveText('--');

    // Navigate to Tasks and Calendar tab
    await page.click('a[data-route="tasks"]');
    await expect(page.locator('#viewTasks')).toBeVisible();

    // Test Task Execution
    const runBtn = page.locator('button[data-act="run"][data-id="vault-backup"]');
    await runBtn.click();
    await page.waitForTimeout(1000);

    // Check Task History updated
    const historyList = page.locator('#historyList');
    await expect(historyList).toContainText('Obsidian Vault');

    // Test Calendar Event Addition
    await page.click('#calAddToggle');
    await page.fill('#calTitleInput', 'E2E 自動テストによる予定追加');
    await page.fill('#calWhere', '自動テスト環境');
    await page.click('#calSubmit');

    const calList = page.locator('#calList');
    await expect(calList).toContainText('E2E 自動テストによる予定追加');

    // Test Calendar Event Deletion
    const delBtn = page.locator('button[data-cal-del]').last();
    await delBtn.click();

    // Navigate to Console / REST API client view
    await page.click('a[data-route="console"]');
    await expect(page.locator('#viewConsole')).toBeVisible();

    // Test REST API client form submission
    await page.click('#apiSubmit');
    await page.waitForTimeout(500);

    // Verify Theme Switching
    const themeBtn = page.locator('#themeBtn');
    await themeBtn.click();
    const htmlTheme = await page.getAttribute('html', 'data-theme');
    expect(htmlTheme).toBeTruthy();

    // Verify zero JS exceptions
    expect(jsExceptions).toEqual([]);
  });

  test('Mobile Responsive Viewport Verification (No Horizontal Scroll)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:8080/');

    // Log in
    await page.fill('#gateAdminIdInput', '108927491234567890');
    await page.click('#loginBtn');
    await page.click('#consentAdmin');

    // Verify no horizontal overflow on Dashboard view
    let hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Check Tasks view responsive overflow
    await page.click('a[data-route="tasks"]');
    hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // Check Console view responsive overflow
    await page.click('a[data-route="console"]');
    hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    expect(jsExceptions).toEqual([]);
  });
});

