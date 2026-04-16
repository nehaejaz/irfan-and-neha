import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: {
    id: string;
    slug: string;
    event_name: string;
    partner1_name: string;
    partner2_name: string;
    event_date: string;
    venue: string;
    rsvpCount: number;
    attendingCount: number;
  };
  onView: () => void;
  onDelete: () => void;
}

const EventCard = ({ event, onView, onDelete }: EventCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const inviteLink = `${window.location.origin}/event/${event.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  return (
    <div className="border border-linen p-8 space-y-6 hover:shadow-lg transition-shadow">
      <div>
        <h3 className="text-2xl tracking-tight">{event.event_name}</h3>
        <p className="text-muted-foreground font-serif italic">
          {event.partner1_name} & {event.partner2_name}
        </p>
      </div>

      <div className="space-y-1 text-sm">
        <div className="text-muted-foreground">{formatDate(event.event_date)}</div>
        <div className="text-muted-foreground">{event.venue}</div>
      </div>

      {/* Stats */}
      <div className="flex gap-8 py-4 border-y border-linen">
        <div>
          <div className="font-serif text-3xl">{event.rsvpCount}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Total RSVPs</div>
        </div>
        <div>
          <div className="font-serif text-3xl text-primary">{event.attendingCount}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Attending</div>
        </div>
        <div>
          <div className="font-serif text-3xl">{event.rsvpCount - event.attendingCount}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Declined</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={onView}
          className="bg-foreground text-background hover:bg-primary text-xs uppercase tracking-widest flex-1"
        >
          View Guests
        </Button>
        <Button
          onClick={copyLink}
          variant="outline"
          className="border-linen hover:border-foreground text-xs uppercase tracking-widest flex-1"
        >
          Copy Link
        </Button>
        <Button
          onClick={onDelete}
          variant="outline"
          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs uppercase tracking-widest"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};

export default EventCard;
