import React from "react";

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
          className={`tab input-border-radius ${props.activeTab === tab ? "tab-active" : ""}`}
          onClick={() => props.onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
