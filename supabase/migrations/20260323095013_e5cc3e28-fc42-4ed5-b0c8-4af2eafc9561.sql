INSERT INTO storage.buckets (id, name, public)
VALUES ('papers', 'papers', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public, name = EXCLUDED.name;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public can read papers bucket'
  ) THEN
    CREATE POLICY "Public can read papers bucket"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'papers');
  END IF;
END
$$;