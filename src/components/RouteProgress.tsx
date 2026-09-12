"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className="h-0.5 bg-primary"
        style={{
          animation: "route-progress 0.5s ease-in-out forwards",
        }}
      />
      <style>{`
        @keyframes route-progress {
          from { transform: scaleX(0); transform-origin: left; opacity: 1; }
          50% { transform: scaleX(1); transform-origin: left; opacity: 1; }
          to { transform: scaleX(0.8); transform-origin: left; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
