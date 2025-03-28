# Usa la imagen oficial de Bun
FROM oven/bun:1.0.25

# Crea el directorio de trabajo
WORKDIR /app

# Copia los archivos del proyecto
COPY . .

# Exponer puerto de la API
EXPOSE 3000

# Comando para ejecutar la app
CMD ["bun", "index.ts"]
