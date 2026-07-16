@echo off
echo ================================================
echo  SparkWash - MySQL Root Password Reset
echo  Run this file as Administrator
echo ================================================

echo.
echo [1/5] Stopping MySQL57 service...
net stop MySQL57
if %errorlevel% neq 0 (
    echo ERROR: Could not stop MySQL57. Make sure you are running as Administrator.
    pause
    exit /b 1
)

echo [2/5] Creating password reset SQL file...
echo ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sparkwash123'; > "%TEMP%\reset_pw.sql"
echo FLUSH PRIVILEGES; >> "%TEMP%\reset_pw.sql"

echo [3/5] Starting mysqld with --skip-grant-tables...
start "" /B "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysqld.exe" --defaults-file="C:\ProgramData\MySQL\MySQL Server 5.7\my.ini" --skip-grant-tables --skip-networking=0 --port=3307

echo Waiting 5 seconds for mysqld to start...
timeout /t 5 /nobreak > nul

echo [4/5] Resetting root password to: sparkwash123
"C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe" -u root -h 127.0.0.1 -P 3307 --connect-expired-password -e "FLUSH PRIVILEGES; ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sparkwash123';"

echo [5/5] Stopping temporary mysqld and restarting MySQL57 service...
taskkill /F /IM mysqld.exe > nul 2>&1
timeout /t 2 /nobreak > nul
net start MySQL57

echo.
echo ================================================
echo  Done! MySQL root password is now: sparkwash123
echo  You can close this window.
echo ================================================
pause
