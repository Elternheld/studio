"use client";

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useToast} from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import Link from "next/link";

const ProfilePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const {toast} = useToast();

  const onSubmit = (data: any) => {
    // Here, you can handle the form submission, like sending data to an API
    console.log("Form Data", data);
    toast({
      title: "Profile Saved",
      description: `Your profile information has been saved.`,
    });
  };

  return (
    <div className="container py-12">
      <Card className="w-[80%] mx-auto">
        <CardHeader>
          <CardTitle>Profil Einrichten</CardTitle>
          <CardDescription>Richte dein Profil ein.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                placeholder="Dein Name"
                {...register("name", { required: "Name is required" })}
              />
                {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Deine Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
              />
                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
            </div>
            <div>
              <Label htmlFor="address">Adresse (optional)</Label>
              <Input
                type="text"
                id="address"
                placeholder="Deine Adresse"
                {...register("address")}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefonnummer (optional)</Label>
              <Input
                type="tel"
                id="phone"
                placeholder="Deine Telefonnummer"
                {...register("phone", {
                  pattern: {
                    value: /^[0-9+-]*$/,
                    message: "Invalid phone number format",
                  },
                })}
              />
                {errors.phone && (
                    <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
            </div>
            <div>
              <Label htmlFor="password">Passwort</Label>
              <Input
                type="password"
                id="password"
                placeholder="Passwort"
                {...register("password", { required: "Password is required", minLength: {value: 8, message: "Password must be at least 8 characters"} })}
              />
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
            </div>
            <Button type="submit">Profil speichern</Button>
            <Link href="/forgot-password" className="text-sm text-gray-500">
              Passwort vergessen?
            </Link>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
