# MySQL Setup for PowerShell

## Quick Commands (Copy & Paste)

### Step 1: Connect to MySQL
```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```

### Step 2: Run These SQL Commands (One by One)
```sql
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'root';
```
```sql
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
```
```sql
FLUSH PRIVILEGES;
```
```sql
CREATE DATABASE IF NOT EXISTS dummy2o;
```
```sql
SHOW DATABASES;
```
```sql
EXIT;
```

### Step 3: Run Your Application
```powershell
.\run-dev.bat
```

## Alternative: Use PowerShell Script
```powershell
.\setup-mysql-ps.ps1
```

## What's Different in PowerShell?

1. **Use `&` operator** to execute commands with spaces in path
2. **Use `.exe` extension** explicitly
3. **Use backticks `` ` `` for escaping quotes**

## Troubleshooting

### If you get "Execution Policy" error:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### If MySQL path is different:
```powershell
# Check if MySQL is in a different location
Get-ChildItem "C:\Program Files\MySQL" -Recurse -Name "mysql.exe"
```

### Alternative connection methods:
```powershell
# Method 1: Using Start-Process
Start-Process -FilePath "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -ArgumentList "-u", "root", "-p"

# Method 2: Using cmd
cmd /c "`"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`" -u root -p"
```
