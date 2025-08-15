@echo off
echo Starting Spring Boot with MySQL Database and Hot Reload...
echo.
echo Backend changes will auto-restart the server
echo Frontend changes (HTML/CSS/JS) will auto-refresh the browser
echo Database: MySQL (localhost:3306/dummy2o)
echo.
echo Press Ctrl+C to stop the server
echo.
mvn spring-boot:run -Dspring-boot.run.profiles=dev -Dspring-boot.run.jvmArguments="-Dspring.devtools.restart.enabled=true"
