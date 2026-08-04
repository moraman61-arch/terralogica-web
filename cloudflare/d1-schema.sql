CREATE TABLE IF NOT EXISTS project_quotes (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  nombre TEXT NOT NULL,
  cargo_funcion TEXT NOT NULL,
  dependencia_gobierno TEXT NOT NULL,
  telefono_contacto TEXT NOT NULL,
  correo_electronico TEXT NOT NULL,
  selected_services TEXT NOT NULL,
  selected_options_count INTEGER NOT NULL DEFAULT 0,
  polygon_file_name TEXT NOT NULL,
  polygon_content_type TEXT,
  polygon_file_size INTEGER NOT NULL,
  polygon_r2_key TEXT NOT NULL,
  source_page TEXT
);

CREATE INDEX IF NOT EXISTS idx_project_quotes_created_at ON project_quotes(created_at);
CREATE INDEX IF NOT EXISTS idx_project_quotes_email ON project_quotes(correo_electronico);
