-- Crear tabla para envíos de artículos
CREATE TABLE article_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT NOT NULL,
  summary TEXT NOT NULL,
  keywords TEXT,
  area TEXT NOT NULL,
  doi TEXT,
  pdf_url TEXT,
  ethics_declaration BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear índices para mejorar performance
CREATE INDEX idx_article_submissions_status ON article_submissions(status);
CREATE INDEX idx_article_submissions_area ON article_submissions(area);
CREATE INDEX idx_article_submissions_submitted_at ON article_submissions(submitted_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE article_submissions ENABLE ROW LEVEL SECURITY;

-- Política para permitir INSERT a usuarios anónimos (para el formulario público)
CREATE POLICY "Anyone can submit articles" ON article_submissions
FOR INSERT WITH CHECK (true);

-- Política para que solo admins puedan ver/editar (cuando implementes auth)
CREATE POLICY "Admins can view all submissions" ON article_submissions
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Crear función para notificaciones (opcional)
CREATE OR REPLACE FUNCTION notify_new_submission()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('new_article_submission', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificaciones automáticas
CREATE TRIGGER article_submission_notify
  AFTER INSERT ON article_submissions
  FOR EACH ROW EXECUTE FUNCTION notify_new_submission();

-- Comentarios para documentación
COMMENT ON TABLE article_submissions IS 'Almacena los envíos de artículos científicos del formulario web';
COMMENT ON COLUMN article_submissions.status IS 'Estado del envío: pending (pendiente), approved (aprobado), rejected (rechazado)';
COMMENT ON COLUMN article_submissions.area IS 'Área médica: Cardio, Nefrología, Endocrino, etc.';
