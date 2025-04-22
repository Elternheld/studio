"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContentPage() {
  return (
    <div className="container py-12">
      <Card className="w-[80%] mx-auto">
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>Manage all the content for your website here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>This section is under construction.  Functionality to manage website content will be added here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
