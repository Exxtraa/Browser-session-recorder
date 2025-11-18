"use client";

import ChatItem from "./ChatItem";
import { SessionEvent } from "@/types/events";

export default function ChatFeed({ events }: { events: SessionEvent[] }) {
  return (
    <div className="space-y-3 overflow-y-auto max-h-[80vh] p-3 bg-gray-50 rounded">
      {events.map((ev) => (
        <ChatItem key={ev.id} ev={ev} />
      ))}
    </div>
  );
}
