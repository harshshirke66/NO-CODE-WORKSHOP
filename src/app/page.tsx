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
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 text-center p-4 flex flex-col items-center">
        <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-amber-400/90" style={{ textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
          Lords Museum
        </h1>
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-stone-200/90">
          Your Personal Museum Guide
        </p>
        <p className="mt-2 max-w-2xl text-base md:text-lg text-stone-300/80">
          Identify artworks, get personalized tours, and explore the collection like never before.
        </p>
        <Button asChild size="lg" className="mt-8 bg-amber-500/80 text-white hover:bg-amber-500 border border-amber-400/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 shadow-lg">
          <Link href="/dashboard">Enter the Museum</Link>
        </Button>
      </div>
    </main>
  );
}
