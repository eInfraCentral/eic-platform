FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf.tmpl
COPY index.html /usr/share/nginx/html/index.html.tmpl
COPY env_variables.sh /usr/share/nginx/
COPY dist/ /usr/share/nginx/html/dist
COPY js/ /usr/share/nginx/html/js
COPY css/ /usr/share/nginx/html/css
COPY imgs/ /usr/share/nginx/html/imgs
COPY warp/	/usr/share/nginx/html/warp
COPY assets/ /usr/share/nginx/html/assets
RUN apk update && apk add bash
ENTRYPOINT ["/bin/bash", "/usr/share/nginx/env_variables.sh"]
EXPOSE 80