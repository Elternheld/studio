"use client";

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const {toast} = useToast();

  const handleSaveProfile = () => {
    // In a real application, you would save this data to a database or user store.
    console.log('Saving profile:', {name, email});
    toast({
      title: "Profile Saved",
      description: `Your profile information has been saved. Name: ${name}, Email: ${email}`,
    });
  };

  return (
    <div className="container py-12">
      <Card className="w-[80%] mx-auto">
        <CardHeader>
          <CardTitle>Profile Einrichten</CardTitle>
          <CardDescription>Richte dein Profil ein.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              placeholder="Dein Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="Deine Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveProfile}>Profil speichern</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
