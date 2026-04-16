import { supabase } from "@/integrations/supabase/client";

export async function createEvent(data: {
  event_name: string;
  partner1_name: string;
  partner2_name: string;
  event_date: string;
  event_time: string;
  venue: string;
  venue_address?: string;
  card_image_url?: string;
  message?: string;
}) {
  const slug = generateSlug(data.partner1_name, data.partner2_name);
  const { data: event, error } = await supabase
    .from("events")
    .insert({ ...data, slug })
    .select()
    .single();
  if (error) throw error;
  return event;
}

export async function getEventBySlug(slug: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data;
}

export async function getEventsByHostCode(hostCode: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("host_code", hostCode);
  if (error) throw error;
  return data;
}

export async function updateEvent(id: string, hostCode: string, data: Record<string, unknown>) {
  const { data: event, error } = await supabase
    .from("events")
    .update(data)
    .eq("id", id)
    .eq("host_code", hostCode)
    .select()
    .single();
  if (error) throw error;
  return event;
}

export async function deleteEvent(id: string, hostCode: string) {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .eq("host_code", hostCode);
  if (error) throw error;
}

export async function submitRsvp(data: {
  event_id: string;
  guest_name: string;
  email?: string;
  attending: boolean;
  plus_ones?: number;
  dietary_notes?: string;
  message?: string;
}) {
  const { data: rsvp, error } = await supabase
    .from("rsvps")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return rsvp;
}

export async function getRsvpsForEvent(eventId: string) {
  const { data, error } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function uploadCardImage(file: File) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const { error } = await supabase.storage
    .from("card-images")
    .upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from("card-images").getPublicUrl(fileName);
  return data.publicUrl;
}

function generateSlug(name1: string, name2: string): string {
  const base = `${name1}-and-${name2}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${base}-${suffix}`;
}
