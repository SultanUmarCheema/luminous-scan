import { ReactNode } from "react";
import Sidebar from "./Sidebar";

const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex h-screen overflow-hidden bg-background">
    <Sidebar />
    <main className="flex-1 overflow-y-auto grid-bg relative scanlines">{children}</main>
  </div>
);

export default AppLayout;
