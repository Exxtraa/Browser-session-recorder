"use client";

import { SessionEvent } from "@/types/events";

export default function ChatItem({ ev }: { ev: SessionEvent }) {
  return (
    <div className="border p-3 rounded bg-white shadow-sm">
      <p className="text-xs text-gray-500">
        {new Date(ev.timestamp).toLocaleTimeString()} — {ev.type}
      </p>

      <p className="font-medium">{ev.description}</p>

      {"value" in ev && ev.value ? (
        <div className="text-xs bg-gray-100 p-2 rounded my-1">{ev.value}</div>
      ) : null}

      {ev.screenshot ? (
        <img
          src={ev.screenshot}
          className="mt-2 w-40 border cursor-pointer"
        />
      ) : null}
    </div>
  );
}
