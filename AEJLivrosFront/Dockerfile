# Etapa 1: Build
FROM node:25-alpine AS build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci --silent

# Copiar todo o código
COPY . .

# Build da aplicação
RUN npm run build

# Etapa 2: Servir com Nginx
FROM nginx:alpine

# Remover configuração padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar build da etapa anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
