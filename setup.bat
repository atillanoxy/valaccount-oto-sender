@echo off
echo Node.js indirilip kuruluyor...
curl -o nodejs-setup.msi https://nodejs.org/dist/v14.17.6/node-v14.17.6-x64.msi
msiexec /i nodejs-setup.msi /qn

echo Modüller kuruluyor...
npm install axios@1.6.5 chalk@5.3.0 child_process@1.0.2 clear@0.1.0 colors@1.4.0 discord-selfbott-v11@11.5.2 discord.js-selfbot-v13@3.1.0 fs@0.0.1-security readline@1.3.0

echo Setup tamamlandı.
pause
