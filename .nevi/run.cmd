@echo off
chcp 65001 >nul
cd /d "C:\Nevi-ai\projects\nevi-web-center"
if exist ".nevi\DONE" del ".nevi\DONE"
call "C:\Users\umuta\AppData\Roaming\npm\claude.CMD" --model opus --permission-mode bypassPermissions -p "Read .nevi/BUILD_PROMPT.md and implement the static website described there. Put index.html at the project root. Perform automated browser/UI testing (e.g. via Playwright/Puppeteer/headless browser or local dev server verification) to ensure no console errors and clean rendering before completing. Do not ask for approval; just build and test it."
>".nevi\DONE" echo %ERRORLEVEL%
echo.
echo [Nevi] finished. Auto-closing in 10 seconds (press any key to close now)...
timeout /t 10 >nul 2>&1
