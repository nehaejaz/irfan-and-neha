import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createEvent, uploadCardImage } from "@/lib/supabase-helpers";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      let card_image_url: string | undefined;

      if (imageFile) {
        card_image_url = await uploadCardImage(imageFile);
      }

      const event = await createEvent({
        event_name: formData.get("event_name") as string,
        partner1_name: formData.get("partner1_name") as string,
        partner2_name: formData.get("partner2_name") as string,
        event_date: formData.get("event_date") as string,
        event_time: formData.get("event_time") as string,
        venue: formData.get("venue") as string,
        venue_address: (formData.get("venue_address") as string) || undefined,
        message: (formData.get("message") as string) || undefined,
        card_image_url,
      });

      toast({
        title: "Event Created!",
        description: `Your host code is: ${event.host_code}. Save this to manage your event later!`,
      });

      // Store host code locally for convenience
      const storedCodes = JSON.parse(localStorage.getItem("host_codes") || "[]");
      storedCodes.push({ code: event.host_code, slug: event.slug, name: event.event_name });
      localStorage.setItem("host_codes", JSON.stringify(storedCodes));

      navigate(`/event/${event.slug}`);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="flex justify-between items-center px-6 md:px-12 py-8 border-b border-linen/50">
        <Link to="/" className="font-serif italic text-2xl tracking-tight text-foreground">
          Aethelgard
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-12">
          <span className="block text-xs uppercase tracking-[0.4em] mb-4 text-muted-foreground">
            Begin Your Story
          </span>
          <h1 className="text-4xl md:text-5xl tracking-tight">
            Create Your <span className="italic">Invitation</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card Image Upload */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest">Card Image</Label>
            <div
              className="border-2 border-dashed border-linen hover:border-primary/40 transition-colors cursor-pointer p-8 text-center"
              onClick={() => document.getElementById("card-image")?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Card preview" className="max-h-64 mx-auto object-contain" />
              ) : (
                <div className="space-y-2 text-muted-foreground">
                  <div className="font-serif italic text-lg">Upload your wedding card image</div>
                  <div className="text-sm">Click to browse or drag and drop</div>
                </div>
              )}
              <input
                id="card-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Event Name */}
          <div className="space-y-2">
            <Label htmlFor="event_name" className="text-xs uppercase tracking-widest">Event Name</Label>
            <Input id="event_name" name="event_name" required placeholder="The Sterling-Saint Clair Wedding" className="bg-background border-linen focus:border-primary" />
          </div>

          {/* Partner Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="partner1_name" className="text-xs uppercase tracking-widest">Partner 1 Name</Label>
              <Input id="partner1_name" name="partner1_name" required placeholder="Genevieve Sterling" className="bg-background border-linen focus:border-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner2_name" className="text-xs uppercase tracking-widest">Partner 2 Name</Label>
              <Input id="partner2_name" name="partner2_name" required placeholder="Arthur Saint-Clair" className="bg-background border-linen focus:border-primary" />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="event_date" className="text-xs uppercase tracking-widest">Date</Label>
              <Input id="event_date" name="event_date" type="date" required className="bg-background border-linen focus:border-primary" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_time" className="text-xs uppercase tracking-widest">Time</Label>
              <Input id="event_time" name="event_time" type="time" required className="bg-background border-linen focus:border-primary" />
            </div>
          </div>

          {/* Venue */}
          <div className="space-y-2">
            <Label htmlFor="venue" className="text-xs uppercase tracking-widest">Venue</Label>
            <Input id="venue" name="venue" required placeholder="The Belvedere Estate" className="bg-background border-linen focus:border-primary" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venue_address" className="text-xs uppercase tracking-widest">Venue Address</Label>
            <Input id="venue_address" name="venue_address" placeholder="Tarrytown, New York" className="bg-background border-linen focus:border-primary" />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-xs uppercase tracking-widest">Personal Message</Label>
            <Textarea
              id="message"
              name="message"
              rows={4}
              placeholder="We joyfully invite you to celebrate our union..."
              className="bg-background border-linen focus:border-primary resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-6 text-sm uppercase tracking-widest bg-foreground text-background hover:bg-primary transition-colors"
          >
            {loading ? "Creating..." : "Create Invitation"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
