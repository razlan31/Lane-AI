import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AIHQ({ ventureId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      const q = supabase
        .from('timeline_events')
        .select('id,venture_id,user_id,kind,title,body,payload,created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      const { data, error } = await q;
      if (error) {
        console.error('AIHQ load error', error);
        if (mounted) setLoading(false);
        return;
      }
      if (mounted) {
        setEvents(data || []);
        setLoading(false);
      }
    }

    load();

    const channel = supabase.channel('public:timeline_events')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'timeline_events' }, payload => {
        setEvents(prev => [payload.new, ...prev].slice(0, 200));
      })
      .subscribe();

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, [ventureId]);

  return (
    <div style={{ padding: 16 }}>
      <h3>AI HQ — Timeline</h3>
      {loading && <div>Loading...</div>}
      {!loading && events.length === 0 && <div>No timeline events yet.</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map(ev => (
          <li key={ev.id} style={{ padding: 10, borderBottom: '1px solid #eee' }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              {ev.title} <span style={{ color: '#666', fontWeight: 400 }}>— {ev.kind}</span>
            </div>
            <div style={{ fontSize: 12, color: '#333', marginTop: 6 }}>{ev.body}</div>
            <details style={{ marginTop: 8 }}>
              <summary style={{ fontSize: 12, color: '#666' }}>Payload & metadata</summary>
              <pre style={{ maxHeight: 240, overflow: 'auto', background: '#f7f7f7', padding: 8 }}>
                {JSON.stringify(ev.payload || {}, null, 2)}
              </pre>
              <div style={{ fontSize: 11, color: '#888', marginTop: 6 }}>{new Date(ev.created_at).toLocaleString()}</div>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
