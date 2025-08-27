// src/App.jsx
import React from 'react';
import ROIWorksheet from './components/ROIWorksheet';
import AIHQ from './components/AIHQ';
import './index.css';

export default function App() {
  return (
    <div style={{ maxWidth: 1100, margin: '24px auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Lane AI</h1>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20 }}>
        <section>
          <ROIWorksheet />
        </section>

        <aside style={{ background: '#fafafa', padding: 12, borderRadius: 8 }}>
          <AIHQ ventureId={null} />
        </aside>
      </main>
    </div>
  );
}
