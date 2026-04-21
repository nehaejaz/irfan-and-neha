import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    if (!imageFile) {
      toast({
        title: "Image required",
        description: "Please upload your wedding card image to continue.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      const card_image_url = await uploadCardImage(imageFile);

      // The database schema requires these fields. Since the host now uploads
      // a fully-designed card image, we persist neutral placeholders so all
      // event details live within the image itself.
      const event = await createEvent({
        event_name: "Wedding Invitation",
        partner1_name: "Invitation",
        partner2_name: "Card",
        event_date: new Date().toISOString().slice(0, 10),
        event_time: "00:00",
        venue: "See invitation card",
        card_image_url,
      });

      toast({
        title: "Invitation Created",
        description: `Your host code: ${event.host_code}. Save it to manage RSVPs later.`,
      });

      const storedCodes = JSON.parse(localStorage.getItem("host_codes") || "[]");
      storedCodes.push({ code: event.host_code, slug: event.slug, name: event.event_name });
      localStorage.setItem("host_codes", JSON.stringify(storedCodes));

      navigate(`/event/${event.slug}`);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create invitation",
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
            Upload Your <span className="italic">Invitation</span>
          </h1>
          <p className="mt-4 font-serif italic text-muted-foreground">
            Share your beautifully designed wedding card. Guests will view it and RSVP below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-widest">Wedding Card</Label>
            <div
              className="border-2 border-dashed border-linen hover:border-primary/40 transition-colors cursor-pointer p-8 text-center"
              onClick={() => document.getElementById("card-image")?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Card preview" className="max-h-96 mx-auto object-contain" />
              ) : (
                <div className="space-y-2 text-muted-foreground py-12">
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

          <Button
            type="submit"
            disabled={loading || !imageFile}
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
