import React from "react";
import { clsx } from "clsx";

type TabsProps<T extends string> = {
  tabs: T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
};

export default function Tabs<T extends string>(props: TabsProps<T>) {
  return (
    <div role="tablist" className="tabs tabs-sm">
      {props.tabs.map((tab) => (
        <button
          key={tab}
          role="tab"
          type="button"
          className={clsx(
            "tab rounded-sm border-1 border-b-0 !rounded-b-none after:absolute after:top-full after:h-[3px] after:w-full ",
            props.activeTab === tab &&
              "tab-active border-base-content/20 after:bg-base-100"
          )}
          onClick={() => props.onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
