@echo off
echo ========================================
echo MySQL Setup and Verification Script
echo ========================================
echo.

echo Step 1: Checking if MySQL is running on port 3306...
netstat -an | findstr 3306
if %errorlevel% equ 0 (
    echo ✓ MySQL is running on port 3306
) else (
    echo ✗ MySQL is not running on port 3306
    echo Please start MySQL first:
    echo 1. Open Services (services.msc)
    echo 2. Find MySQL service and start it
    echo 3. Or run: "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld --console"
    pause
    exit /b 1
)

echo.
echo Step 2: Testing MySQL connection...
echo Please enter your MySQL root password when prompted:
mysql -u root -p -e "SELECT 'MySQL connection successful!' as status;"
if %errorlevel% equ 0 (
    echo ✓ MySQL connection successful
) else (
    echo ✗ MySQL connection failed
    echo Please check your MySQL installation and credentials
    pause
    exit /b 1
)

echo.
echo Step 3: Setting up database and user...
echo Please enter your MySQL root password again:
mysql -u root -p -e "CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'root'; GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost'; FLUSH PRIVILEGES; CREATE DATABASE IF NOT EXISTS dummy2o;"

echo.
echo Step 4: Verifying database setup...
mysql -u root -p -e "USE dummy2o; SHOW TABLES;"

echo.
echo ========================================
echo MySQL setup complete!
echo You can now run: run-dev.bat
echo ========================================
pause

