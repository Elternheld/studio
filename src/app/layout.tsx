'use client';

import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import {Toaster} from "@/components/ui/toaster"
import {Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarInset} from "@/components/ui/sidebar";
import {Home, Users, Settings, User, KeyRound, FileText, Activity} from "lucide-react";
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ApiKeyProvider} from '@/components/ApiKeyContext';
import React, {useState, useEffect} from 'react';
import {metadata} from './metadata';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// export {metadata};

const SidebarHeader = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex items-center justify-between p-4">
      {children}
    </div>
  )
}

// Placeholder for authentication (replace with actual logic)
const getUserRoleFromLocalStorage = () => {
  if (typeof window === 'undefined') {
    return 'customer';
  }
  return localStorage.getItem('userRole') || 'customer';
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ApiKeyProvider>
            <SidebarProvider>
              <Sidebar>
                <SidebarHeader>
                  <SidebarTrigger />
                </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/dashboard" className="flex items-center">
                            <Home className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/community" className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            <span>Community</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/activities" className="flex items-center">
                            <Activity className="mr-2 h-4 w-4" />
                            <span>Aktivitätenfortschritt</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/use-case-1" className="flex items-center">
                            <Activity className="mr-2 h-4 w-4" />
                            <span>Use Case 1 - Ideenfinder Aktivitäten</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                          <Link href="/profile" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profil</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroup>

                  <ApiKeySection/>

                  <AdminSection/>

                  <ServiceSection/>
                </SidebarContent>
                <SidebarFooter>
                  <p className="text-center text-xs">
                    © {new Date().getFullYear()} ElternHeld. All rights reserved.
                  </p>
                </SidebarFooter>
              </Sidebar>
              <SidebarInset>
                <div className="absolute top-2 right-2">
                  <AccountDropdown />
                </div>
                {children}
                <Toaster />
              </SidebarInset>
            </SidebarProvider>
        </ApiKeyProvider>
      </body>
    </html>
  );
}


//Created as a component, so it can become interactive
const AccountDropdown = () => {
    'use client';

  const [userRole, setUserRole] = React.useState<string>('customer');

  React.useEffect(() => {
    localStorage.setItem('userRole', userRole);
  }, [userRole]);

  const handleRoleChange = (newRole: string) => {
    setUserRole(newRole);
  };
  return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleRoleChange('customer')}>
            Customer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoleChange('admin')}>
            Admin
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRoleChange('service')}>
            Service
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

const ApiKeySection = () => {
  const userRole = (typeof window !== 'undefined') ? localStorage.getItem('userRole') || 'customer' : 'customer';

  if (userRole === 'customer') {
      return (
          <SidebarGroup>
              <SidebarGroupLabel>Customer Account</SidebarGroupLabel>
              <SidebarMenu>
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                          <Link href="/community" className="flex items-center">
                              <Users className="mr-2 h-4 w-4" />
                              <span>Community</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                          <Link href="/activities" className="flex items-center">
                              <Activity className="mr-2 h-4 w-4" />
                              <span>Aktivitätenfortschritt</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                          <Link href="/profile" className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              <span>Profil</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
          </SidebarGroup>
      );
  }
  return null;
};

const AdminSection = () => {
  const userRole = (typeof window !== 'undefined') ? localStorage.getItem('userRole') || 'customer' : 'customer';

  if (userRole === 'admin') {
      return (
          <SidebarGroup>
              <SidebarGroupLabel>Admin Account</SidebarGroupLabel>
              <SidebarMenu>
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                          <Link href="/api-manager" className="flex items-center">
                              <KeyRound className="mr-2 h-4 w-4" />
                              <span>API Manager</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                          <Link href="/content" className="flex items-center">
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Content</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                          <Link href="/frontend-assets" className="flex items-center">
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Ablage für Frontend</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                          <Link href="/tools" className="flex items-center">
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Admin Tools</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
          </SidebarGroup>
      );
  }
  return null;
};

const ServiceSection = () => {
  const userRole = (typeof window !== 'undefined') ? localStorage.getItem('userRole') || 'customer' : 'customer';
  if (userRole === 'service') {
      return (
          <SidebarGroup>
              <SidebarGroupLabel>Service Account</SidebarGroupLabel>
              <SidebarMenu>
                  <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                          <Link href="/service" className="flex items-center">
                              <Settings className="mr-2 h-4 w-4" />
                              <span>Service Tools</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
          </SidebarGroup>
      );
  }
  return null;
};

