"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Home, Compass, PlusCircle, ArrowLeftRight, User } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    {
      label: "Beranda",
      href: "/",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      label: "Katalog",
      href: "/catalog",
      icon: Compass,
      isActive: pathname.startsWith("/catalog") || pathname.startsWith("/item"),
    },
    {
      label: "Unggah",
      href: session ? "/dashboard/upload" : "/login",
      icon: PlusCircle,
      isActive: pathname === "/dashboard/upload",
      isPrimary: true,
    },
    {
      label: "Swap",
      href: session ? "/dashboard/requests" : "/login",
      icon: ArrowLeftRight,
      isActive: pathname.startsWith("/dashboard/requests"),
    },
    {
      label: session ? "Akun" : "Masuk",
      href: session ? "/dashboard" : "/login",
      icon: User,
      isActive: pathname === "/dashboard" || pathname === "/login" || pathname === "/register",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 block md:hidden border-t border-slate-200/80 bg-white/95 px-3 py-1.5 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          if (item.isPrimary) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group -mt-5 flex flex-col items-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition-transform active:scale-90 group-hover:scale-105">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="mt-1 text-[11px] font-semibold text-emerald-700">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center py-1 px-2.5 transition-colors ${
                item.isActive
                  ? "text-emerald-600 font-semibold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className={`h-5 w-5 ${item.isActive ? "stroke-[2.5]" : "stroke-2"}`} />
              <span className="mt-1 text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
