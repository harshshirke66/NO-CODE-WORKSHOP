import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-museum");

  return (
    <main className="relative min-h-screen flex items-center justify-center text-white">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 text-center p-4 flex flex-col items-center">
        <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter" style={{color: '#D4AF37'}}>
          Lords Museum
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-pale-blush/90" style={{color: '#F5F5DC'}}>
          Your Personal Museum Guide
        </p>
        <p className="mt-2 max-w-2xl text-base md:text-lg text-pale-blush/80" style={{color: '#F5F5DC'}}>
          Identify artworks, get personalized tours, and explore the collection like never before.
        </p>
        <Button asChild size="lg" className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:scale-105">
          <Link href="/dashboard">Enter the Museum</Link>
        </Button>
      </div>
    </main>
  );
}
