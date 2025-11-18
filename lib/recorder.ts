import { SessionEvent } from "@/types/events";
import { captureScreenshot } from "./screenshot";
import { throttle } from "./throttle";

type EventCallback = (event: SessionEvent) => void;

export function createRecorder(cb: EventCallback) {
  let isRunning = false;

  const screenshotThrottled = throttle(captureScreenshot, 800);

  const clickHandler = async (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target) return;

    const screenshot = await screenshotThrottled();

    cb({
      id: crypto.randomUUID(),
      type: "click",
      timestamp: Date.now(),
      description: `Clicked ${target.tagName}`,
      selector: getSelector(target),
      clientX: e.clientX,
      clientY: e.clientY,
      screenshot,
      url: location.href,
    });
  };

  const keyHandler = async (e: KeyboardEvent) => {
    if (!e.key) return;

    const important = ["Enter", "Escape", "Tab", " "].includes(e.key);
    const screenshot = important ? await screenshotThrottled() : undefined;

    cb({
      id: crypto.randomUUID(),
      type: "keypress",
      timestamp: Date.now(),
      description: `Key pressed: ${e.key}`,
      key: e.key,
      important,
      screenshot,
      url: location.href,
    });
  };

  const inputCommit = async (el: HTMLElement) => {
    if (!el) return;

    // Skip passwords
    if ((el as HTMLInputElement).type === "password") return;

    const value =
      (el as HTMLInputElement).value ||
      (el as HTMLElement).innerText ||
      "";

    if (!value.trim()) return;

    const screenshot = await screenshotThrottled();

    cb({
      id: crypto.randomUUID(),
      type: "input_commit",
      timestamp: Date.now(),
      description: `Input commit on ${el.tagName}`,
      selector: getSelector(el),
      value,
      inputType: el.tagName.toLowerCase(),
      screenshot,
      url: location.href,
    });
  };

  const blurHandler = (e: FocusEvent) => {
    inputCommit(e.target as HTMLElement);
  };

  const submitHandler = (e: Event) => {
    const form = e.target as HTMLFormElement;
    let value = "";
    new FormData(form).forEach((v, k) => (value += `${k}: ${v} `));
    inputCommit(form);
  };

  // SPA Navigation detection
  const navHandler = async () => {
    const screenshot = await screenshotThrottled();
    cb({
      id: crypto.randomUUID(),
      type: "navigation",
      timestamp: Date.now(),
      description: `Navigation detected`,
      from: document.referrer,
      to: location.href,
      screenshot,
      url: location.href,
    });
  };

  const visibilityHandler = async () => {
    const state = document.visibilityState;

    const screenshot = state === "visible" ? await screenshotThrottled() : undefined;

    cb({
      id: crypto.randomUUID(),
      type: "visibility",
      timestamp: Date.now(),
      description: `Tab is now ${state}`,
      state,
      screenshot,
      url: location.href,
    });
  };

  // Utility: selector generator
  const getSelector = (el: Element | null) => {
    if (!el) return "";
    if (el.id) return `#${el.id}`;
    const path = [];
    while (el && el.tagName !== "BODY") {
      let sel = el.tagName.toLowerCase();
      if (el.className) sel += "." + el.className.split(" ")[0];
      path.unshift(sel);
      el = el.parentElement!;
    }
    return path.join(" > ");
  };

  return {
    start() {
      if (isRunning) return;
      isRunning = true;

      document.addEventListener("click", clickHandler, true);
      document.addEventListener("keydown", keyHandler, true);
      document.addEventListener("blur", blurHandler, true);
      document.addEventListener("submit", submitHandler, true);
      document.addEventListener("visibilitychange", visibilityHandler, true);

      // SPA patch
      const push = history.pushState;
      history.pushState = function (...args) {
        push.apply(history, args);
        navHandler();
      };

      window.addEventListener("popstate", navHandler);
    },

    stop() {
      if (!isRunning) return;
      isRunning = false;

      document.removeEventListener("click", clickHandler, true);
      document.removeEventListener("keydown", keyHandler, true);
      document.removeEventListener("blur", blurHandler, true);
      document.removeEventListener("submit", submitHandler, true);
      document.removeEventListener("visibilitychange", visibilityHandler, true);
      window.removeEventListener("popstate", navHandler);
    },
  };
}
