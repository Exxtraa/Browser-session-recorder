export type EventType =
  | "click"
  | "keypress"
  | "input_commit"
  | "navigation"
  | "visibility";

export interface BaseEvent {
  id: string;
  type: EventType;
  timestamp: number;
  description: string;
  url: string;
}

export interface ClickEvent extends BaseEvent {
  type: "click";
  selector: string;
  clientX: number;
  clientY: number;
  screenshot?: string;
}

export interface KeypressEvent extends BaseEvent {
  type: "keypress";
  key: string;
  important?: boolean;
  screenshot?: string;
}

export interface InputCommitEvent extends BaseEvent {
  type: "input_commit";
  selector: string;
  value: string;
  inputType: string;
  screenshot?: string;
}

export interface NavigationEvent extends BaseEvent {
  type: "navigation";
  from: string;
  to: string;
  screenshot?: string;
}

export interface VisibilityEvent extends BaseEvent {
  type: "visibility";
  state: "hidden" | "visible";
  screenshot?: string;
}

export type SessionEvent =
  | ClickEvent
  | KeypressEvent
  | InputCommitEvent
  | NavigationEvent
  | VisibilityEvent;
