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
  card_image_url: string | null;
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
          <h1 className="text-4xl">Invitation Not Found</h1>
          <p className="text-muted-foreground">This invitation link may be invalid.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Card Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-16 md:py-24 overflow-hidden">
        {/* Decorative background blur of the card */}
        {event.card_image_url && (
          <div
            aria-hidden
            className="absolute inset-0 opacity-20 blur-3xl scale-110"
            style={{
              backgroundImage: `url(${event.card_image_url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}

        <div className="relative max-w-3xl w-full">
          <div className="text-center mb-8 animate-fade-in">
            <span className="block text-xs uppercase tracking-[0.4em] mb-3 text-muted-foreground">
              You are cordially invited
            </span>
            <div className="w-16 h-px bg-linen mx-auto" />
          </div>

          {event.card_image_url && (
            <div
              className="relative group animate-scale-in"
              style={{ animationDuration: "0.8s" }}
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <img
                src={event.card_image_url}
                alt="Wedding Invitation"
                className="relative w-full h-auto object-contain shadow-[0_40px_120px_-20px_rgba(0,0,0,0.25)] transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          )}

          <div
            className="text-center mt-12 animate-fade-in"
            style={{ animationDelay: "0.6s", animationFillMode: "both" }}
          >
            <a
              href="#rsvp"
              className="inline-block text-xs uppercase tracking-[0.4em] text-muted-foreground hover:text-foreground transition-colors"
            >
              ↓ Kindly RSVP Below
            </a>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section id="rsvp" className="border-t border-linen/50 bg-background">
        <div className="max-w-2xl mx-auto px-6 py-20 md:py-28">
          {submitted ? (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-primary font-serif text-2xl">✓</span>
              </div>
              <h2 className="text-3xl">Thank You!</h2>
              <p className="text-muted-foreground text-lg font-serif italic">
                Your response has been received. We look forward to celebrating with you.
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-12">
                <span className="block text-xs uppercase tracking-[0.4em] mb-4 text-muted-foreground">
                  Répondez s'il vous plaît
                </span>
                <h2 className="text-3xl md:text-4xl italic">Kindly Favor Us with a Reply</h2>
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
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default GuestInvite;
