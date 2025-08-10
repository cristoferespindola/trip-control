-- Adicionar coluna tripValue na tabela trips
ALTER TABLE "trips" ADD COLUMN IF NOT EXISTS "tripValue" DOUBLE PRECISION;

-- Verificar se a coluna foi criada
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'trips' AND column_name = 'tripValue';
