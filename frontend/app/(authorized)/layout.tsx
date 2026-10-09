import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import React from "react";

type Props = {
  children: React.ReactNode;
};

const AuthorizedLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex min-h-svh min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center border-b px-4">
          <SidebarTrigger />
        </header>

        <div className="">
          <div className=" p-1 lg:p-2">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AuthorizedLayout;
