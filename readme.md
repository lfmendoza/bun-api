# Sistema Integrado de Gestión de Incidentes

Una plataforma completa para gestionar incidentes técnicos, con una API en Bun y un cliente moderno en vanilla JavaScript utilizando Web Components, optimizada para rendimiento y usabilidad.

## 🚀 Características

### Frontend (Cliente)

- Arquitectura basada en Web Components sin dependencias externas
- Patrón de arquitectura limpia y diseño atómico
- Uso de Web Workers para operaciones asíncronas sin bloquear el hilo principal
- Renderizado por lotes para optimizar rendimiento con grandes listas
- Sistema de enrutamiento SPA cliente
- Gestión de estado centralizada con patrón similar a Redux
- Caching inteligente de peticiones a la API
- Soporte para tema claro/oscuro
- Diseño responsive y accesible

### Backend (API)

- Desarrollada con [Bun](https://bun.sh/), un runtime ultrarrápido para JavaScript y TypeScript
- Endpoints RESTful para gestionar incidentes
- Conexión a PostgreSQL para persistencia de datos
- Documentación con Swagger UI
- Alta performance con bajo consumo de recursos

## ⚙️ Tecnologías Utilizadas

### Frontend

- Vanilla JavaScript (ES6+)
- Web Components nativos
- Web Workers
- ShadowDOM para encapsulación
- Custom Events para comunicación entre componentes
- CSS personalizado con variables

### Backend

- [Bun](https://bun.sh/) (Runtime y servidor)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- Swagger para documentación de API

### Infraestructura

- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)
- [Nginx](https://nginx.org/) para servir el frontend

## 📋 Estructura de Datos

### Datos de un incidente

- `id`: Autogenerado (integer)
- `reporter`: Nombre del reportador (string, obligatorio)
- `description`: Descripción del incidente (mínimo 10 caracteres)
- `status`: Estado del incidente (`pendiente`, `en proceso`, `resuelto`)
- `created_at`: Fecha y hora de creación

## 📦 Estructura del Proyecto

```
incidents-platform/
├── api/                   # API en Bun
├── client/                # Cliente en Vanilla JavaScript
├── db_init/               # Scripts de inicialización de BD
├── docker-compose.yml     # Orquestación con Docker Compose
└── README.md              # Este archivo
```

## 🛠️ Requisitos

- **Docker** y **Docker Compose** instalados
- No necesitas instalar nada más localmente; todo se ejecuta en contenedores

## ▶️ Cómo Ejecutar el Proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/lfmendoza/bun-api
cd bun-api
```

### 2. Iniciar los contenedores con Docker Compose

```bash
docker-compose up --build
```

### 3. Acceder a la aplicación

- Cliente (Frontend): http://localhost:8080
- API (Backend): http://localhost:3000
- Swagger UI: http://localhost:3000/
- Swagger YAML: http://localhost:3000/swagger.yaml

---

## 📚 Documentación de API

### Endpoints Disponibles

| Método | Ruta           | Descripción                    |
| ------ | -------------- | ------------------------------ |
| GET    | /incidents     | Obtener todos los incidentes   |
| GET    | /incidents/:id | Obtener incidente por ID       |
| POST   | /incidents     | Crear un nuevo incidente       |
| PUT    | /incidents/:id | Actualizar estado de incidente |
| DELETE | /incidents/:id | Eliminar un incidente          |

### Detalles de los Endpoints

#### GET /incidents

- **Descripción**: Obtiene la lista completa de incidentes
- **Respuesta**: Array de objetos incidente
- **Código**: `200 OK`

#### GET /incidents/{id}

- **Descripción**: Obtiene un incidente específico por su ID
- **Parámetros**: `id` (integer, en path)
- **Respuesta**: Objeto incidente
- **Códigos**:
  - `200 OK` (Incidente encontrado)
  - `404 Not Found` (No encontrado)

#### POST /incidents

- **Descripción**: Crea un nuevo incidente
- **Body**: Objeto con `reporter` y `description`
- **Validaciones**:
  - `reporter` es obligatorio
  - `description` debe tener al menos 10 caracteres
- **Respuesta**: Incidente creado
- **Códigos**:
  - `201 Created`
  - `400 Bad Request`

#### PUT /incidents/{id}

- **Descripción**: Actualiza el estado de un incidente
- **Parámetros**: `id` (integer, en path)
- **Body**: Objeto con `status` (`pendiente`, `en proceso`, `resuelto`)
- **Respuesta**: Incidente actualizado
- **Códigos**:
  - `200 OK`
  - `400 Bad Request`
  - `404 Not Found`

#### DELETE /incidents/{id}

- **Descripción**: Elimina un incidente
- **Parámetros**: `id` (integer, en path)
- **Respuesta**: Mensaje de éxito
- **Códigos**:
  - `200 OK`
  - `404 Not Found`

---

## 🧩 Funcionalidades del Cliente

- Listado de incidentes: Vista paginada con filtrado y ordenación
- Detalle de incidente: Información completa del incidente
- Creación de incidentes: Formulario con validaciones
- Actualización de estado: Cambiar entre estados definidos
- Eliminación de incidentes: Confirmación antes de eliminar
- Tema claro/oscuro: Persistencia de preferencia
- Notificaciones: Feedback visual de acciones
- Navegación responsive: Adaptado a cualquier dispositivo

---

## 🧪 Consideraciones Técnicas

### Optimizaciones de Rendimiento

- Web Workers para tareas intensivas
- Renderizado por lotes
- Lazy Loading de componentes
- Caché inteligente de peticiones

### Accesibilidad

- Uso de etiquetas ARIA
- HTML semántico
- Contraste adecuado
- Navegación por teclado

### Seguridad

- Sanitización de entradas
- Protección contra XSS
- Headers seguros con Nginx
- Validaciones en cliente y servidor

---

## 📝 Licencia

```
Este proyecto es de código abierto y puede ser usado con libertad.
```
