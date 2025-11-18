"use client";

import { useState } from "react";
import ChatFeed from "./ChatFeed";
import { SessionEvent } from "@/types/events";
import { createRecorder } from "@/lib/recorder";
import { generatePDFReport } from "@/lib/pdf";

export default function RecorderPage() {
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const [recorder, setRecorder] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    const r = createRecorder((ev) => {
      setEvents((prev) => [...prev, ev]);
    });
    r.start();
    setRecorder(r);
    setIsRecording(true);
  };

  const stopRecording = () => {
    recorder?.stop();
    setIsRecording(false);
  };

  const generatePDF = () => {
    generatePDFReport("Session Report", events);
  };

  const clearEvents = () => {
    setEvents([]);
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Browser Session Recorder</h1>

      <div className="flex gap-3">
        {!isRecording ? (
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={startRecording}>
            Start Recording
          </button>
        ) : (
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={stopRecording}>
            Stop Recording
          </button>
        )}

        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={generatePDF}>
          Generate PDF
        </button>

        <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={clearEvents}>
          Clear
        </button>
      </div>

      <ChatFeed events={events} />
    </div>
  );
}
