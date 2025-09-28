
'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, Sparkles, Image as ImageIcon, Route, Building2 } from 'lucide-react';
import { ArtworkIdentifier } from './artwork-identifier';
import type { IdentifyArtworkOutput } from '@/ai/flows/artwork-identification';
import { ArtworkCard } from './artwork-card';
import { PersonalizedTourGenerator } from './personalized-tour-generator';
import type { PersonalizedTourOutput } from '@/ai/flows/personalized-tour-generation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  content: ReactNode;
  isComponent?: boolean;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add initial welcome message
    setMessages([
        {
            id: 'welcome',
            sender: 'bot',
            content: (
                <div>
                    <p className="font-bold text-lg">Welcome to ALLY, your personal museum guide!</p>
                    <p>I can help you with a few things:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><span className="font-semibold">Identify Artwork:</span> Upload an image, and I'll tell you about it.</li>
                        <li><span className="font-semibold">Generate a Tour:</span> Type "give me a tour" or "create a tour" to get a personalized plan.</li>
                    </ul>
                </div>
            )
        },
        {
            id: 'artwork-identifier-component',
            sender: 'bot',
            content: <ArtworkIdentifier onIdentificationComplete={handleIdentification} onIsLoading={handleLoading} />,
            isComponent: true,
        },
    ]);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
    if(loading) {
      // Remove interactive components when loading
      setMessages(prev => prev.filter(m => !m.isComponent));
    }
  };

  const handleIdentification = (result: IdentifyArtworkOutput, imagePreviewUrl: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: `user-img-${Date.now()}`,
        sender: 'user',
        content: <img src={imagePreviewUrl} alt="Uploaded artwork" className="rounded-lg max-h-60" />,
      },
      {
        id: `bot-artwork-${Date.now()}`,
        sender: 'bot',
        content: <ArtworkCard artwork={result} imagePreviewUrl={imagePreviewUrl} />,
      },
      {
        id: 'artwork-identifier-component-new',
        sender: 'bot',
        content: <ArtworkIdentifier onIdentificationComplete={handleIdentification} onIsLoading={handleLoading} />,
        isComponent: true,
      },
    ]);
  };

  const handleTourGeneration = (result: PersonalizedTourOutput) => {
    setMessages(prev => [
      ...prev,
      {
        id: `bot-tour-${Date.now()}`,
        sender: 'bot',
        content: (
          <Card className="animate-in fade-in-50 duration-500">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Your Personalized Tour</CardTitle>
              <CardDescription>Here's a suggested itinerary based on your preferences.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-foreground dark:prose-invert">
                {result.tourDescription.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        ),
      },
       {
            id: 'artwork-identifier-component-new-tour',
            sender: 'bot',
            content: <ArtworkIdentifier onIdentificationComplete={handleIdentification} onIsLoading={handleLoading} />,
            isComponent: true,
        },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: input,
    };
    
    setMessages(prev => [...prev.filter(m => !m.isComponent), userMessage]);

    if (input.toLowerCase().includes('tour')) {
        setMessages(prev => [
            ...prev,
            {
                id: `bot-tour-form-${Date.now()}`,
                sender: 'bot',
                content: <PersonalizedTourGenerator onTourGenerated={handleTourGeneration} onIsLoading={handleLoading} />,
                isComponent: true,
            }
        ]);
    } else {
        // Generic bot response
        const botMessage: Message = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            content: `I'm not sure how to help with that. You can upload an image to identify artwork, or ask me to "create a tour".`,
        };
        setTimeout(() => setMessages(prev => [...prev, botMessage,  {
            id: 'artwork-identifier-component-new-generic',
            sender: 'bot',
            content: <ArtworkIdentifier onIdentificationComplete={handleIdentification} onIsLoading={handleLoading} />,
            isComponent: true,
        }]), 500);
    }
    
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border">
      <div className="flex-1 p-4">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-6 pr-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : ''
                }`}
              >
                {message.sender === 'bot' && (
                  <Avatar className="w-8 h-8 border-2 border-primary">
                    <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                        <Building2 className="w-4 h-4" />
                    </div>
                  </Avatar>
                )}
                <div
                  className={`max-w-md rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background'
                  }`}
                >
                  {message.content}
                </div>
                 {message.sender === 'user' && (
                  <Avatar className="w-8 h-8">
                     <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8 border-2 border-primary">
                    <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                        <Building2 className="w-4 h-4" />
                    </div>
                </Avatar>
                <div className="max-w-md rounded-lg p-3 bg-background">
                    <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Thinking...</span>
                    </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="p-4 border-t bg-background rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'give me a tour' or upload an image..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
