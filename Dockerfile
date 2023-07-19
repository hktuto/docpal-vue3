FROM nikolaik/python-nodejs AS base

apt-get install libnss3 \
        libnspr4\   
        libatk1.0-0\              
        libatk-bridge2.0-0\       
        libcups2\                 
        libdrm2\                  
        libdbus-1-3\              
        libxkbcommon0\            
        libatspi2.0-0\            
        libxcomposite1\           
        libxdamage1\              
        libxfixes3\               
        libxrandr2\               
        libgbm1\                  
        libasound2 

RUN npm i -g pnpm



