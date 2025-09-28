export type Artwork = {
  id: string;
  title: string;
  artist: string;
  description: string;
  location: string;
  year: string;
  image: string;
  coords: { top: string; left: string };
};

export const artworks: Artwork[] = [
  {
    id: "1",
    title: "Mona Lisa",
    artist: "Leonardo da Vinci",
    description: "A half-length portrait painting by Italian artist Leonardo da Vinci. Considered an archetypal masterpiece of the Italian Renaissance.",
    location: "Gallery 2A",
    year: "c. 1503–1506",
    image: "artwork-mona-lisa",
    coords: { top: "25%", left: "30%" },
  },
  {
    id: "2",
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    description: "An oil-on-canvas painting by the Dutch Post-Impressionist painter Vincent van Gogh. It shows the view from the east-facing window of his asylum room at Saint-Rémy-de-Provence.",
    location: "Gallery 5C",
    year: "1889",
    image: "artwork-starry-night",
    coords: { top: "40%", left: "70%" },
  },
  {
    id: "3",
    title: "The Persistence of Memory",
    artist: "Salvador Dalí",
    description: "A 1931 painting by artist Salvador Dalí and one of the most recognizable works of Surrealism.",
    location: "Gallery 8B",
    year: "1931",
    image: "artwork-persistence-of-memory",
    coords: { top: "75%", left: "50%" },
  },
    {
    id: "4",
    title: "Girl with a Pearl Earring",
    artist: "Johannes Vermeer",
    description: "An oil painting by Dutch Golden Age painter Johannes Vermeer. It is a tronie of a girl with a headscarf and a pearl earring.",
    location: "Gallery 1A",
    year: "c. 1665",
    image: "artwork-girl-with-a-pearl-earring",
    coords: { top: "60%", left: "20%" },
  },
];
