import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  getEventsByHostCode,
  getRsvpsForEvent,
  deleteEvent,
} from "@/lib/supabase-helpers";
import EventCard from "@/components/EventCard";
import EventDetailDialog from "@/components/EventDetailDialog";

interface EventWithRsvps {
  id: string;
  slug: string;
  host_code: string;
  event_name: string;
  partner1_name: string;
  partner2_name: string;
  event_date: string;
  event_time: string;
  venue: string;
  venue_address: string | null;
  card_image_url: string | null;
  message: string | null;
  created_at: string;
  rsvpCount: number;
  attendingCount: number;
  rsvps: Array<{
    id: string;
    guest_name: string;
    email: string | null;
    attending: boolean;
    plus_ones: number;
    dietary_notes: string | null;
    message: string | null;
    created_at: string;
  }>;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [hostCode, setHostCode] = useState("");
  const [events, setEvents] = useState<EventWithRsvps[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventWithRsvps | null>(null);

  // Auto-load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("host_codes") || "[]");
    if (stored.length > 0) {
      setHostCode(stored[stored.length - 1].code);
    }
  }, []);

  const handleLookup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!hostCode.trim()) return;
    setLoading(true);

    try {
      const eventsData = await getEventsByHostCode(hostCode.trim());
      const eventsWithRsvps: EventWithRsvps[] = await Promise.all(
        eventsData.map(async (evt) => {
          const rsvps = await getRsvpsForEvent(evt.id);
          return {
            ...evt,
            rsvpCount: rsvps.length,
            attendingCount: rsvps.filter((r) => r.attending).length,
            rsvps,
          };
        })
      );
      setEvents(eventsWithRsvps);
      setLoaded(true);

      if (eventsWithRsvps.length === 0) {
        toast({ title: "No events found", description: "Check your host code and try again." });
      }
    } catch {
      toast({ title: "Error", description: "Failed to load events", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await deleteEvent(eventId, hostCode);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      toast({ title: "Event deleted" });
    } catch {
      toast({ title: "Error", description: "Failed to delete event", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex justify-between items-center px-6 md:px-12 py-8 border-b border-linen/50">
        <Link to="/" className="font-serif italic text-2xl tracking-tight text-foreground">
          Aethelgard
        </Link>
        <Link to="/create">
          <Button variant="outline" className="text-xs uppercase tracking-widest border-foreground hover:bg-foreground hover:text-background">
            Create Event
          </Button>
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="block text-xs uppercase tracking-[0.4em] mb-4 text-muted-foreground">
            Your Planning Suite
          </span>
          <h1 className="text-4xl md:text-5xl tracking-tight">
            Host <span className="italic">Dashboard</span>
          </h1>
        </div>

        {/* Host Code Lookup */}
        <form onSubmit={handleLookup} className="max-w-md mx-auto mb-16">
          <Label className="text-xs uppercase tracking-widest block mb-2">Your Host Code</Label>
          <div className="flex gap-3">
            <Input
              value={hostCode}
              onChange={(e) => setHostCode(e.target.value)}
              placeholder="Enter your host code"
              className="bg-background border-linen focus:border-primary"
            />
            <Button
              type="submit"
              disabled={loading}
              className="px-8 bg-foreground text-background hover:bg-primary text-xs uppercase tracking-widest"
            >
              {loading ? "..." : "View"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 italic">
            Your host code was provided when you created your event.
          </p>
        </form>

        {/* Events Grid */}
        {loaded && events.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <p className="font-serif italic text-xl text-muted-foreground">No events found for this host code.</p>
            <Link to="/create">
              <Button className="bg-foreground text-background hover:bg-primary text-xs uppercase tracking-widest">
                Create Your First Event
              </Button>
            </Link>
          </div>
        )}

        {events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onView={() => setSelectedEvent(event)}
                onDelete={() => handleDelete(event.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Event Detail Dialog */}
      {selectedEvent && (
        <EventDetailDialog
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
