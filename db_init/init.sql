CREATE TABLE IF NOT EXISTS incidents (
  id SERIAL PRIMARY KEY,
  reporter VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE incidents
ADD CONSTRAINT status_check
CHECK (status IN ('pendiente', 'en proceso', 'resuelto'));


INSERT INTO incidents (reporter, description, status) VALUES
('Ana Martínez', 'La impresora del departamento de marketing no funciona correctamente. Muestra error de conexión.', 'pendiente'),
('Carlos Rodríguez', 'Necesito acceso al sistema de gestión de inventario para el nuevo empleado Juan Pérez.', 'en proceso'),
('Elena Gómez', 'El equipo del departamento contable está muy lento y se bloquea constantemente al usar Excel.', 'resuelto'),
('Luis Fernández', 'La aplicación de CRM muestra un error al intentar generar informes mensuales.', 'pendiente'),
('Sofía López', 'Solicitud de instalación de software de diseño gráfico en el equipo de Laura del departamento creativo.', 'en proceso'),
('Miguel Sánchez', 'El proyector de la sala de reuniones principal no conecta correctamente con los portátiles.', 'resuelto'),
('Carmen Díaz', 'Problema con el acceso VPN desde casa, no permite la conexión después de actualizar Windows.', 'pendiente'),
('Javier Torres', 'Los teléfonos IP de recepción no reciben llamadas entrantes pero sí pueden realizar salientes.', 'en proceso'),
('Patricia Navarro', 'El sistema de climatización de la planta baja está configurado a temperatura muy baja y no se puede ajustar.', 'pendiente'),
('Roberto Jiménez', 'Solicitud de revisión de seguridad para el nuevo portal web antes de su lanzamiento.', 'pendiente');