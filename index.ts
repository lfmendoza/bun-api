const server = Bun.serve({
  port: 3000,
  fetch(req) {
    const { method, url } = req;
    const pathname = new URL(url).pathname;

    if (method === "GET" && pathname === "/api/hello") {
      return new Response(JSON.stringify({ message: "Hola desde Bun!" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    if (method === "POST" && pathname === "/api/data") {
      return req.json().then((body) => {
        return new Response(
          JSON.stringify({
            message: "Datos recibidos correctamente",
            data: body,
          }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      });
    }

    return new Response("Not Found", { status: 404 });
  },
  websocket: {
    open(ws) {
      console.log("WebSocket connection opened");
    },
    message(ws, message) {
      console.log("Received message:", message);
    },
    close(ws) {
      console.log("WebSocket connection closed");
    },
  },
});

console.log(`🚀 Servidor escuchando en http://localhost:${server.port}`);
