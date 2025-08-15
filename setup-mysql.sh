#!/bin/bash

echo "========================================"
echo "MySQL Setup and Verification Script"
echo "========================================"
echo

echo "Step 1: Checking if MySQL is running on port 3306..."
if netstat -an | grep -q ":3306.*LISTEN"; then
    echo "✓ MySQL is running on port 3306"
else
    echo "✗ MySQL is not running on port 3306"
    echo "Please start MySQL first:"
    echo "sudo systemctl start mysql"
    echo "or"
    echo "sudo service mysql start"
    exit 1
fi

echo
echo "Step 2: Testing MySQL connection..."
if mysql -u root -p -e "SELECT 'MySQL connection successful!' as status;" 2>/dev/null; then
    echo "✓ MySQL connection successful"
else
    echo "✗ MySQL connection failed"
    echo "Please check your MySQL installation and credentials"
    exit 1
fi

echo
echo "Step 3: Setting up database and user..."
mysql -u root -p -e "
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
CREATE DATABASE IF NOT EXISTS dummy2o;
"

echo
echo "Step 4: Verifying database setup..."
mysql -u root -p -e "USE dummy2o; SHOW TABLES;"

echo
echo "========================================"
echo "MySQL setup complete!"
echo "You can now run: ./run-dev.sh"
echo "========================================"

