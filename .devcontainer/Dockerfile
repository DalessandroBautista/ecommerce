FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

# Instalar herramientas adicionales
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends git

# Instalar NestJS CLI y Create Vite globalmente
RUN npm install -g @nestjs/cli create-vite
