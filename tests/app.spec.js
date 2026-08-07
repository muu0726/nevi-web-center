const { test, expect } = require('@playwright/test');

const OWNER_ID = '000000000000000001';

/**
 * ページ内で発生した JS 例外・コンソールエラーを1件も見逃さずに集める。
 * 静的サイトとして自己完結しているため、除外条件は設けない
 * （外部リクエストが発生した時点でそれ自体が不具合）。
 */
function collectErrors(page) {
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`[Console Error] ${msg.text()}`);
  });
  page.on('pageerror', err => errors.push(`[JS Exception] ${err.message}`));
  page.on('requestfailed', req => errors.push(`[Request Failed] ${req.url()}`));
  return errors;
}

/** 許可IDの入力 → ログイン → 認可 までを通してダッシュボードに入る */
async function signIn(page) {
  await page.fill('#gateAdminIdInput', OWNER_ID);
  await page.click('#loginBtn');
  await expect(page.locator('#panelConsent')).toBeVisible();
  await page.click('#consentAdmin');
  await expect(page.locator('#app')).toBeVisible();
}

test.describe('Nevi Web Center', () => {
  let errors;

  test.beforeEach(async ({ page }) => {
    errors = collectErrors(page);
  });

  test.afterEach(() => {
    expect(errors).toEqual([]);
  });

  test('未認証ではゲートが表示され、許可IDが空だとログインできない', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Nevi Web Center/);
    await expect(page.locator('#gate')).toBeVisible();
    await expect(page.locator('#app')).toBeHidden();

    // 既定の許可リストは空。ハードコードされたIDが残っていないこと
    await expect(page.locator('#gateAllowNote')).toContainText('未設定');
    await expect(page.locator('#gateAdminIdInput')).toHaveValue('');

    // ID未入力のままログインするとエラーになり、ゲートは開かない
    await page.click('#loginBtn');
    await expect(page.locator('#gateMsg')).toContainText('許可リストが空です');
    await expect(page.locator('#app')).toBeHidden();

    // ゲートには「セキュリティ境界ではない」旨の明示がある
    await expect(page.locator('.gate-note')).toContainText('セキュリティ境界ではありません');
  });

  test('ログイン → ダッシュボード遷移と主要機能の操作', async ({ page }) => {
    await page.goto('/');
    await signIn(page);

    await expect(page.locator('#chipName')).toContainText('ご主人さま');
    await expect(page.locator('#chipId')).toContainText(OWNER_ID);
    await expect(page.locator('#viewDashboard')).toBeVisible();

    // ゲージが実測値で更新される
    await expect(page.locator('#val-cpu')).not.toHaveText('--');
    await expect(page.locator('#val-mem')).not.toHaveText('--');
    await expect(page.locator('#val-disk')).not.toHaveText('--');

    // タスク実行 → 履歴に反映
    await page.click('a[data-route="tasks"]');
    await expect(page.locator('#viewTasks')).toBeVisible();
    await page.click('button[data-act="run"][data-id="vault-backup"]');
    await expect(page.locator('#historyList')).toContainText('Obsidian Vault', { timeout: 15000 });

    // カレンダー: 追加 → 永続化 → 削除
    await page.click('#calAddToggle');
    await page.fill('#calTitleInput', 'E2E 自動テストによる予定追加');
    await page.fill('#calWhere', '自動テスト環境');
    await page.click('#calSubmit');
    await expect(page.locator('#calList')).toContainText('E2E 自動テストによる予定追加');

    await page.reload();
    await expect(page.locator('#app')).toBeVisible();
    await page.click('a[data-route="tasks"]');
    await expect(page.locator('#calList')).toContainText('E2E 自動テストによる予定追加');

    await page.locator('button[data-cal-del]').last().click();

    // コンソール / 設定ビュー
    await page.click('a[data-route="console"]');
    await expect(page.locator('#viewConsole')).toBeVisible();
    await expect(page.locator('#setAllowIds')).toHaveValue(OWNER_ID);

    // テーマ切替
    await page.click('#themeBtn');
    expect(await page.getAttribute('html', 'data-theme')).toBeTruthy();

    // ログアウトするとゲートに戻る
    await page.click('#logoutBtn');
    await expect(page.locator('#gate')).toBeVisible();
    await expect(page.locator('#app')).toBeHidden();
  });

  test('スマホ幅でもログインでき、横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const overflows = () => page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );

    // ゲート表示中から横スクロールが無いこと
    expect(await overflows()).toBe(false);

    await signIn(page);

    for (const route of ['dashboard', 'tasks', 'console']) {
      await page.click(`a[data-route="${route}"]`);
      await expect(page.locator(`#view${route[0].toUpperCase()}${route.slice(1)}`)).toBeVisible();
      expect(await overflows()).toBe(false);
    }
  });

  test('セッションはリロード後も維持され、未認証では直接アクセスできない', async ({ page }) => {
    await page.goto('/');
    await signIn(page);

    await page.reload();
    await expect(page.locator('#app')).toBeVisible();
    await expect(page.locator('#gate')).toBeHidden();

    // セッションが失われた状態で保護ビューを直接開くとゲートへ戻される
    await page.goto('/#/console');
    await page.evaluate(() => localStorage.removeItem('nevi.webcenter.auth.v1'));
    await page.reload();
    await expect(page.locator('#gate')).toBeVisible();
    await expect(page.locator('#viewConsole')).toBeHidden();
  });

  test('外部ホストへのリクエストを一切行わない（自己完結）', async ({ page }) => {
    const external = [];
    page.on('request', req => {
      if (!req.url().startsWith('http://localhost:8080/')) external.push(req.url());
    });

    await page.goto('/');
    await signIn(page);
    await page.waitForTimeout(1500);

    expect(external).toEqual([]);
  });
});
