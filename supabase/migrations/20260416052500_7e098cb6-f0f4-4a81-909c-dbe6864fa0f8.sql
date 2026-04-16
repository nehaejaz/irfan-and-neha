
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  host_code TEXT NOT NULL DEFAULT encode(gen_random_bytes(6), 'hex'),
  event_name TEXT NOT NULL,
  partner1_name TEXT NOT NULL,
  partner2_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  venue TEXT NOT NULL,
  venue_address TEXT,
  card_image_url TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  email TEXT,
  attending BOOLEAN NOT NULL DEFAULT true,
  plus_ones INTEGER NOT NULL DEFAULT 0,
  dietary_notes TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can create events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete events" ON public.events FOR DELETE USING (true);

CREATE POLICY "Anyone can view rsvps" ON public.rsvps FOR SELECT USING (true);
CREATE POLICY "Anyone can create rsvps" ON public.rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete rsvps" ON public.rsvps FOR DELETE USING (true);

CREATE INDEX idx_events_slug ON public.events(slug);
CREATE INDEX idx_events_host_code ON public.events(host_code);
CREATE INDEX idx_rsvps_event_id ON public.rsvps(event_id);

INSERT INTO storage.buckets (id, name, public) VALUES ('card-images', 'card-images', true);
CREATE POLICY "Anyone can upload card images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'card-images');
CREATE POLICY "Anyone can view card images" ON storage.objects FOR SELECT USING (bucket_id = 'card-images');

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
