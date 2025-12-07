#!/bin/sh
set -e

# Define valor padrão para API_URL se não estiver definida
export API_URL="${API_URL:-http://localhost:8080}"

envsubst '${API_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
