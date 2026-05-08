/* global React, ReactDOM */
const { useState, useEffect, useRef } = React;

const PROMPT_TEXT = "Find 200 cafés in Manhattan with public contact emails and active Instagram pages.";

const PLAN_STEPS = [
  { id: "clarify", label: "Clarify · 2 criteria · 200 target", state: "done" },
  { id: "plan",    label: "Search plan · 4 sources",         state: "done" },
  { id: "discover",label: "Discover · Google + Maps + IG",   state: "run"  },
  { id: "qualify", label: "Qualify · email + IG signals",    state: "run"  },
  { id: "extract", label: "Extract contacts",                 state: "idle"},
];

const RESULTS = [
  { name: "Devoción Roastery",     hood: "SoHo",          email: true,  ig: true,  ok: true  },
  { name: "Felix Roasting Co.",    hood: "NoMad",         email: true,  ig: true,  ok: true  },
  { name: "Stumptown — Ace Hotel", hood: "NoMad",         email: false, ig: true,  ok: false },
  { name: "Bluestone Lane",        hood: "West Village",  email: true,  ig: true,  ok: true  },
  { name: "Abraço",                hood: "East Village",  email: true,  ig: true,  ok: true  },
  { name: "Cafe Integral",         hood: "Nolita",        email: true,  ig: true,  ok: true  },
  { name: "Variety Coffee",        hood: "Chelsea",       email: true,  ig: true,  ok: true  },
  { name: "Joe Coffee Co.",        hood: "Multiple",      email: false, ig: true,  ok: false },
  { name: "Sey Coffee NYC",        hood: "Lower East Side", email: true,  ig: true,  ok: true },
  { name: "Black Fox Coffee",      hood: "FiDi",          email: true,  ig: true,  ok: true  },
  { name: "Maman",                 hood: "TriBeCa",       email: true,  ig: true,  ok: true  },
  { name: "Partners Coffee",       hood: "West Village",  email: true,  ig: true,  ok: true  },
];

function useTyping(text, speed = 32, startDelay = 400) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    let timer;
    const start = setTimeout(function tick() {
      if (i <= text.length) {
        setOut(text.slice(0, i));
        i += 1;
        timer = setTimeout(tick, speed + (Math.random() * 30 - 10));
      } else {
        setDone(true);
      }
    }, startDelay);
    return () => { clearTimeout(start); clearTimeout(timer); };
  }, [text, speed, startDelay]);
  return [out, done];
}

function HeroDemo() {
  const [typed, typingDone] = useTyping(PROMPT_TEXT);
  const [planIdx, setPlanIdx] = useState(0);
  const [shown, setShown] = useState([]);
  const [qualified, setQualified] = useState(0);

  // animate plan chips
  useEffect(() => {
    if (!typingDone) return;
    if (planIdx >= PLAN_STEPS.length) return;
    const t = setTimeout(() => setPlanIdx(planIdx + 1), 420);
    return () => clearTimeout(t);
  }, [typingDone, planIdx]);

  // stream results
  useEffect(() => {
    if (planIdx < 3) return;
    if (shown.length >= RESULTS.length) return;
    const t = setTimeout(() => {
      const next = RESULTS[shown.length];
      setShown(s => [...s, next]);
      if (next.ok) setQualified(q => q + 1);
    }, 520);
    return () => clearTimeout(t);
  }, [planIdx, shown]);

  // approximate "found N of 200"
  const totalQualified = qualified + Math.max(0, shown.filter(r=>r.ok).length === 0 ? 0 : 26);
  const progress = Math.min(100, Math.round((totalQualified / 200) * 100));

  return (
    <div className="demo">
      <div className="demo-bar">
        <div className="dots"><span/><span/><span/></div>
        <div className="label">rally · run #4287 · sourcing</div>
        <div className="status"><span className="pulse"/>live</div>
      </div>

      <div className="demo-prompt">
        <div className="lab">Brief</div>
        <div className="text">
          {typed}
          {!typingDone && <span className="caret"/>}
        </div>
      </div>

      <div className="demo-plan">
        {PLAN_STEPS.map((p, i) => {
          const state =
            i < planIdx ? (p.state === "run" ? "run" : "done") :
            i === planIdx ? "run" : "idle";
          if (state === "idle") return null;
          return (
            <span key={p.id} className={"chip " + (state === "done" ? "done" : "run")}>
              <span className="tick">{state === "done" ? "✓" : "›"}</span>
              {p.label}
            </span>
          );
        })}
      </div>

      <div className="demo-results">
        <div className="demo-results-head">
          <span>Qualified leads</span>
          <span className="count"><em>{totalQualified}</em> of 200</span>
          <span className="progress">
            <span className="bar"><i style={{width: progress + "%"}}/></span>
            <span>{progress}%</span>
          </span>
        </div>
        <ul className="demo-list">
          {shown.slice(-7).map((r, idx) => {
            const realIdx = shown.length - shown.slice(-7).length + idx + 1;
            return (
              <li key={r.name + idx}>
                <div className="num">{String(realIdx + 25).padStart(3, "0")}</div>
                <div className="biz">
                  {r.name}
                  <span className="meta">
                    {r.hood} · {r.email ? <span className="ok">email ✓</span> : <span className="x">no email</span>}
                    {" · "}
                    {r.ig ? <span className="ok">IG ✓</span> : <span className="x">no IG</span>}
                  </span>
                </div>
                {r.ok
                  ? <span className="qual">● qualified</span>
                  : <span className="qual skip">○ skipped</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const heroRoot = document.getElementById("hero-demo");
if (heroRoot) ReactDOM.createRoot(heroRoot).render(<HeroDemo />);
