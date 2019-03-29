#FROM nginx:alpine
#
#COPY nginx.conf /etc/nginx/nginx.conf.tmpl
#COPY index.html /usr/share/nginx/html/index.html.tmpl
#COPY env_variables.sh /usr/share/nginx/
#COPY dist/ /usr/share/nginx/html/dist
#COPY js/ /usr/share/nginx/html/js
#COPY css/ /usr/share/nginx/html/css
#COPY imgs/ /usr/share/nginx/html/imgs
#COPY warp/	/usr/share/nginx/html/warp
#COPY assets/ /usr/share/nginx/html/assets
#RUN apk update && apk add bash
#ENTRYPOINT ["/bin/bash", "/usr/share/nginx/env_variables.sh"]
#EXPOSE 80


FROM node:alpine as node

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:prod


FROM nginx:alpine


#COPY --from=node /usr/src/app /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf.tmpl
COPY ./index.html /usr/share/nginx/html/index.html.tmpl
COPY ./env_variables.sh /usr/share/nginx/
COPY --from=node /usr/src/app/dist/ /usr/share/nginx/html/dist
COPY --from=node /usr/src/app/js/ /usr/share/nginx/html/js
COPY --from=node /usr/src/app/css/ /usr/share/nginx/html/css
COPY --from=node /usr/src/app/imgs/ /usr/share/nginx/html/imgs
COPY --from=node /usr/src/app/warp/	/usr/share/nginx/html/warp
COPY --from=node /usr/src/app/assets/ /usr/share/nginx/html/assets

RUN echo $(ls -1 /usr/share/nginx/html)
RUN apk update && apk add bash
ENTRYPOINT ["/bin/bash", "/usr/share/nginx/env_variables.sh"]
EXPOSE 80