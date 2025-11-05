# Argumento para especificar qué servicio construir (ej: auth-service o user-service)
ARG SERVICE_NAME

# ==================================
# ETAPA 1: BUILD (Compilación y dependencias)
# ==================================
FROM node:25-alpine AS build

ARG SERVICE_NAME

RUN npm install -g pnpm

WORKDIR /app

# Copiar archivos de configuración del workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copiar todos los archivos del monorepo (incluyendo src y carpetas apps/*)
COPY . .

# Instalar dependencias para todos los paquetes en el workspace
RUN pnpm install

# Navegar al servicio específico y compilar TypeScript
WORKDIR /app/apps/${SERVICE_NAME}
RUN pnpm run build 

# ==================================
# ETAPA 2: PRODUCTION (Imagen final ligera)
# ==================================
FROM node:25-alpine AS production

ARG SERVICE_NAME

RUN npm install -g pnpm

# Directorio de trabajo para la imagen final
WORKDIR /app

# Usar 'pnpm deploy' para copiar solo las dependencias de producción y el código compilado
# desde la etapa 'build' al directorio actual '/app' de la etapa 'production'.
COPY --from=build /app/${SERVICE_NAME}/package.json ./package.json
COPY --from=build /app/${SERVICE_NAME}/dist ./dist

# Instalar solo dependencias de producción para este paquete específico
RUN pnpm install --prod

# Exponer el puerto por defecto (puedes ajustarlo en docker-compose si es necesario)
EXPOSE 3000

# Comando para correr la aplicación compilada (verifica tu script "start" en package.json)
CMD ["pnpm", "start"]

