import { requireCurrentUser } from "@/lib/auth";
import Sidebar from "@/components/home/Sidebar";
import UserHydrator from "@/components/providers/UserHydrator";
import Header from "@/components/header/header";
import SocketInitializer from "@/components/providers/socketInitializer";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireCurrentUser();

  const navItems = [
    { label: "Home", href: "/home", icon: "home" as const },
    { label: "Messages", href: "/messages", icon: "messages" as const },
    { label: "Profile", href: `/profile/${user.id}`, icon: "profile" as const },
    // { label: "Notifications", href: "/notifications", icon: "notification" as const },
  ];

  return (
    <>
      <UserHydrator user={user} />
      <SocketInitializer/>

      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(89,92,251,0.14),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(173,181,255,0.22),_transparent_30%),linear-gradient(180deg,#f7f4ff_0%,#f2efff_100%)]">
        
        <div className="mx-auto grid max-w-[1440px] gap-2 lg:grid-cols-[260px_minmax(0,1fr)] ">
          
          {/* Sidebar */}
          <aside className="sticky top-0 h-screen">
            <Sidebar items={navItems} />
          </aside>

          {/* Main Content */}
          <div className="min-w-0 ">
            <Header/>
            {children}
          </div>

        </div>
      </main>
    </>
  );
}