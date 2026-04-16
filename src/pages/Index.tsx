import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-8 border-b border-linen/50">
        <Link to="/" className="font-serif italic text-2xl tracking-tight text-foreground">
          Aethelgard
        </Link>
        <div className="flex items-center gap-6 md:gap-12">
          <Link
            to="/dashboard"
            className="text-sm uppercase tracking-[0.2em] font-medium hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link to="/create">
            <Button variant="outline" className="text-xs uppercase tracking-widest border-foreground hover:bg-foreground hover:text-background transition-all">
              Create Event
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 md:px-12 pt-20 md:pt-32 pb-16 md:pb-24 text-center">
        <span className="block text-xs uppercase tracking-[0.4em] mb-8 text-muted-foreground">
          The Digital Invitation Redefined
        </span>
        <h1 className="text-5xl md:text-8xl leading-[0.9] tracking-tighter mb-8 md:mb-12 max-w-4xl mx-auto text-balance animate-fade-in">
          Honoring the weight of your <span className="italic">shared legacy.</span>
        </h1>
        <p className="max-w-[55ch] mx-auto text-lg md:text-xl leading-relaxed text-muted-foreground mb-12 md:mb-16">
          Aethelgard elevates the wedding RSVP from a logistical task to a digital heirloom.
          Crafted for those who value the permanence of ritual and the beauty of high-craft paper.
        </p>
        <Link to="/create">
          <Button className="px-10 py-6 text-sm uppercase tracking-widest bg-foreground text-background hover:bg-primary transition-colors">
            Create Your Event
          </Button>
        </Link>
      </header>

      {/* Sample Invite Preview */}
      <section className="bg-linen/20 py-20 md:py-32 border-y border-linen">
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative bg-background shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] p-12 md:p-24 border border-linen/40">
            {/* Wax Seal */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <div className="size-14 rounded-full bg-primary shadow-inner flex items-center justify-center border-4 border-primary/20">
                <div className="size-8 rounded-full border border-primary-foreground/30 flex items-center justify-center text-primary-foreground font-serif text-xl italic">
                  A
                </div>
              </div>
            </div>

            <div className="text-center space-y-8 md:space-y-12">
              <div className="font-serif italic text-xl md:text-2xl text-muted-foreground tracking-wide uppercase">
                The Wedding of
              </div>
              <div className="space-y-3">
                <h2 className="text-4xl md:text-6xl tracking-tight">Genevieve Sterling</h2>
                <div className="font-serif text-2xl md:text-3xl italic text-muted-foreground">and</div>
                <h2 className="text-4xl md:text-6xl tracking-tight">Arthur Saint-Clair</h2>
              </div>
              <div className="w-24 h-px bg-linen mx-auto" />
              <div className="space-y-2 uppercase tracking-[0.3em] text-sm">
                <div>Saturday, September 14, 2025</div>
                <div>At Four O'Clock in the Afternoon</div>
              </div>
              <div className="space-y-1 text-muted-foreground">
                <div className="font-serif text-2xl">The Belvedere Estate</div>
                <div className="italic">Tarrytown, New York</div>
              </div>
              <div className="pt-8">
                <Button className="px-12 py-6 bg-primary text-primary-foreground font-serif text-lg md:text-xl italic tracking-wide shadow-lg hover:bg-foreground transition-colors">
                  Kindly Favor Us with a Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div className="space-y-4">
            <div className="size-12 rounded-full border border-primary/30 flex items-center justify-center font-serif italic text-primary">
              01
            </div>
            <h3 className="text-2xl leading-tight">Create Your Invitation</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upload your card image, set the date, venue, and personal message. Share the link with your guests.
            </p>
          </div>
          <div className="space-y-4">
            <div className="size-12 rounded-full border border-primary/30 flex items-center justify-center font-serif italic text-primary">
              02
            </div>
            <h3 className="text-2xl leading-tight">Guests RSVP with Grace</h3>
            <p className="text-muted-foreground leading-relaxed">
              Your guests receive a beautifully crafted invitation page where they can respond with elegance.
            </p>
          </div>
          <div className="space-y-4">
            <div className="size-12 rounded-full border border-primary/30 flex items-center justify-center font-serif italic text-primary">
              03
            </div>
            <h3 className="text-2xl leading-tight">Track Your Guest List</h3>
            <p className="text-muted-foreground leading-relaxed">
              A refined dashboard to manage your events and keep track of every honored guest's response.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-linen py-16 px-6 md:px-12 bg-foreground text-background">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="font-serif italic text-3xl mb-8">Aethelgard</div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-background/30">
            Established in the Digital Era, Dedicated to the Analog Spirit
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
