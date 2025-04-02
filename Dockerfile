# Imagen oficial de Bun
FROM oven/bun:1.0.25

# Directorio de trabajo
WORKDIR /app

# Copiamos todos los archivos del proyecto
COPY . .

# Instalamos las dependencias (pg, etc.)
RUN bun install

# Exponemos puerto
EXPOSE 3000

# Al arrancar el contenedor, ejecutamos la aplicación
CMD ["bun", "src/index.ts"]
