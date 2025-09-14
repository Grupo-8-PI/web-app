# Etapa 1: Build
FROM node:18 AS build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm install

# Copiar todo o código
COPY . .

# Build com Vite
RUN npm run build

# Etapa 2: Servir a aplicação
FROM node:18-slim

WORKDIR /app

# Instalar servidor estático serve
RUN npm install -g serve

# Copiar build da etapa anterior (Vite gera 'dist')
COPY --from=build /app/dist /app/dist

EXPOSE 3000

# Servir a aplicação
CMD ["serve", "-s", "dist", "-l", "3000"]
