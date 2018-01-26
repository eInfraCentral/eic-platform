#!/usr/bin/env bash

sites=./`basename "$0"`
root=/etc/nginx/
www=/usr/share/nginx/html
avail=${root}sites-available/
enab=${root}sites-enabled/

inst() {
    ${sites} clean
    sudo cp nginx.${1} ${avail}nginx.${1}
    sudo nano ${avail}nginx.${1}
    sudo ln -s ${avail}nginx.${1} ${enab}nginx.${1}
    ${sites} restart
}

case $1 in
    proxy)
        inst $1
    ;;
    maintenance)
        inst $1
        back=${www}.$(date +%s)
        sudo mkdir ${back}
        sudo mv ${www} ${back}
        sudo mkdir -p ${www}
        sudo cp -R ../UnderMaintenance ${www}
    ;;
    clean)
        sudo rm ${enab}*
    ;;
    install)
        sudo apt install nginx
    ;;
    restart)
        sudo service nginx restart
    ;;
esac
