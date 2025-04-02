import { Client } from "pg";

// 1) Conexión a Postgres usando variables de entorno
const dbClient = new Client({
  host: Bun.env.DB_HOST || "db",
  port: parseInt(Bun.env.DB_PORT || "5432", 10),
  user: Bun.env.DB_USER || "postgres",
  password: Bun.env.DB_PASSWORD || "postgres",
  database: Bun.env.DB_NAME || "incidents_db",
});

dbClient
  .connect()
  .then(() => {
    console.log("✅ Conectado a la base de datos Postgres!");
  })
  .catch((err: any) => {
    console.error("❌ Error al conectar a la BD:", err);
  });

// Helpers de respuestas
async function notFoundResponse() {
  return new Response(JSON.stringify({ error: "Incidente no encontrado" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

async function badRequestResponse(message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

// Sirve el swagger UI en la raíz "/"
async function serveSwaggerUI(request: Request) {
  if (request.method === "GET") {
    const html = await Bun.file("./swagger/swagger.html").text();
    return new Response(html, {
      headers: { "Content-Type": "text/html" },
    });
  }
  return new Response("Method Not Allowed", { status: 405 });
}

// Sirve el swagger.yaml en "/swagger.yaml"
async function serveSwaggerSpec(request: Request) {
  if (request.method === "GET") {
    const file = await Bun.file(`./swagger/swagger.yaml`).text();
    return new Response(file, {
      headers: { "Content-Type": "application/x-yaml" },
    });
  }
  return new Response("Method Not Allowed", { status: 405 });
}

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const { method, url } = req;
    const { pathname } = new URL(url);

    // -----------------------------
    // Swagger UI en la ruta raíz "/"
    // -----------------------------
    if (pathname === "/") {
      return serveSwaggerUI(req);
    }
    // Sirve swagger.yaml
    if (pathname === "/swagger.yaml") {
      return serveSwaggerSpec(req);
    }

    // -------------
    // Ruta /incidents
    // -------------
    if (pathname === "/incidents") {
      if (method === "GET") {
        try {
          // Obtener todos
          const { rows } = await dbClient.query(
            "SELECT * FROM incidents ORDER BY id"
          );
          return new Response(JSON.stringify(rows), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error(error);
          return new Response(JSON.stringify({ error: "Error interno" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      if (method === "POST") {
        try {
          const data = await req.json();
          const { reporter, description } = data;

          // Validaciones
          if (!reporter) {
            return badRequestResponse("El campo 'reporter' es obligatorio");
          }
          if (!description || description.length < 10) {
            return badRequestResponse(
              "La descripción debe tener al menos 10 caracteres"
            );
          }

          // Insertar en BD
          const insertQuery = `
            INSERT INTO incidents (reporter, description)
            VALUES ($1, $2)
            RETURNING *
          `;
          const values = [reporter, description];
          const { rows } = await dbClient.query(insertQuery, values);
          const newIncident = rows[0];

          return new Response(JSON.stringify(newIncident), {
            status: 201,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error(error);
          return new Response(JSON.stringify({ error: "Error interno" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
    }

    // -------------
    // Ruta /incidents/{id}
    // -------------
    if (pathname.startsWith("/incidents/")) {
      const parts = pathname.split("/");
      const id = parseInt(parts[2] || "0", 10);

      if (method === "GET") {
        // Obtener incidente específico
        try {
          const { rows } = await dbClient.query(
            "SELECT * FROM incidents WHERE id=$1",
            [id]
          );
          if (rows.length === 0) {
            return notFoundResponse();
          }
          return new Response(JSON.stringify(rows[0]), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error(error);
          return new Response(JSON.stringify({ error: "Error interno" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      if (method === "PUT") {
        // Actualizar status
        try {
          const body = await req.json();
          const { status } = body;
          if (!status) {
            return badRequestResponse(
              "Debes proporcionar el nuevo 'status' (pendiente, en proceso, resuelto)"
            );
          }

          // Verificar si existe
          const { rows } = await dbClient.query(
            "SELECT * FROM incidents WHERE id=$1",
            [id]
          );
          if (rows.length === 0) {
            return notFoundResponse();
          }

          // Actualizar
          const updateQuery = `
            UPDATE incidents
            SET status=$1
            WHERE id=$2
            RETURNING *
          `;
          const updatedResult = await dbClient.query(updateQuery, [status, id]);
          return new Response(JSON.stringify(updatedResult.rows[0]), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error(error);
          return new Response(JSON.stringify({ error: "Error interno" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }

      if (method === "DELETE") {
        // Eliminar
        try {
          // Verificar si existe
          const { rows } = await dbClient.query(
            "SELECT * FROM incidents WHERE id=$1",
            [id]
          );
          if (rows.length === 0) {
            return notFoundResponse();
          }

          await dbClient.query("DELETE FROM incidents WHERE id=$1", [id]);

          return new Response(
            JSON.stringify({ message: "Incidente eliminado correctamente" }),
            {
              headers: { "Content-Type": "application/json" },
            }
          );
        } catch (error) {
          console.error(error);
          return new Response(JSON.stringify({ error: "Error interno" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      }
    }

    // -------------
    // Not found
    // -------------
    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  },
});

console.log(`✅ Servidor Bun corriendo en http://localhost:${server.port}`);
