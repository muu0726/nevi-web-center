const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

// Simple static server
const PORT = 8080;
const HTML_PATH = path.join(__dirname, '..', 'index.html');

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url.startsWith('/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(HTML_PATH, 'utf8'));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

async function runTests() {
  server.listen(PORT);
  console.log(`Server running at http://localhost:${PORT}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const consoleLogs = [];
  const consoleErrors = [];

  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  try {
    console.log('--- Navigating to page ---');
    await page.goto(`http://localhost:${PORT}/index.html`);
    await page.waitForLoadState('domcontentloaded');

    // 1. Check title
    const title = await page.title();
    console.log('Page Title:', title);

    // 2. Take screenshot of login gate
    await page.screenshot({ path: path.join(__dirname, 'login_gate.png'), fullPage: true });
    console.log('Saved screenshot: login_gate.png');

    // 3. Click Login button to bring up consent panel
    console.log('--- Testing Login Flow ---');
    await page.click('#loginBtn');
    await page.waitForTimeout(500);

    // 4. Click Consent Admin button
    await page.click('#consentAdmin');
    await page.waitForTimeout(1000);

    // 5. Verify App is visible
    const appVisible = await page.isVisible('#app');
    console.log('App visible after login:', appVisible);

    // 6. Screenshot dashboard
    await page.screenshot({ path: path.join(__dirname, 'dashboard.png'), fullPage: true });
    console.log('Saved screenshot: dashboard.png');

    // 7. Test Responsive View (Mobile 375x812)
    console.log('--- Testing Mobile Responsive Layout ---');
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);

    const hasHScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    console.log('Mobile horizontal scrollbar detected:', hasHScroll);

    await page.screenshot({ path: path.join(__dirname, 'mobile_dashboard.png'), fullPage: true });
    console.log('Saved screenshot: mobile_dashboard.png');

    // 8. Test Task Execution
    console.log('--- Testing Task Execution ---');
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.click('[data-act="run"][data-id="vault-backup"]');
    await page.waitForTimeout(1500);

    // 9. Test Calendar Event Creation
    console.log('--- Testing Calendar Creation ---');
    await page.click('#calAddToggle');
    await page.waitForSelector('#calTitleInput', { state: 'visible' });
    await page.fill('#calTitleInput', 'Playwright 自動テスト予定');
    await page.fill('#calWhere', 'ローカル自動テスト環境');
    await page.click('#calSubmit');
    await page.waitForTimeout(500);

    const calContent = await page.textContent('#calList');
    console.log('Calendar includes new event:', calContent.includes('Playwright 自動テスト予定'));

    // 10. Check Console Errors
    console.log('--- Console Error Check ---');
    console.log('Total Console Errors:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.error('Console Errors:', consoleErrors);
    } else {
      console.log('SUCCESS: Zero console errors recorded!');
    }

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
    server.close();
  }
}

runTests();
