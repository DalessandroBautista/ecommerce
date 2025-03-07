FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

# Instalar herramientas adicionales
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends git

# Para instalar MongoDB Shell (versión específica que funciona)
RUN apt-get update && apt-get install -y wget \
    && wget https://downloads.mongodb.com/compass/mongodb-mongosh_1.8.0_amd64.deb \
    && dpkg -i mongodb-mongosh_1.8.0_amd64.deb \
    && rm mongodb-mongosh_1.8.0_amd64.deb

# Instalar NestJS CLI y Create Vite globalmente
RUN npm install -g @nestjs/cli create-vite
