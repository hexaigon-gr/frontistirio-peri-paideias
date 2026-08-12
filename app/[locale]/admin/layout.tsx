import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { setRequestLocale } from "next-intl/server";

import { AdminHeader } from "@/components/admin/admin-header";
import { AdminProviders } from "@/components/admin/admin-providers";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ErrorPage } from "@/components/error-page";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth/auth";
import { BaseLayoutProps } from "@/types/page-props";

/**
 * Second line of defence behind `robots.txt`.
 *
 * A disallow rule stops a crawl, not an index entry: a URL discovered from a
 * link or a browser toolbar can still be listed with no snippet. This also
 * stops the panel inheriting a canonical from the site pages, since it sits
 * outside the `(site)` group and builds no metadata of its own.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

const AdminLayout = async ({ children, params }: BaseLayoutProps) => {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <ErrorPage
        title="Access Denied"
        description="You are not authorized to access the admin panel. Please sign in with an admin account."
      />
    );
  }

  return (
    <AdminProviders>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="h-svh max-h-svh overflow-hidden">
          <AdminHeader />
          <ScrollArea className="h-0 flex-1">
            <main className="mx-auto max-w-screen-2xl px-4 py-6">
              {children}
            </main>
          </ScrollArea>
        </SidebarInset>
      </SidebarProvider>
    </AdminProviders>
  );
};

export default AdminLayout;
