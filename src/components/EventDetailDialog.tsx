import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Rsvp {
  id: string;
  guest_name: string;
  email: string | null;
  attending: boolean;
  plus_ones: number;
  dietary_notes: string | null;
  message: string | null;
  created_at: string;
}

interface EventDetailDialogProps {
  event: {
    event_name: string;
    rsvps: Rsvp[];
    attendingCount: number;
    rsvpCount: number;
  };
  onClose: () => void;
}

const EventDetailDialog = ({ event, onClose }: EventDetailDialogProps) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background border-linen">
        <DialogHeader>
          <DialogTitle className="text-2xl tracking-tight">
            {event.event_name} — <span className="italic">Guest Registry</span>
          </DialogTitle>
          <div className="flex gap-6 pt-2">
            <span className="text-sm text-muted-foreground">
              <span className="font-serif text-lg text-foreground">{event.attendingCount}</span> attending
            </span>
            <span className="text-sm text-muted-foreground">
              <span className="font-serif text-lg text-foreground">{event.rsvpCount - event.attendingCount}</span> declined
            </span>
          </div>
        </DialogHeader>

        {event.rsvps.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-serif italic text-lg text-muted-foreground">No responses yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-linen/50">
            {event.rsvps.map((rsvp) => (
              <div key={rsvp.id} className="py-4 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="font-serif text-lg">{rsvp.guest_name}</div>
                  {rsvp.email && (
                    <div className="text-xs text-muted-foreground">{rsvp.email}</div>
                  )}
                  {rsvp.plus_ones > 0 && (
                    <div className="text-xs text-muted-foreground">+{rsvp.plus_ones} guest{rsvp.plus_ones > 1 ? "s" : ""}</div>
                  )}
                  {rsvp.dietary_notes && (
                    <div className="text-xs text-muted-foreground italic">Diet: {rsvp.dietary_notes}</div>
                  )}
                  {rsvp.message && (
                    <div className="text-sm font-serif italic text-muted-foreground mt-2">"{rsvp.message}"</div>
                  )}
                </div>
                <span
                  className={`text-xs uppercase tracking-widest ${
                    rsvp.attending ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {rsvp.attending ? "Confirmed" : "Declined"}
                </span>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailDialog;
