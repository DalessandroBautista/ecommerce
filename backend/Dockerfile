FROM node:18-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar archivos del proyecto
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 3333

# Comando para ejecutar la aplicación
CMD ["npm", "run", "start:prod"] 