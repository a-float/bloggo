import clsx from "clsx";
import { ToolbarAction, EditorAction } from "./Toolbar";

export function ToolbarItem(props: {
  action: ToolbarAction;
  createClickHandler: (action: EditorAction) => () => void;
}) {
  if (props.action.action) {
    return (
      <div className="md:tooltip" data-tip={props.action.tip}>
        <button
          className={clsx("btn btn-soft btn-xs btn-square")}
          type="button"
          onClick={props.createClickHandler(props.action.action)}
        >
          {props.action.icon}
        </button>
      </div>
    );
  }
  return (
    <div className="dropdown dropdown-center">
      <div className="md:tooltip" data-tip={props.action.tip}>
        <div
          tabIndex={0}
          role="button"
          className={clsx("btn btn-soft btn-xs btn-square")}
        >
          {props.action.icon}
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu dropdown-content bg-base-100 rounded-box z-1 min-w-36 p-2 shadow-sm"
      >
        {props.action.children?.map((child, idx) => (
          <li key={idx}>
            <a
              className="gap-3"
              onClick={props.createClickHandler(child.action)}
            >
              {child.icon} <span>{child.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
