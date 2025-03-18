import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@components/components/ui/avatar";
import Header from "@components/Header/Header";
import type React from "react";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray100">
      <Header title={`Dashboard`} transparent />
      <main className="p-6">{children}</main>
    </div>
  );
}
