# Bun API - Starter Project with Docker

Proyecto base de una API desarrollada con [Bun](https://bun.sh/), un runtime ultrarrápido para JavaScript y TypeScript. La API incluye dos endpoints simples (`GET` y `POST`) y está lista para correr en contenedores utilizando Docker y Docker Compose.

---

## 🚀 Endpoints disponibles

| Método | Ruta         | Descripción                                 |
| ------ | ------------ | ------------------------------------------- |
| GET    | `/api/hello` | Retorna un mensaje de bienvenida            |
| POST   | `/api/data`  | Recibe un JSON y lo retorna en la respuesta |

---

## ⚙️ Tecnologías usadas

- [Bun](https://bun.sh/) (Runtime y servidor)
- [TypeScript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

### Datos de un incidente

- `id`: Autogenerado.
- `reporter`: Obligatorio (string).
- `description`: Mínimo 10 caracteres.
- `status`: (pendiente, en proceso, resuelto). Se actualiza solo en `PUT`.
- `created_at`: Fecha de reporte.

---

## Requisitos

- **Docker** y **Docker Compose** instalados.
- No necesitas instalar **Bun** localmente; todo se ejecuta en contenedores.

---

## 📦 Estructura del proyecto

bun-api/  
├── index.ts # Código principal de la API  
├── bunfig.toml # Configuración de Bun  
├── tsconfig.json # Configuración de TypeScript  
├── Dockerfile # Imagen de Docker para Bun  
├── docker-compose.yml # Orquestación con Docker Compose  
└── .dockerignore # Archivos ignorados en la imagen

---

## ▶️ Cómo correr el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/lfmendoza/bun-api.git
cd bun-api
```

### 2. Iniciar el contenedor con Docker Compose

```bash
docker-compose up --build
```

- Se creará la tabla incidents (gracias a init.sql).
- La API quedará disponible en: [http://localhost:3000](http://localhost:3000)
- Swagger UI en la ruta principal: [http://localhost:3000/](http://localhost:3000/)
- El archivo swagger.yaml en [http://localhost:3000/swagger.yaml](http://localhost:3000/swagger.yaml)

## ✅ Cómo probar la API

### 1. Probar el endpoint GET

```bash
curl http://localhost:3000/incidents
```

#### Respuesta esperada:

```bash
curl -X PUT http://localhost:3000/incidents/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "en proceso"}'
```

### 2. Probar el endpoint POST

```bash
curl -X POST http://localhost:3000/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "reporter": "Juan Perez",
    "description": "La impresora no imprime y hace mucho ruido"
  }'

```

#### Respuesta esperada:

```bash
{
  "message": "Datos recibidos correctamente",
  "data": {
    "nombre": "Fernando",
    "edad": 100
  }
}

```

## ❓ Preguntas frecuentes

### ¿Necesito instalar Bun en mi máquina?

No. Bun se ejecuta dentro del contenedor de Docker, así que no necesitas instalar nada más allá de Docker y Docker Compose.

### ¿Puedo usar este proyecto como base?

¡Sí! Está pensado como plantilla inicial para proyectos más complejos. Puedes extenderlo fácilmente con rutas, middlewares, conexión a bases de datos y más.

---

## © Licencia

Este proyecto es de código abierto y puede ser usado con libertad.
