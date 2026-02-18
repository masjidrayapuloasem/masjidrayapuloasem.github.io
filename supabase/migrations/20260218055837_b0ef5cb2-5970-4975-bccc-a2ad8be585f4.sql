
-- Create site_content table for editable text blocks
CREATE TABLE public.site_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "Anyone can view site_content" ON public.site_content FOR SELECT USING (true);

-- Admins can update
CREATE POLICY "Admins can update site_content" ON public.site_content FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins can insert site_content" ON public.site_content FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can delete site_content" ON public.site_content FOR DELETE USING (is_admin());

-- Seed default content
INSERT INTO public.site_content (key, title, content) VALUES
  ('sejarah', 'Sejarah Singkat', 'Masjid Raya Pulo Asem berdiri sebagai pusat kegiatan keislaman masyarakat di kawasan Pulo Asem, Jakarta Timur. Didirikan dengan visi untuk membina umat yang berilmu, beriman, dan berkontribusi bagi masyarakat sekitar.'),
  ('sejarah_detail', 'Detail Sejarah', 'Selama bertahun-tahun, Masjid Raya Pulo Asem telah menjadi rumah bagi berbagai kegiatan dakwah, pendidikan, dan pengabdian kepada masyarakat. Masjid ini terus berkembang menjadi tempat yang nyaman untuk beribadah dan menuntut ilmu.'),
  ('visi', 'Visi', 'Menjadi masjid yang memakmurkan umat, menjadi pusat pembinaan keislaman, dan berkontribusi dalam membangun peradaban Islam yang rahmatan lil''alamin.'),
  ('misi', 'Misi', '<ul><li>Menyelenggarakan ibadah sholat lima waktu dan sholat Jumat dengan khusyuk</li><li>Mengadakan kajian rutin dan pendidikan agama Islam</li><li>Memberdayakan masyarakat melalui program sosial dan zakat</li></ul>');

-- Trigger for updated_at
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
