#!/bin/sh
set -e

# Substitui ${API_URL} pela variável de ambiente real
envsubst '${API_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Inicia NGINX
exec nginx -g 'daemon off;'
