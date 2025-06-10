import React from "react";

export function Drawer(props: {
  drawerId: string;
  children: React.ReactNode;
  drawerContent: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`drawer drawer-end z-1 ${props.className || ""}`}>
      <input id={props.drawerId} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">{props.children}</div>
      <div className="drawer-side">
        <label
          htmlFor={props.drawerId}
          aria-label="close sidebar"
          className="drawer-overlay"
        />
        <div className="bg-base-200 text-base-content min-h-full w-80">
          {props.drawerContent}
        </div>
      </div>
    </div>
  );
}

export function DrawerToggle(props: {
  children: React.ReactNode;
  drawerId: string;
  className?: string;
}) {
  return (
    <label htmlFor={props.drawerId} className={props.className} tabIndex={0}>
      {props.children}
    </label>
  );
}
