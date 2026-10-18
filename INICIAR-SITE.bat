@echo off
setlocal
cd /d "%~dp0"
curl.exe -s --max-time 2 http://127.0.0.1:3081/imersao | findstr /c:"Holding Total" >nul
if not errorlevel 1 (
  start "" http://127.0.0.1:3081/imersao
  exit /b 0
)
if not exist node_modules (
  call npm install
  if errorlevel 1 exit /b 1
)
if not exist .next\BUILD_ID (
  call npm run build
  if errorlevel 1 exit /b 1
)
start "" http://127.0.0.1:3081/imersao
call npm start
