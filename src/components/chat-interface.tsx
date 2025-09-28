
'use client';

import { useState, useRef, useEffect, ReactNode, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Send, Landmark, Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { identifyArtwork, type IdentifyArtworkOutput } from '@/ai/flows/artwork-identification';
import { ArtworkCard } from './artwork-card';
import { PersonalizedTourGenerator } from './personalized-tour-generator';
import type { PersonalizedTourOutput } from '@/ai/flows/personalized-tour-generation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Add initial welcome message
    setMessages([
        {
            id: 'welcome',
            sender: 'bot',
            content: (
                <div className="space-y-2">
                    <p className="font-bold text-lg">Welcome to the Lords Museum!</p>
                    <p>I am your personal guide. How can I assist you today?</p>
                    <p className="text-sm text-muted-foreground">You can ask me things like:</p>
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                       <Button size="sm" variant="outline" onClick={() => handleQuickAction('Create a tour for me')}>Create a 1-hour tour</Button>
                       <Button size="sm" variant="outline" onClick={() => handleQuickAction('Tell me about the Mona Lisa')}>Info on Mona Lisa</Button>
                    </div>
                </div>
            )
        },
    ]);
  }, []);

  const handleQuickAction = (actionText: string) => {
    setInput(actionText);
    // We create a synthetic event to pass to handleSubmit
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
     // A short delay to allow the input state to update before submitting
    setTimeout(() => handleSubmit(fakeEvent, actionText), 100);
  }

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleImage(selectedFile);
    }
  };

  const handleImage = async (file: File) => {
    setIsLoading(true);
    setMessages(prev => prev.filter(m => !m.isComponent));

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      try {
        const identificationResult = await identifyArtwork({ photoDataUri });
        handleIdentification(identificationResult, photoDataUri);
      } catch (error) {
        console.error("Artwork identification failed:", error);
        toast({
          title: "Identification Failed",
          description: "Could not identify the artwork. Please try another image.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({
          title: "File Read Error",
          description: "There was an issue reading your image file. Please try again.",
          variant: "destructive",
        });
        setIsLoading(false);
    };
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
    ]);
  };

  const handleTourGeneration = (result: PersonalizedTourOutput) => {
    setIsLoading(false);
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
    ]);
  };

  const handleSubmit = (e: React.FormEvent, actionText?: string) => {
    e.preventDefault();
    const currentInput = actionText || input;
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: currentInput,
    };
    
    setMessages(prev => [...prev.filter(m => !m.isComponent), userMessage]);

    if (currentInput.toLowerCase().includes('tour')) {
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
        // Generic bot response for now, can be replaced with an AI call
        const botMessage: Message = {
            id: `bot-${Date.now()}`,
            sender: 'bot',
            content: `I'm not sure how to help with that. You can upload an image to identify artwork, or ask me to "create a tour".`,
        };
        setTimeout(() => setMessages(prev => [...prev, botMessage]), 500);
    }
    
    setInput('');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border">
       <Input 
          id="artwork-image-chat" 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden"
          ref={fileInputRef}
          disabled={isLoading}
        />
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
                        <Landmark className="w-4 h-4" />
                    </div>
                  </Avatar>
                )}
                <div
                  className={`max-w-xl rounded-lg px-4 py-3 shadow-sm ${
                    message.isComponent ? 'bg-transparent shadow-none p-0' : 
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-background rounded-bl-none'
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
                        <Landmark className="w-4 h-4" />
                    </div>
                </Avatar>
                <div className="max-w-md rounded-lg p-3 bg-background rounded-bl-none shadow-sm">
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
      <div className="p-4 border-t bg-background/80 backdrop-blur-sm rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Button type="button" variant="ghost" size="icon" onClick={handleUploadClick} disabled={isLoading}>
            <Upload className="w-5 h-5" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about art, or request a tour..."
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
