import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getEventBySlug, submitRsvp } from "@/lib/supabase-helpers";

interface EventData {
  id: string;
  event_name: string;
  partner1_name: string;
  partner2_name: string;
  event_date: string;
  event_time: string;
  venue: string;
  venue_address: string | null;
  card_image_url: string | null;
  message: string | null;
}

const GuestInvite = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attending, setAttending] = useState(true);

  useEffect(() => {
    if (slug) {
      getEventBySlug(slug)
        .then(setEvent)
        .catch(() => setEvent(null))
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":");
    const h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${minutes} ${ampm}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event) return;
    setSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      await submitRsvp({
        event_id: event.id,
        guest_name: formData.get("guest_name") as string,
        email: (formData.get("email") as string) || undefined,
        attending,
        plus_ones: parseInt(formData.get("plus_ones") as string) || 0,
        dietary_notes: (formData.get("dietary_notes") as string) || undefined,
        message: (formData.get("message") as string) || undefined,
      });

      setSubmitted(true);
      toast({ title: "RSVP Submitted!", description: "Thank you for your response." });
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit RSVP",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-serif italic text-2xl text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl">Event Not Found</h1>
          <p className="text-muted-foreground">This invitation link may be invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Invitation Card */}
        <div className="relative bg-background shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] p-10 md:p-20 border border-linen/40 mb-16 animate-fade-in">
          {/* Wax Seal */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2">
            <div className="size-14 rounded-full bg-primary shadow-inner flex items-center justify-center border-4 border-primary/20">
              <div className="size-8 rounded-full border border-primary-foreground/30 flex items-center justify-center text-primary-foreground font-serif text-xl italic">
                {event.partner1_name[0]}
              </div>
            </div>
          </div>

          {/* Card Image */}
          {event.card_image_url && (
            <div className="mb-12 -mx-10 md:-mx-20 -mt-10 md:-mt-20">
              <img
                src={event.card_image_url}
                alt={event.event_name}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          <div className="text-center space-y-8 md:space-y-12">
            <div className="font-serif italic text-xl md:text-2xl text-muted-foreground tracking-wide uppercase">
              You are cordially invited to
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl tracking-tight">{event.partner1_name}</h1>
              <div className="font-serif text-2xl md:text-3xl italic text-muted-foreground">and</div>
              <h1 className="text-4xl md:text-6xl tracking-tight">{event.partner2_name}</h1>
            </div>

            <div className="w-24 h-px bg-linen mx-auto" />

            <div className="space-y-2 uppercase tracking-[0.2em] text-sm">
              <div>{formatDate(event.event_date)}</div>
              <div>At {formatTime(event.event_time)}</div>
            </div>

            <div className="space-y-1 text-muted-foreground">
              <div className="font-serif text-xl md:text-2xl">{event.venue}</div>
              {event.venue_address && <div className="italic">{event.venue_address}</div>}
            </div>

            {event.message && (
              <p className="font-serif italic text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                "{event.message}"
              </p>
            )}
          </div>
        </div>

        {/* RSVP Form */}
        {submitted ? (
          <div className="text-center space-y-6 py-16 animate-fade-in">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <span className="text-primary font-serif text-2xl">✓</span>
            </div>
            <h2 className="text-3xl">Thank You!</h2>
            <p className="text-muted-foreground text-lg font-serif italic">
              Your response has been received. We look forward to celebrating with you.
            </p>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <div className="text-center mb-10">
              <h2 className="text-3xl italic">Kindly Favor Us with a Reply</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest">Your Name</Label>
                <Input name="guest_name" required placeholder="Your full name" className="bg-background border-linen focus:border-primary" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest">Email</Label>
                <Input name="email" type="email" placeholder="your@email.com" className="bg-background border-linen focus:border-primary" />
              </div>

              {/* Attending Toggle */}
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest">Will You Attend?</Label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setAttending(true)}
                    className={`flex-1 py-4 border text-sm uppercase tracking-widest transition-all ${
                      attending
                        ? "bg-foreground text-background border-foreground"
                        : "border-linen hover:border-foreground"
                    }`}
                  >
                    Joyfully Accepts
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending(false)}
                    className={`flex-1 py-4 border text-sm uppercase tracking-widest transition-all ${
                      !attending
                        ? "bg-foreground text-background border-foreground"
                        : "border-linen hover:border-foreground"
                    }`}
                  >
                    Regretfully Declines
                  </button>
                </div>
              </div>

              {attending && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest">Additional Guests</Label>
                    <Input name="plus_ones" type="number" min="0" max="10" defaultValue="0" className="bg-background border-linen focus:border-primary" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest">Dietary Requirements</Label>
                    <Input name="dietary_notes" placeholder="Any dietary requirements..." className="bg-background border-linen focus:border-primary" />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest">A Personal Note</Label>
                <Textarea
                  name="message"
                  rows={3}
                  placeholder="Share your well wishes..."
                  className="bg-background border-linen focus:border-primary resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full py-6 bg-primary text-primary-foreground font-serif text-lg italic tracking-wide shadow-lg hover:bg-foreground transition-colors"
              >
                {submitting ? "Sending..." : "Send Your Reply"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestInvite;
