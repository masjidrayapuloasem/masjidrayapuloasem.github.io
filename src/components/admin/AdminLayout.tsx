import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminGuard } from "./AdminGuard";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/30">
        <AdminSidebar />
        <main className="md:ml-64 p-4 md:p-8 pt-16 md:pt-8">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
