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

## ⚙️ Tecnologías utilizadas

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

## 📋 Estructura de datos

### Datos de un incidente

- `id`: Autogenerado (integer)
- `reporter`: Nombre del reportador (string, obligatorio)
- `description`: Descripción del incidente (mínimo 10 caracteres)
- `status`: Estado del incidente (pendiente, en proceso, resuelto)
- `created_at`: Fecha y hora de creación

## 📦 Estructura del proyecto

incidents-platform/
├── api/ # API en Bun
├── client/ # Cliente en Vanilla JavaScript
├── db_init/ # Scripts de inicialización de BD
├── docker-compose.yml # Orquestación con Docker Compose
└── README.md # Este archivo

## 🛠️ Requisitos

- **Docker** y **Docker Compose** instalados
- No necesitas instalar nada más localmente; todo se ejecuta en contenedores

## ▶️ Cómo ejecutar el proyecto

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd <nombre-del-directorio>
2. Iniciar los contenedores con Docker Compose
bashdocker-compose up --build
3. Acceder a la aplicación

Cliente (Frontend): http://localhost:8080
API (Backend): http://localhost:3000
Swagger UI: http://localhost:3000/
Swagger YAML: http://localhost:3000/swagger.yaml

📚 Documentación de API
Endpoints disponibles
MétodoRutaDescripciónGET/incidentsObtener todos los incidentesGET/incidents/:idObtener incidente por IDPOST/incidentsCrear un nuevo incidentePUT/incidents/:idActualizar estado de incidenteDELETE/incidents/:idEliminar un incidente
Detalles de los endpoints
GET /incidents

Descripción: Obtiene la lista completa de incidentes
Respuesta: Array de objetos incidente
Código de respuesta: 200 OK

GET /incidents/{id}

Descripción: Obtiene un incidente específico por su ID
Parámetros: id (integer, en path)
Respuesta: Objeto incidente
Códigos de respuesta:

200 OK (Incidente encontrado)
404 (Incidente no encontrado)



POST /incidents

Descripción: Crea un nuevo incidente
Body: Objeto con reporter y description
Validaciones:

reporter es obligatorio
description debe tener al menos 10 caracteres


Respuesta: Incidente creado
Códigos de respuesta:

201 Created (Incidente creado)
400 Bad Request (Error de validación)



PUT /incidents/{id}

Descripción: Actualiza el estado de un incidente
Parámetros: id (integer, en path)
Body: Objeto con status (pendiente, en proceso, resuelto)
Respuesta: Incidente actualizado
Códigos de respuesta:

200 OK (Incidente actualizado)
400 Bad Request (Error de validación)
404 (Incidente no encontrado)



DELETE /incidents/{id}

Descripción: Elimina un incidente
Parámetros: id (integer, en path)
Respuesta: Mensaje de éxito
Códigos de respuesta:

200 OK (Incidente eliminado)
404 (Incidente no encontrado)



🧩 Funcionalidades del cliente

Listado de incidentes: Vista principal con listado paginado y opciones de filtrado/ordenación
Detalle de incidente: Vista completa con toda la información del incidente
Creación de incidentes: Formulario para reportar nuevos incidentes
Actualización de estado: Cambiar el estado de un incidente entre pendiente, en proceso y resuelto
Eliminación de incidentes: Eliminar incidentes con confirmación
Tema claro/oscuro: Cambiar entre temas con persistencia de preferencia
Notificaciones: Sistema de notificaciones para informar sobre acciones realizadas
Navegación responsive: Adaptación a diferentes tamaños de pantalla

🧪 Consideraciones técnicas
Optimizaciones de rendimiento

Web Workers para operaciones pesadas
Renderizado por lotes de listas grandes
Lazy Loading de componentes
Caché inteligente para peticiones a la API

Accesibilidad

Etiquetas ARIA para componentes interactivos
Estructura semántica de HTML
Suficiente contraste de colores
Navegación por teclado

Seguridad

Sanitización de entradas
Protección contra XSS
Headers de seguridad en configuración de Nginx
Validación de datos tanto en cliente como en servidor

📝 Licencia
Este proyecto es de código abierto y puede ser usado con libertad.
```
