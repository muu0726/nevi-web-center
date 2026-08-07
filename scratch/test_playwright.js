/* 目視確認用: 主要ビューのスクリーンショットと全ボタンのクリック走査 */
const { chromium } = require('playwright');

const OWNER_ID = '000000000000000001';
const BASE = 'http://localhost:8080';

(async () => {
  const browser = await chromium.launch();
  const problems = [];

  for (const [name, opts] of [
    ['desktop-dark', { viewport: { width: 1280, height: 900 }, colorScheme: 'dark' }],
    ['desktop-light', { viewport: { width: 1280, height: 900 }, colorScheme: 'light' }],
    ['mobile-dark', { viewport: { width: 375, height: 812 }, colorScheme: 'dark' }],
    ['mobile-light', { viewport: { width: 375, height: 812 }, colorScheme: 'light' }],
  ]) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    page.on('console', m => { if (m.type() === 'error') problems.push(`${name} console: ${m.text()}`); });
    page.on('pageerror', e => problems.push(`${name} pageerror: ${e.message}`));
    page.on('requestfailed', r => problems.push(`${name} requestfailed: ${r.url()}`));

    await page.goto(BASE + '/');
    await page.screenshot({ path: `scratch/shot-${name}-gate.png`, fullPage: true });

    await page.fill('#gateAdminIdInput', OWNER_ID);
    await page.click('#loginBtn');
    await page.click('#consentAdmin');
    await page.waitForSelector('#app:not([hidden])');
    await page.waitForTimeout(2500);

    for (const route of ['dashboard', 'tasks', 'console']) {
      await page.click(`a[data-route="${route}"]`);
      await page.waitForTimeout(300);
      await page.screenshot({ path: `scratch/shot-${name}-${route}.png`, fullPage: true });
      const of = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth);
      if (of) problems.push(`${name}/${route}: horizontal overflow`);
    }
    await ctx.close();
  }

  // 全ボタン走査（例外が出ないこと）
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  page.on('console', m => { if (m.type() === 'error') problems.push(`sweep console: ${m.text()}`); });
  page.on('pageerror', e => problems.push(`sweep pageerror: ${e.message}`));

  await page.goto(BASE + '/');
  await page.fill('#gateAdminIdInput', OWNER_ID);
  await page.click('#loginBtn');
  await page.click('#consentAdmin');
  await page.waitForSelector('#app:not([hidden])');

  const skip = new Set(['logoutBtn', 'logoutBtn2', 'clearAll', 'panicBtn']);
  for (const route of ['dashboard', 'tasks', 'console']) {
    await page.click(`a[data-route="${route}"]`);
    await page.waitForTimeout(200);
    const view = `#view${route[0].toUpperCase()}${route.slice(1)}`;
    // DOM は操作のたびに再描画されるため、毎回インデックスで引き直す
    const count = await page.locator(`${view} button:visible`).count();
    for (let i = 0; i < count; i++) {
      const b = page.locator(`${view} button:visible`).nth(i);
      try {
        const id = await b.getAttribute('id', { timeout: 1500 });
        if (id && skip.has(id)) continue;
        await b.click({ timeout: 1500 });
      } catch (e) { /* 再描画で消えた・disabled などは無視 */ }
      await page.waitForTimeout(60);
    }
  }
  // 緊急停止と解除
  await page.click('#panicBtn');
  await page.waitForTimeout(300);
  await page.click('#releaseBtn');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'scratch/shot-sweep-end.png', fullPage: true });
  await ctx.close();

  await browser.close();
  if (problems.length) {
    console.log('PROBLEMS:\n' + problems.join('\n'));
    process.exit(1);
  }
  console.log('OK: 全ビュー描画・全ボタン走査でエラーなし');
})();
