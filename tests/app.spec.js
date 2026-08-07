const { test, expect } = require('@playwright/test');

/** ソースに固定された唯一の許可 Discord ユーザーID */
const OWNER_ID = '1215266201589129259';
const OTHER_ID = '999999999999999999';
const AUTH_KEY = 'nevi.webcenter.auth.v1';

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

/** ログイン → 認可（デモモード）までを通してダッシュボードに入る */
async function signIn(page) {
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

  test('未認証ではゲートが表示され、許可IDはオーナー1件に固定されている', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Nevi Web Center/);
    await expect(page.locator('#gate')).toBeVisible();
    await expect(page.locator('#app')).toBeHidden();

    await expect(page.locator('#gateAllowNote')).toContainText(OWNER_ID);
    await expect(page.locator('.gate-note')).toContainText('セキュリティ境界ではありません');

    // 既定は Client ID 未設定＝デモモード
    await expect(page.locator('#gateMode')).toContainText('デモ');
    await expect(page.locator('#gateClientIdInput')).toHaveValue('');
  });

  test('未認証で保護ルートを直接開くと #/login へリダイレクトされる', async ({ page }) => {
    for (const route of ['#/dashboard', '#/tasks', '#/console']) {
      // ハッシュだけの遷移は同一ドキュメント扱いになるため、毎回読み込み直す
      await page.goto('about:blank');
      await page.goto('/' + route);
      await expect(page.locator('#gate')).toBeVisible();
      await expect(page.locator('#app')).toBeHidden();
      await expect(page).toHaveURL(/#\/login$/);
    }

    // 読み込み後のハッシュ変更（タブ操作相当）でもガードが効く
    await page.evaluate(() => { location.hash = '#/tasks'; });
    await expect(page).toHaveURL(/#\/login$/);
    await expect(page.locator('#app')).toBeHidden();
  });

  test('許可IDと異なるアカウントのセッションは復元されず拒否される', async ({ page }) => {
    await page.goto('/');

    // 別ユーザーのセッションを LocalStorage に偽装して置く
    await page.evaluate(([key, id]) => {
      localStorage.setItem(key, JSON.stringify({
        user: { id, username: 'intruder', global_name: '別のユーザー', avatar: null, demo: true },
        mode: 'demo',
        expires: Date.now() + 3600000
      }));
    }, [AUTH_KEY, OTHER_ID]);

    await page.goto('/#/dashboard');
    await page.reload();
    await expect(page.locator('#gate')).toBeVisible();
    await expect(page.locator('#app')).toBeHidden();
    // 破棄されているので保存も残らない
    expect(await page.evaluate(k => localStorage.getItem(k), AUTH_KEY)).toBeNull();
  });

  test('ログイン → ダッシュボード遷移と主要機能の操作', async ({ page }) => {
    await page.goto('/');
    await signIn(page);

    await expect(page.locator('#chipName')).toContainText('ご主人さま');
    await expect(page.locator('#chipId')).toContainText(OWNER_ID);
    await expect(page.locator('#viewDashboard')).toBeVisible();
    await expect(page.locator('#guardAllow')).toContainText(OWNER_ID);

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

    // コンソール / 設定ビュー: 許可IDは読み取り専用で固定値
    await page.click('a[data-route="console"]');
    await expect(page.locator('#viewConsole')).toBeVisible();
    await expect(page.locator('#setAllowIds')).toHaveValue(OWNER_ID);
    await expect(page.locator('#setAllowIds')).toHaveAttribute('readonly', '');
    await expect(page.locator('#authId')).toHaveText(OWNER_ID);

    // テーマ切替
    await page.click('#themeBtn');
    expect(await page.getAttribute('html', 'data-theme')).toBeTruthy();

    // ログアウトするとゲートに戻る
    await page.click('#logoutBtn');
    await expect(page.locator('#gate')).toBeVisible();
    await expect(page.locator('#app')).toBeHidden();
    await expect(page).toHaveURL(/#\/login$/);
  });

  test('Client ID をログイン前に保存すると実接続モードに切り替わる', async ({ page }) => {
    await page.goto('/');

    await page.click('#gateConfig > summary');
    await page.fill('#gateClientIdInput', '123456789012345678');
    await page.click('#gateSaveClientId');

    await expect(page.locator('#gateMsg')).toContainText('Client ID を保存しました');
    await expect(page.locator('#gateMode')).toContainText('実接続');

    // 不正な値は保存されない
    await page.click('#gateConfig > summary');
    await page.fill('#gateClientIdInput', 'not-a-number');
    await page.click('#gateSaveClientId');
    await expect(page.locator('#gateMsg')).toContainText('数字');
    await expect(page.locator('#gateMode')).toContainText('実接続');

    // 空にするとデモモードへ戻る（以降のテストへ影響させない）
    await page.fill('#gateClientIdInput', '');
    await page.click('#gateSaveClientId');
    await expect(page.locator('#gateMode')).toContainText('デモ');
  });

  test('実接続モードでは正しい認可URLへ遷移する（discord.com はスタブ）', async ({ page }) => {
    // discord.com への実通信は行わず、遷移先URLだけを検証する
    let authorizeUrl = null;
    await page.route('https://discord.com/**', route => {
      authorizeUrl = route.request().url();
      return route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>stub</title>' });
    });

    await page.goto('/');
    await page.evaluate(() => {
      const s = JSON.parse(localStorage.getItem('nevi.webcenter.v1') || '{}');
      s.settings = Object.assign({}, s.settings, { clientId: '123456789012345678' });
      localStorage.setItem('nevi.webcenter.v1', JSON.stringify(s));
    });
    await page.reload();

    await expect(page.locator('#gateMode')).toContainText('実接続');
    await page.click('#loginBtn');
    await page.waitForURL('https://discord.com/**');

    const u = new URL(authorizeUrl);
    expect(u.origin + u.pathname).toBe('https://discord.com/api/oauth2/authorize');
    expect(u.searchParams.get('client_id')).toBe('123456789012345678');
    expect(u.searchParams.get('response_type')).toBe('token');
    expect(u.searchParams.get('scope')).toBe('identify');
    expect(u.searchParams.get('redirect_uri')).toBe('http://localhost:8080/');
    expect(u.searchParams.get('state')).toMatch(/^[0-9a-f]{32}$/);

    // CSRF 用 state はブラウザを跨げるよう localStorage に保存されている
    const saved = await page.evaluate(() => localStorage.getItem('nevi.webcenter.oauth.state'));
    expect(JSON.parse(saved).nonce).toBe(u.searchParams.get('state'));
  });

  test('コールバック: 許可IDならログイン、別IDなら拒否される', async ({ page }) => {
    let profile = { id: OWNER_ID, username: 'nevi.master', global_name: 'ご主人さま', avatar: null };
    await page.route('https://discord.com/api/users/@me', route => route.fulfill({
      status: 200, contentType: 'application/json', body: JSON.stringify(profile)
    }));

    const arriveWithToken = async () => {
      await page.evaluate(() => {
        localStorage.setItem('nevi.webcenter.oauth.state', JSON.stringify({ nonce: 'testnonce', at: Date.now() }));
        localStorage.setItem('nevi.webcenter.oauth.next', '/dashboard');
      });
      await page.goto('about:blank');
      await page.goto('/#access_token=stub-token&token_type=Bearer&state=testnonce&expires_in=604800');
    };

    // 許可ID → ログイン成功。アクセストークンはURLから即座に取り除かれる
    await page.goto('/');
    await arriveWithToken();
    await expect(page.locator('#app')).toBeVisible();
    await expect(page.locator('#chipId')).toContainText(OWNER_ID);
    await expect(page.locator('#authMode')).toContainText('Implicit Grant');
    expect(page.url()).not.toContain('access_token');

    // 別ID → 拒否され、セッションも作られない
    profile = { id: OTHER_ID, username: 'intruder', global_name: '別のユーザー', avatar: null };
    await page.evaluate(k => localStorage.removeItem(k), AUTH_KEY);
    await arriveWithToken();
    await expect(page.locator('#gate')).toBeVisible();
    await expect(page.locator('#denyBox')).toBeVisible();
    await expect(page.locator('#denyId')).toContainText(OTHER_ID);
    await expect(page.locator('#app')).toBeHidden();
    expect(await page.evaluate(k => localStorage.getItem(k), AUTH_KEY)).toBeNull();
  });

  test('スマホ幅でもログインでき、横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const overflows = () => page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth
    );

    // ゲート表示中から横スクロールが無いこと
    expect(await overflows()).toBe(false);

    // Client ID 設定パネルを開いた状態でもはみ出さない
    await page.click('#gateConfig > summary');
    expect(await overflows()).toBe(false);
    await page.click('#gateConfig > summary');

    // ログインボタンはスマホでも十分なタップ領域がある
    const box = await page.locator('#loginBtn').boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(40);

    await signIn(page);

    for (const route of ['dashboard', 'tasks', 'console']) {
      await page.click(`a[data-route="${route}"]`);
      await expect(page.locator(`#view${route[0].toUpperCase()}${route.slice(1)}`)).toBeVisible();
      expect(await overflows()).toBe(false);
    }
  });

  test('セッションはリロード後も維持され、破棄すると再びゲートへ戻る', async ({ page }) => {
    await page.goto('/');
    await signIn(page);

    await page.reload();
    await expect(page.locator('#app')).toBeVisible();
    await expect(page.locator('#gate')).toBeHidden();

    // セッションが失われた状態で保護ビューを直接開くとゲートへ戻される
    await page.goto('/#/console');
    await page.evaluate(k => localStorage.removeItem(k), AUTH_KEY);
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
