# Etapa de construcción
FROM node:18-alpine as build

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar archivos del proyecto
COPY . .

# Definir la variable de entorno para la API
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar archivos de build
COPY --from=build /app/build /usr/share/nginx/html

# Configuración básica de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 