# Manual MySQL Setup Guide

## Quick Setup (Copy & Paste Commands)

### Step 1: Connect to MySQL
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql" -u root -p
```
Enter your MySQL root password when prompted.

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
```cmd
run-dev.bat
```

## Alternative: Use the Fixed Setup Script
```cmd
setup-mysql-fixed.bat
```

## What These Commands Do

1. **CREATE USER** - Creates a user with password 'root'
2. **GRANT PRIVILEGES** - Gives the user full database access
3. **FLUSH PRIVILEGES** - Applies the permission changes
4. **CREATE DATABASE** - Creates the 'dummy2o' database
5. **SHOW DATABASES** - Verifies the database was created
6. **EXIT** - Closes MySQL connection

## Troubleshooting

### If you get "Access denied":
- Make sure you're using the correct root password
- Try connecting without password first: `"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql" -u root`

### If MySQL is not running:
- Open Services (services.msc)
- Find "MySQL" service and start it

### If you can't find MySQL:
- Check if MySQL is installed in a different location
- Common locations: `C:\xampp\mysql\bin\mysql` or `C:\wamp\bin\mysql\mysql8.0.xx\bin\mysql`
