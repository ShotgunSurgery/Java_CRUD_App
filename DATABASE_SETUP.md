# Database Setup Guide

## MySQL Database Setup

### Prerequisites
1. Install MySQL Server (version 8.0 or higher)
2. Make sure MySQL is running on port 3306

### Database Configuration

#### Option 1: Using Default Settings
The application is configured to:
- Connect to `localhost:3306`
- Use database name: `dummy2o`
- Username: `root`
- Password: `root`
- Automatically create database if it doesn't exist

#### Option 2: Custom Configuration
If you need to change the database settings, edit `src/main/resources/application-dev.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Running the Application

#### With MySQL (Default)
```bash
# Windows
run-dev.bat

# Linux/Mac
./run-dev.sh

# Or manually
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

#### With H2 (For Testing)
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

### Database Tables
The application will automatically create these tables:
- `auth_model` - User authentication data
- `product` - Product definitions
- `product_parameter` - Product parameters
- `product_value` - Product parameter values

### Troubleshooting

#### Connection Issues
1. Make sure MySQL is running: `sudo systemctl status mysql`
2. Check if port 3306 is available: `netstat -an | grep 3306`
3. Verify credentials in `application-dev.properties`

#### Permission Issues
If you get access denied errors:
```sql
-- Connect to MySQL as root and run:
CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

#### Database Creation
If the database doesn't exist:
```sql
CREATE DATABASE dummy2o;
```

### Switching Between Databases

#### To use H2 (in-memory database):
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

#### To use MySQL:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Environment Variables (Optional)
You can also use environment variables to override database settings:

```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/my_database
export SPRING_DATASOURCE_USERNAME=my_user
export SPRING_DATASOURCE_PASSWORD=my_password
```
