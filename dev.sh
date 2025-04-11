#!/bin/bash

# Asegurar que db esté lista antes de iniciar
docker-compose up db -d

# Esperar a que la db esté lista (healthcheck)
echo "Esperando a que la base de datos esté lista..."
until docker exec incidents_db pg_isready -U postgres
do
  echo "."
  sleep 1
done
echo "Base de datos lista!"

# Iniciar los contenedores de desarrollo
docker-compose --profile dev up