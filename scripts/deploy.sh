#!/bin/sh

ssh -t ec2-user@3.209.113.207 <<EOF 

  cd ~/<YOUR_REPO_FOLDER>

  git pull origin main

  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash

  . ~/.nvm/nvm.sh

  nvm install --lts

  npm install

  npm install -g pm2

  pm2 kill

  npm start
  
  sudo yum install nginx -y

  sudo amazon-linux-extras install nginx1 -y

  sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.old

  sudo cp ./script/nginx.conf /etc/nginx/

  sudo nginx -t

  sudo chkconfig nginx on

  sudo systemctl restart nginx

  exit

EOF

