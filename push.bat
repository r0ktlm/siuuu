@echo off
echo ====================================
echo       STARTING ONE-CLICK PUSH       
echo ====================================
echo.

echo [1/3] Adding all files...
git add .

echo [2/3] Committing changes...
git commit -m "Update site: %date% %time%"

echo [3/3] Pushing to GitHub...
git push

echo.
echo ====================================
echo            PUSH COMPLETE            
echo ====================================
echo.
pause
