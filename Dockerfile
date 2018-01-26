FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html /usr/share/nginx/html/
COPY dist/      /usr/share/nginx/html/dist
COPY js/        /usr/share/nginx/html/js
COPY css/        /usr/share/nginx/html/css
COPY imgs/        /usr/share/nginx/html/imgs
COPY warp/	/usr/share/nginx/html/warp
COPY assets/	/usr/share/nginx/html/assets
COPY UnderMaintenance/	/usr/share/nginx/html/UnderMaintenance
EXPOSE 80
