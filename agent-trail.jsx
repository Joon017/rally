/* global React, ReactDOM */
const { useState: useState2, useEffect: useEffect2, useRef: useRef2 } = React;

const TRAIL_LINES = [
  { ts: "00:00:01", k: "init",     body: <><span className="tag">[plan]</span> goal=200 · criteria=[public_email, instagram_active] · scope=Manhattan</>},
  { ts: "00:00:02", k: "src",      body: <><span className="tag">[search]</span> google · "specialty cafe manhattan" · <span className="src">12 sources</span></>},
  { ts: "00:00:04", k: "src",      body: <><span className="tag">[maps]</span>   region=10003 · <span className="src">142 candidates</span></>},
  { ts: "00:00:06", k: "src",      body: <><span className="tag">[dir]</span>    eater.com · timeoutnyc · <span className="src">+38 candidates</span></>},
  { ts: "00:00:09", k: "fetch",    body: <><span className="ind">→</span> <span className="url">devocion.com/contact</span> · email <span className="ok">✓</span> · ig <span className="ok">✓</span></>},
  { ts: "00:00:10", k: "fetch",    body: <><span className="ind">→</span> <span className="url">felixroasting.com</span> · email <span className="ok">✓</span> · ig <span className="ok">✓</span></>},
  { ts: "00:00:11", k: "fetch",    body: <><span className="ind">→</span> <span className="url">stumptown/ace</span> · email <span className="skip">×</span> · <span className="skip">skip — no public email</span></>},
  { ts: "00:00:13", k: "fetch",    body: <><span className="ind">→</span> <span className="url">bluestonelane.com</span> · email <span className="ok">✓</span> · ig <span className="ok">✓</span></>},
  { ts: "00:00:14", k: "expand",   body: <><span className="tag">[expand]</span> reddit r/nyccoffee · timeoutnyc/best-cafes · <span className="src">+24</span></>},
  { ts: "00:00:16", k: "fetch",    body: <><span className="ind">→</span> <span className="url">abraco.nyc</span> · email <span className="ok">✓</span> · ig <span className="ok">✓</span></>},
  { ts: "00:00:18", k: "dedupe",   body: <><span className="tag">[dedupe]</span> 11 duplicates removed across maps + dir</>},
  { ts: "00:00:21", k: "fetch",    body: <><span className="ind">→</span> <span className="url">cafeintegral.com</span> · email <span className="ok">✓</span> · ig <span className="ok">✓</span></>},
  { ts: "00:00:23", k: "retry",    body: <><span className="tag">[retry]</span>  blackfoxcoffee.com · 502 · backoff 800ms</>},
  { ts: "00:00:24", k: "fetch",    body: <><span className="ind">→</span> <span className="url">blackfoxcoffee.com</span> · email <span className="ok">✓</span> · ig <span className="ok">✓</span></>},
  { ts: "00:00:26", k: "qual",     body: <><span className="tag">[qualify]</span> 47 of 184 inspected · <span className="ok">37 qualified</span></>},
  { ts: "00:00:28", k: "expand",   body: <><span className="tag">[expand]</span> niche · "third wave coffee NYC" · <span className="src">+18</span></>},
  { ts: "00:00:31", k: "fetch",    body: <><span className="ind">→</span> <span className="url">seycoffee.com</span> · email <span className="ok">✓</span> · ig <span className="ok">✓</span></>},
  { ts: "00:00:33", k: "fetch",    body: <><span className="ind">→</span> <span className="url">partnerscoffee.com</span> · email <span className="ok">✓</span> · ig <span className="ok">✓</span></>},
];

function AgentTrail() {
  const [lines, setLines] = useState2([]);
  const [tick, setTick] = useState2(0);
  const ref = useRef2(null);

  useEffect2(() => {
    if (lines.length >= TRAIL_LINES.length) {
      const t = setTimeout(() => { setLines([]); setTick(x=>x+1); }, 3500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setLines(L => [...L, TRAIL_LINES[L.length]]);
    }, 480 + Math.random() * 220);
    return () => clearTimeout(t);
  }, [lines, tick]);

  useEffect2(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);

  return (
    <div className="trail" ref={ref}>
      <div className="head">
        <span className="pulse"/>
        <span>sourcing trail · run #4287 · live</span>
      </div>
      <div className="trail-stream">
        {lines.map((l, i) => (
          <div key={i + "-" + tick}>
            <span className="ts">{l.ts}</span>{"  "}{l.body}
          </div>
        ))}
        <div><span className="ts">{lines.length ? lines[lines.length-1].ts : "00:00:00"}</span>{"  "}<span className="tag">▌</span></div>
      </div>
    </div>
  );
}

function Coverage() {
  const [pct, setPct] = useState2({ google: 14, maps: 28, dirs: 12, social: 6, niche: 0 });
  const [stats, setStats] = useState2({ inspected: 47, qualified: 37, retries: 3, dedup: 11 });

  useEffect2(() => {
    const t = setInterval(() => {
      setPct(p => ({
        google: Math.min(96, p.google + 6 + Math.random()*4),
        maps:   Math.min(88, p.maps   + 5 + Math.random()*3),
        dirs:   Math.min(74, p.dirs   + 4 + Math.random()*3),
        social: Math.min(62, p.social + 3 + Math.random()*4),
        niche:  Math.min(48, p.niche  + 2 + Math.random()*4),
      }));
      setStats(s => ({
        inspected: s.inspected + Math.floor(2 + Math.random()*4),
        qualified: s.qualified + Math.floor(1 + Math.random()*2),
        retries:   s.retries   + (Math.random() < 0.2 ? 1 : 0),
        dedup:     s.dedup     + Math.floor(Math.random()*2),
      }));
    }, 1100);
    return () => clearInterval(t);
  }, []);

  // reset after large
  useEffect2(() => {
    if (stats.inspected > 380) {
      setStats({ inspected: 47, qualified: 37, retries: 3, dedup: 11 });
      setPct({ google: 14, maps: 28, dirs: 12, social: 6, niche: 0 });
    }
  }, [stats.inspected]);

  const rows = [
    ["Google Search",   pct.google],
    ["Google Maps",     pct.maps],
    ["Directories",     pct.dirs],
    ["Social platforms",pct.social],
    ["Niche listings",  pct.niche],
  ];

  return (
    <div className="coverage">
      <div>
        <div className="s-num" style={{marginBottom: 8}}>Sourcing coverage</div>
        <h4>Tracked across the run.</h4>
      </div>
      <div style={{display:"grid", gap: 10}}>
        {rows.map(([label, v]) => (
          <div className="row" key={label}>
            <div className="lab">{label}</div>
            <div className="bar"><i style={{width: v + "%"}}/></div>
            <div className="val">{Math.round(v)}%</div>
          </div>
        ))}
      </div>
      <div className="stat-grid">
        <div className="stat"><div className="k">Pages inspected</div><div className="v">{stats.inspected}</div></div>
        <div className="stat"><div className="k">Qualified</div><div className="v" style={{color:"#1d7a4a"}}>{stats.qualified}<small>/ 200 goal</small></div></div>
        <div className="stat"><div className="k">Retries</div><div className="v">{stats.retries}</div></div>
        <div className="stat"><div className="k">Duplicates removed</div><div className="v">{stats.dedup}</div></div>
      </div>
    </div>
  );
}

const trailRoot = document.getElementById("agent-trail");
if (trailRoot) ReactDOM.createRoot(trailRoot).render(<AgentTrail />);
const coverageRoot = document.getElementById("agent-coverage");
if (coverageRoot) ReactDOM.createRoot(coverageRoot).render(<Coverage />);
