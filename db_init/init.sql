\connect incidents_db;

CREATE TABLE IF NOT EXISTS incidents (
  id SERIAL PRIMARY KEY,
  reporter VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);


INSERT INTO incidents (reporter, description, status) VALUES
('Juan Pérez', 'Incidente 1', 'pendiente'),
('María López', 'Incidente 2', 'resuelto'),
('Carlos García', 'Incidente 3', 'pendiente'),
('Ana Martínez', 'Incidente 4', 'en progreso'),
('Luis Fernández', 'Incidente 5', 'pendiente');
INSERT INTO incidents (reporter, description, status) VALUES
('Pedro Sánchez', 'Incidente 6', 'resuelto'),
('Laura Gómez', 'Incidente 7', 'pendiente'),
('Javier Torres', 'Incidente 8', 'en progreso'),
('Sofía Ramírez', 'Incidente 9', 'pendiente'),
('Diego Ruiz', 'Incidente 10', 'resuelto');