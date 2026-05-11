@echo off
chcp 65001 >nul
title Wiki Sync - MRT Site

echo ========================================
echo   Wiki Sync - MRT Site
echo   D:\wiki\ → D:\mrt-site\src\content\
echo ========================================
echo.

cd /d D:\mrt-site

echo [1/3] Importing from wiki...
node scripts\import-wiki.mjs
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Import failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Building site...
npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo [3/3] Done!
echo.
echo Dev server: http://localhost:4321/
echo.
echo Tip: Run "npm run dev" to preview changes live.

echo.
echo ✅ Sync complete!
pause
