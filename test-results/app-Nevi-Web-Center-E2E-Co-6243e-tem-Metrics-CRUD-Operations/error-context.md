# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.js >> Nevi Web Center E2E & Console Verification >> Admin OAuth Login, Dashboard UI, System Metrics & CRUD Operations
- Location: tests\app.spec.js:42:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#apiSubmit')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e9]:
        - heading "Nevi Web Center" [level=1] [ref=e10]
        - text: NEVI OPS DASHBOARD
      - generic [ref=e11]:
        - generic [ref=e12]: ローカル監視中
        - generic [ref=e14]: 2026-08-07 18:02:09
        - generic [ref=e15]:
          - img "ご主人さま のDiscordアイコン" [ref=e16]
          - generic [ref=e17]:
            - generic [ref=e18]: ご主人さま
            - generic [ref=e19]: "ID: 108927491234567890"
        - 'button "テーマ: 自動" [ref=e20] [cursor=pointer]'
        - button "緊急停止" [ref=e21] [cursor=pointer]
        - button "ログアウト" [ref=e22] [cursor=pointer]
      - navigation "メインナビゲーション" [ref=e23]:
        - link "ダッシュボード" [ref=e24] [cursor=pointer]:
          - /url: "#/dashboard"
        - link "タスクと予定" [ref=e30] [cursor=pointer]:
          - /url: "#/tasks"
        - link "コンソールと権限" [active] [ref=e34] [cursor=pointer]:
          - /url: "#/console"
  - generic [ref=e38]:
    - main [ref=e39]:
      - region [ref=e41]:
        - generic [ref=e42]:
          - heading "REST API / Webhook 送信クライアント" [level=2] [ref=e43]
          - generic [ref=e46]: 未送信
        - paragraph [ref=e48]: 指定のエンドポイント URL へ HTTP / Webhook リクエストをリアルタイムで直接送信・検証します。
        - generic [ref=e49]:
          - generic [ref=e50]:
            - generic [ref=e51]:
              - generic [ref=e52]: メソッド
              - combobox "メソッド" [ref=e53]:
                - option "POST" [selected]
                - option "GET"
                - option "PUT"
                - option "DELETE"
            - generic [ref=e54]:
              - generic [ref=e55]: 送信形式
              - combobox "送信形式" [ref=e56]:
                - option "REST API" [selected]
                - option "Webhook"
          - generic [ref=e57]:
            - generic [ref=e58]: エンドポイント / Webhook URL
            - generic [ref=e59]:
              - textbox "エンドポイント / Webhook URL" [ref=e60]: http://127.0.0.1:8787/nevi/command
              - button "表示" [ref=e61] [cursor=pointer]
            - generic [ref=e62]: 既定でマスク表示です。「表示」で一時的に平文化します。
          - generic [ref=e63]:
            - generic [ref=e64]: APIトークン / 署名用シークレット
            - generic [ref=e65]:
              - textbox "APIトークン / 署名用シークレット" [ref=e66]:
                - /placeholder: 未設定（要差し替え）
              - button "表示" [ref=e67] [cursor=pointer]
          - generic [ref=e68]:
            - generic [ref=e69]: リクエストボディ（JSON）
            - textbox "リクエストボディ（JSON）" [ref=e70]: "{ \"command\": \"/task\", \"action\": \"run\", \"target\": \"vault-backup\", \"source\": \"nevi-web-center\" }"
          - generic [ref=e71]:
            - button "送信テスト" [ref=e72] [cursor=pointer]
            - button "JSONを整形" [ref=e73] [cursor=pointer]
            - button "curl形式で出力" [ref=e74] [cursor=pointer]
        - heading "レスポンス" [level=3] [ref=e75]
        - generic [ref=e76]: まだ送信していません。
      - generic [ref=e77]:
        - region [ref=e78]:
          - generic [ref=e79]:
            - heading "アクセス制御（Discord OAuth2）" [level=2] [ref=e80]
            - generic [ref=e84]: 認証済み（管理者）
          - generic [ref=e86]:
            - img "ご主人さま のDiscordアイコン" [ref=e87]
            - generic [ref=e88]:
              - generic [ref=e89]: ご主人さま
              - generic [ref=e90]: "@nevi.master"
          - generic [ref=e91]:
            - term [ref=e92]: Discord ID
            - definition [ref=e93]: "108927491234567890"
            - term [ref=e94]: 認証モード
            - definition [ref=e95]: デモモード（外部通信なし）
            - term [ref=e96]: スコープ
            - definition [ref=e97]: identify
            - term [ref=e98]: セッション期限
            - definition [ref=e99]: 2026/8/7 19:01:40（残り 59分）
          - generic [ref=e100]:
            - generic [ref=e101]: Discord アプリケーションの Client ID
            - generic [ref=e102]:
              - textbox "Discord アプリケーションの Client ID" [ref=e103]:
                - /placeholder: 未設定（デモモードで動作中）
              - button "表示" [ref=e104] [cursor=pointer]
            - generic [ref=e105]:
              - text: 設定すると discord.com の認可画面（Implicit Grant /
              - code [ref=e106]: response_type=token
              - text: ）へ実際に遷移します。静的サイトのためクライアントシークレットは使いません。
          - generic [ref=e107]:
            - generic [ref=e108]: リダイレクトURI（Discord Developer Portal に登録する値）
            - textbox "リダイレクトURI（Discord Developer Portal に登録する値）" [ref=e109]: http://localhost:8080/
          - generic [ref=e110]:
            - generic [ref=e111]: 許可する Discord ユーザーID（ホワイトリスト / 改行・カンマ区切り）
            - textbox "許可する Discord ユーザーID（ホワイトリスト / 改行・カンマ区切り）" [ref=e112]:
              - /placeholder: "000000000000000000"
            - generic [ref=e113]: "ここに無いIDでログインした場合は、ユーザー情報の取得直後にセッションを破棄してアクセスを拒否します（要差し替え: ご主人さまの実IDを設定）。"
          - generic [ref=e114]:
            - button "認証設定を保存" [ref=e115] [cursor=pointer]
            - button "このセッションを破棄" [ref=e116] [cursor=pointer]
        - region [ref=e117]:
          - heading "設定とローカルセキュリティ" [level=2] [ref=e119]
          - paragraph [ref=e123]: 入力値はこのブラウザの LocalStorage にのみ保存されます。共用PCでは作業後に「保存データを全消去」を実行してください（認証セッションも同時に破棄されます）。
          - generic [ref=e124]:
            - generic [ref=e125]: リソース更新間隔（ミリ秒）
            - spinbutton "リソース更新間隔（ミリ秒）" [ref=e126]: "2000"
          - generic [ref=e127]:
            - button "設定を保存" [ref=e128] [cursor=pointer]
            - button "設定をJSON表示" [ref=e129] [cursor=pointer]
            - button "保存データを全消去" [ref=e130] [cursor=pointer]
    - region [ref=e131]:
      - generic [ref=e132]:
        - heading "統合イベントログ" [level=2] [ref=e133]
        - generic [ref=e137]:
          - generic [ref=e138]: ログレベルの絞り込み
          - combobox "ログレベルの絞り込み" [ref=e139]:
            - option "すべて" [selected]
            - option "INFO"
            - option "OK"
            - option "WARN"
            - option "ERROR"
          - 'button "自動追尾: ON" [pressed] [ref=e140] [cursor=pointer]'
          - button "コピー" [ref=e141] [cursor=pointer]
          - button "クリア" [ref=e142] [cursor=pointer]
      - log "イベントログ" [ref=e143]:
        - generic [ref=e144]:
          - generic [ref=e145]: 18:01:40
          - generic [ref=e146]: INFO
          - generic [ref=e147]: Nevi Web Center を起動しました。Discord OAuth2 の許可リスト認証でアクセスを制限しています。
        - generic [ref=e148]:
          - generic [ref=e149]: 18:01:40
          - generic [ref=e150]: INFO
          - generic [ref=e151]: "監視対象: PCリソース / /task 自動化 / Googleカレンダー / MCP接続 / /spec 応答。"
        - generic [ref=e152]:
          - generic [ref=e153]: 18:01:40
          - generic [ref=e154]: WARN
          - generic [ref=e155]: MCPサーバ obsidian は切断状態です。接続が必要な場合はトグルをONにしてください。
        - generic [ref=e156]:
          - generic [ref=e157]: 18:01:40
          - generic [ref=e158]: INFO
          - generic [ref=e159]: "起動時の自動実行: /spec 応答ヘルスチェック (/task run spec-watch)"
        - generic [ref=e160]:
          - generic [ref=e161]: 18:01:40
          - generic [ref=e162]: WARN
          - generic [ref=e163]: 未認証のため /dashboard へのアクセスを拒否し、ログイン画面へリダイレクトしました。
        - generic [ref=e164]:
          - generic [ref=e165]: 18:01:40
          - generic [ref=e166]: INFO
          - generic [ref=e167]: "管理者 Discord ID を設定しました: 108927491234567890"
        - generic [ref=e168]:
          - generic [ref=e169]: 18:01:40
          - generic [ref=e170]: INFO
          - generic [ref=e171]: Discord の認可画面を開きました（デモモード / scope=identify）。
        - generic [ref=e172]:
          - generic [ref=e173]: 18:01:40
          - generic [ref=e174]: OK
          - generic [ref=e175]: "Discord OAuth2 認証に成功しました: ご主人さま（ID: 108927491234567890 / デモモード（外部通信なし））"
        - generic [ref=e176]:
          - generic [ref=e177]: 18:01:41
          - generic [ref=e178]: INFO
          - generic [ref=e179]: "手動実行: Obsidian Vault 自動バックアップ (/task run vault-backup)"
        - generic [ref=e180]:
          - generic [ref=e181]: 18:01:42
          - generic [ref=e182]: OK
          - generic [ref=e183]: "カレンダー予定を追加しました: 2026-08-07 10:00 E2E 自動テストによる予定追加"
        - generic [ref=e184]:
          - generic [ref=e185]: 18:01:42
          - generic [ref=e186]: WARN
          - generic [ref=e187]: "カレンダー予定を削除しました: /spec コマンド改修の振り返り"
        - generic [ref=e188]:
          - generic [ref=e189]: 18:01:43
          - generic [ref=e190]: OK
          - generic [ref=e191]: /spec 応答ヘルスチェック が完了しました。
        - generic [ref=e192]:
          - generic [ref=e193]: 18:01:44
          - generic [ref=e194]: OK
          - generic [ref=e195]: Obsidian Vault 自動バックアップ が完了しました。
    - contentinfo [ref=e196]:
      - generic [ref=e197]: Nevi Web Center — 単一HTML完結（外部CDN・Webフォント不使用）
      - generic [ref=e198]: "認証: Discord OAuth2 / identify + 許可ID制"
      - generic [ref=e199]: 表示データはすべてローカル生成のデモ値です（要差し替え）
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | test.describe('Nevi Web Center E2E & Console Verification', () => {
  4   |   let jsExceptions = [];
  5   | 
  6   |   test.beforeEach(({ page }) => {
  7   |     jsExceptions = [];
  8   |     page.on('console', msg => {
  9   |       // ネットワーク接続拒否(オプショナルローカルバックエンド試行)以外のJSエラーを記録
  10  |       if (msg.type() === 'error' && !msg.text().includes('ERR_CONNECTION_REFUSED') && !msg.text().includes('Failed to load resource')) {
  11  |         jsExceptions.push(`[Console Error] ${msg.text()}`);
  12  |       }
  13  |     });
  14  |     page.on('pageerror', err => {
  15  |       jsExceptions.push(`[JS Exception] ${err.message}`);
  16  |     });
  17  |   });
  18  | 
  19  |   test('Title and Login Security Gate verification', async ({ page }) => {
  20  |     await page.goto('http://localhost:8080/');
  21  | 
  22  |     // Title check
  23  |     await expect(page).toHaveTitle(/Nevi Web Center/);
  24  | 
  25  |     // Gate should be visible initially (unauthenticated)
  26  |     const gate = page.locator('#gate');
  27  |     await expect(gate).toBeVisible();
  28  | 
  29  |     // Clicking login without ID shows error
  30  |     await page.click('#loginBtn');
  31  |     await expect(page.locator('#gateMsg')).toContainText('許可リストが空です');
  32  | 
  33  |     // Inputting valid ID and clicking login opens consent panel
  34  |     await page.fill('#gateAdminIdInput', '108927491234567890');
  35  |     await page.click('#loginBtn');
  36  |     await expect(page.locator('#panelConsent')).toBeVisible();
  37  | 
  38  |     // Verify zero JS exceptions
  39  |     expect(jsExceptions).toEqual([]);
  40  |   });
  41  | 
  42  |   test('Admin OAuth Login, Dashboard UI, System Metrics & CRUD Operations', async ({ page }) => {
  43  |     await page.goto('http://localhost:8080/');
  44  | 
  45  |     // Perform Admin Login with ID input
  46  |     await page.fill('#gateAdminIdInput', '108927491234567890');
  47  |     await page.click('#loginBtn');
  48  |     await page.click('#consentAdmin');
  49  | 
  50  |     // Dashboard should become visible
  51  |     const app = page.locator('#app');
  52  |     await expect(app).toBeVisible();
  53  | 
  54  |     // Check Identity Chip in header
  55  |     const chipName = page.locator('#chipName');
  56  |     await expect(chipName).toContainText('ご主人さま');
  57  | 
  58  |     // Verify PC Resource Gauges are rendered
  59  |     const valCpu = page.locator('#val-cpu');
  60  |     const valMem = page.locator('#val-mem');
  61  |     const valDisk = page.locator('#val-disk');
  62  | 
  63  |     await expect(valCpu).not.toHaveText('--');
  64  |     await expect(valMem).not.toHaveText('--');
  65  |     await expect(valDisk).not.toHaveText('--');
  66  | 
  67  |     // Navigate to Tasks and Calendar tab
  68  |     await page.click('a[data-route="tasks"]');
  69  |     await expect(page.locator('#viewTasks')).toBeVisible();
  70  | 
  71  |     // Test Task Execution
  72  |     const runBtn = page.locator('button[data-act="run"][data-id="vault-backup"]');
  73  |     await runBtn.click();
  74  |     await page.waitForTimeout(1000);
  75  | 
  76  |     // Check Task History updated
  77  |     const historyList = page.locator('#historyList');
  78  |     await expect(historyList).toContainText('Obsidian Vault');
  79  | 
  80  |     // Test Calendar Event Addition
  81  |     await page.click('#calAddToggle');
  82  |     await page.fill('#calTitleInput', 'E2E 自動テストによる予定追加');
  83  |     await page.fill('#calWhere', '自動テスト環境');
  84  |     await page.click('#calSubmit');
  85  | 
  86  |     const calList = page.locator('#calList');
  87  |     await expect(calList).toContainText('E2E 自動テストによる予定追加');
  88  | 
  89  |     // Test Calendar Event Deletion
  90  |     const delBtn = page.locator('button[data-cal-del]').last();
  91  |     await delBtn.click();
  92  | 
  93  |     // Navigate to Console / REST API client view
  94  |     await page.click('a[data-route="console"]');
  95  |     await expect(page.locator('#viewConsole')).toBeVisible();
  96  | 
  97  |     // Test REST API client form submission
> 98  |     await page.click('#apiSubmit');
      |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  99  |     await page.waitForTimeout(500);
  100 | 
  101 |     // Verify Theme Switching
  102 |     const themeBtn = page.locator('#themeBtn');
  103 |     await themeBtn.click();
  104 |     const htmlTheme = await page.getAttribute('html', 'data-theme');
  105 |     expect(htmlTheme).toBeTruthy();
  106 | 
  107 |     // Verify zero JS exceptions
  108 |     expect(jsExceptions).toEqual([]);
  109 |   });
  110 | 
  111 |   test('Mobile Responsive Viewport Verification (No Horizontal Scroll)', async ({ page }) => {
  112 |     await page.setViewportSize({ width: 375, height: 812 });
  113 |     await page.goto('http://localhost:8080/');
  114 | 
  115 |     // Log in
  116 |     await page.fill('#gateAdminIdInput', '108927491234567890');
  117 |     await page.click('#loginBtn');
  118 |     await page.click('#consentAdmin');
  119 | 
  120 |     // Verify no horizontal overflow on Dashboard view
  121 |     let hasHorizontalOverflow = await page.evaluate(() => {
  122 |       return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  123 |     });
  124 |     expect(hasHorizontalOverflow).toBe(false);
  125 | 
  126 |     // Check Tasks view responsive overflow
  127 |     await page.click('a[data-route="tasks"]');
  128 |     hasHorizontalOverflow = await page.evaluate(() => {
  129 |       return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  130 |     });
  131 |     expect(hasHorizontalOverflow).toBe(false);
  132 | 
  133 |     // Check Console view responsive overflow
  134 |     await page.click('a[data-route="console"]');
  135 |     hasHorizontalOverflow = await page.evaluate(() => {
  136 |       return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  137 |     });
  138 |     expect(hasHorizontalOverflow).toBe(false);
  139 | 
  140 |     expect(jsExceptions).toEqual([]);
  141 |   });
  142 | });
  143 | 
  144 | 
```