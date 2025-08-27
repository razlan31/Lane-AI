import React from 'react';

// Import all components
import Dashboard from "./components/Dashboard.jsx";
import Notes from "./components/Notes.jsx";
import Chat from "./components/Chat.jsx";
import Workspace from "./components/Workspace.jsx";
import Worksheet from "./components/Worksheet.jsx";
import AIHQ from "./components/AIHQ.jsx";
import Onboarding from "./components/Onboarding.jsx";
import FounderMode from "./components/FounderMode.jsx";
import MultiViewToggle from "./components/MultiViewToggle.jsx";
export default function App() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
        🚀 LaneAI Component Showcase
      </h1>
      <div className="space-y-8">
        <section className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
          <Dashboard />
        </section>
        <section className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold mb-2">Notes</h2>
          <Notes />
        </section>
        <section className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold mb-2">Chat</h2>
          <Chat />
        </section>
        <section className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold mb-2">Workspace</h2>
          <Workspace />
        </section>
        <section className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold mb-2">Worksheet</h2>
          <Worksheet />
        </section>
        <section className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold mb-2">AIHQ</h2>
          <AIHQ />
        </section>
        <section className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold mb-2">Onboarding</h2>
          <Onboarding />
        </section>
        <section className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold mb-2">Founder Mode</h2>
          <FounderMode />
        </section>
        <section className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold mb-2">MultiView Toggle</h2>
          <MultiViewToggle />
        </section>
      </div>
    </div>
  );
}
