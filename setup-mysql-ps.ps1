Write-Host "========================================" -ForegroundColor Green
Write-Host "MySQL Setup and Verification Script (PowerShell)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Checking if MySQL is running on port 3306..." -ForegroundColor Yellow
$portCheck = netstat -an | Select-String "3306"
if ($portCheck) {
    Write-Host "✓ MySQL is running on port 3306" -ForegroundColor Green
} else {
    Write-Host "✗ MySQL is not running on port 3306" -ForegroundColor Red
    Write-Host "Please start MySQL first:" -ForegroundColor Red
    Write-Host "1. Open Services (services.msc)" -ForegroundColor Red
    Write-Host "2. Find MySQL service and start it" -ForegroundColor Red
    Write-Host "3. Or run: 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld --console'" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Testing MySQL connection..." -ForegroundColor Yellow
Write-Host "Please enter your MySQL root password when prompted:" -ForegroundColor Yellow

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$testCommand = "& '$mysqlPath' -u root -p -e `"SELECT 'MySQL connection successful!' as status;`""

try {
    Invoke-Expression $testCommand
    Write-Host "✓ MySQL connection successful" -ForegroundColor Green
} catch {
    Write-Host "✗ MySQL connection failed" -ForegroundColor Red
    Write-Host "Please check your MySQL installation and credentials" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "Step 3: Setting up database and user..." -ForegroundColor Yellow
Write-Host "Please enter your MySQL root password again:" -ForegroundColor Yellow

$setupCommand = "& '$mysqlPath' -u root -p -e `"CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'root'; GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost'; FLUSH PRIVILEGES; CREATE DATABASE IF NOT EXISTS dummy2o;`""

try {
    Invoke-Expression $setupCommand
    Write-Host "✓ Database setup completed" -ForegroundColor Green
} catch {
    Write-Host "✗ Database setup failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 4: Verifying database setup..." -ForegroundColor Yellow

$verifyCommand = "& '$mysqlPath' -u root -p -e `"USE dummy2o; SHOW TABLES;`""

try {
    Invoke-Expression $verifyCommand
    Write-Host "✓ Database verification completed" -ForegroundColor Green
} catch {
    Write-Host "✗ Database verification failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "MySQL setup complete!" -ForegroundColor Green
Write-Host "You can now run: .\run-dev.bat" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Read-Host "Press Enter to continue"
