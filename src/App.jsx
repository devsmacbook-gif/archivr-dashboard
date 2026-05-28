import { useState, useEffect } from "react";

const API_BASE = "https://your-app.railway.app"; // ← replace after deploy

const BRANDS = ["Stone Island","Prada","Nike","Oakley","Helmut Lang","Raf Simons","CP Company","Polo Sport","Undercover","Dolce Gabbana","Versace","Diesel","Moncler","Arc'teryx"];

// ─── API HELPERS ──────────────────────────────────────────────────────────────

async function api(path, opts = {}, token = null) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  return res;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 4, color: "#e8e8e0", lineHeight: 1 }}>ARCHIVR</div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 3, color: "#00ff88", textTransform: "uppercase" }}>Archive Sourcing Intelligence</div>
    </div>
  );
}

function PulsingDot() {
  return (
    <div style={{
      width: 7, height: 7, borderRadius: "50%", background: "#00ff88",
      boxShadow: "0 0 7px #00ff88",
      animation: "pulse 2s infinite",
    }} />
  );
}

function Pill({ children, color = "#00ff88" }) {
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace", fontSize: 8, letterSpacing: 2,
      color, border: `1px solid ${color}40`, background: `${color}10`,
      padding: "3px 8px", borderRadius: 2, textTransform: "uppercase",
    }}>
      {children}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#111", border: "1px solid #1e1e1e",
      borderRadius: 4, padding: 24, ...style,
    }}>
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <div style={{
      fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: 3,
      color: "#3a3a3a", textTransform: "uppercase", marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

function Input({ style = {}, ...props }) {
  return (
    <input style={{
      background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 3,
      padding: "10px 14px", fontFamily: "'DM Sans', sans-serif",
      fontSize: 13, color: "#e8e8e0", outline: "none", width: "100%",
      ...style,
    }} {...props} />
  );
}

function Btn({ children, variant = "primary", style = {}, ...props }) {
  const base = {
    border: "none", padding: "13px 24px", cursor: "pointer",
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3,
    borderRadius: 2, transition: "all 0.15s", ...style,
  };
  const variants = {
    primary:  { background: "#e8e8e0", color: "#0a0a0a" },
    green:    { background: "#00ff88", color: "#0a0a0a" },
    ghost:    { background: "transparent", color: "#555", border: "1px solid #222" },
    danger:   { background: "transparent", color: "#ff4444", border: "1px solid #ff444430" },
  };
  return <button style={{ ...base, ...variants[variant] }} {...props}>{children}</button>;
}

function ScoreBar({ label, value }) {
  const color = value >= 75 ? "#00ff88" : value >= 50 ? "#ffd700" : "#ff4444";
  return (
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#444", letterSpacing: 1 }}>{label}</span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#888" }}>{value}</span>
      </div>
      <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2 }}>
        <div style={{ height: "100%", width: `${value}%`, background: color, borderRadius: 2, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function LandingPage({ onSubscribe }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubscribe = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await api("/checkout", {
        method: "POST",
        body: JSON.stringify({
          email,
          success_url: window.location.origin + "/dashboard",
          cancel_url: window.location.origin,
        }),
      });
      const data = await res.json();
      if (data.checkout_url) window.location.href = data.checkout_url;
    } catch (e) {
      alert("Something went wrong. Try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e0", padding: "0 40px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #2a2a2a !important; }
        input:focus { border-color: #333 !important; }
        body { background: #0a0a0a; }
      `}</style>

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "28px 0", borderBottom: "1px solid #1a1a1a" }}>
        <Logo />
        <Btn variant="ghost" onClick={() => onSubscribe("login")} style={{ fontSize: 14 }}>SIGN IN</Btn>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 760, margin: "80px auto 0", textAlign: "center" }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, color: "#00ff88", marginBottom: 20 }}>
          AI-POWERED ARCHIVE SOURCING
        </div>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 72, letterSpacing: 4, lineHeight: 1, color: "#e8e8e0", marginBottom: 24 }}>
          FIND THE DEAL<br />BEFORE ANYONE ELSE
        </div>
        <div style={{ fontSize: 16, color: "#666", lineHeight: 1.8, marginBottom: 48, maxWidth: 520, margin: "0 auto 48px" }}>
          Chrome extension + 24/7 autonomous scraper that analyses every 2000s archive listing on eBay, Depop, Grailed, Yahoo Japan and more. Instant flip score, profit estimate, and Telegram alerts.
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 14 }}>
          <Input
            placeholder="your@email.com"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubscribe()}
            style={{ width: 280 }}
          />
          <Btn variant="green" onClick={handleSubscribe} disabled={loading} style={{ padding: "13px 28px", opacity: loading ? 0.6 : 1 }}>
            {loading ? "LOADING..." : "START — £20/MO"}
          </Btn>
        </div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#2a2a2a", letterSpacing: 1 }}>
          CANCEL ANYTIME · NO API KEY NEEDED · CHROME EXTENSION INCLUDED
        </div>
      </div>

      {/* Features */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, maxWidth: 900, margin: "80px auto" }}>
        {[
          ["BROWSER EXTENSION", "One click analysis on any listing. eBay, Depop, Grailed, Yahoo JP, Sendico, Mercari."],
          ["24/7 AUTONOMOUS SCRAPER", "Monitors eBay & Vinted RSS feeds while you sleep. Telegram alert when a deal drops."],
          ["JAPAN ARBITRAGE", "Flags items priced low on Japanese markets that flip high in the UK/EU."],
        ].map(([title, desc]) => (
          <Card key={title}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 2, color: "#00ff88", marginBottom: 10 }}>{title}</div>
            <div style={{ fontSize: 13, color: "#555", lineHeight: 1.7 }}>{desc}</div>
          </Card>
        ))}
      </div>

      {/* Brands */}
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <Label>Tracked Brands Include</Label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 700, margin: "0 auto" }}>
          {BRANDS.map(b => <Pill key={b}>{b}</Pill>)}
        </div>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pass) return;
    setLoading(true);
    setError("");
    try {
      const res  = await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password: pass }) });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Login failed."); setLoading(false); return; }
      onLogin(data.access_token, data.user);
    } catch {
      setError("Connection failed. Check your internet.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap'); *{box-sizing:border-box;margin:0;padding:0} input::placeholder{color:#2a2a2a!important} input:focus{border-color:#333!important} body{background:#0a0a0a}`}</style>
      <div style={{ width: 380 }}>
        <Logo />
        <Card style={{ marginTop: 32 }}>
          <Label>Sign In</Label>
          {error && <div style={{ background: "#1a0a0a", border: "1px solid #ff444430", borderRadius: 3, padding: "10px 12px", color: "#ff4444", fontSize: 12, marginBottom: 14 }}>{error}</div>}
          <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ marginBottom: 10 }} />
          <Input placeholder="Password" type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} style={{ marginBottom: 16 }} />
          <Btn style={{ width: "100%", marginBottom: 10, opacity: loading ? 0.6 : 1 }} onClick={handleLogin} disabled={loading}>
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </Btn>
          <Btn variant="ghost" style={{ width: "100%", fontSize: 13 }} onClick={onBack}>← BACK</Btn>
        </Card>
      </div>
    </div>
  );
}

function Dashboard({ token, onLogout }) {
  const [tab, setTab]         = useState("alerts");
  const [user, setUser]       = useState(null);
  const [alerts, setAlerts]   = useState([]);
  const [history, setHistory] = useState([]);
  const [newAlert, setNewAlert] = useState({ brand: "", keywords: "", max_price_gbp: "", size: "" });
  const [tg, setTg]           = useState({ bot_token: "", chat_id: "" });
  const [saving, setSaving]   = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    const [meRes, alertRes, histRes] = await Promise.all([
      api("/me", {}, token),
      api("/alerts", {}, token),
      api("/analyses", {}, token),
    ]);
    if (meRes.ok)    setUser(await meRes.json());
    if (alertRes.ok) setAlerts(await alertRes.json());
    if (histRes.ok)  setHistory(await histRes.json());
  }

  async function addAlert() {
    if (!newAlert.brand || !newAlert.max_price_gbp) return;
    setSaving(true);
    const res = await api("/alerts", {
      method: "POST",
      body: JSON.stringify({
        brand:         newAlert.brand,
        keywords:      newAlert.keywords.split(",").map(k => k.trim()).filter(Boolean),
        max_price_gbp: parseFloat(newAlert.max_price_gbp),
        size:          newAlert.size || null,
      }),
    }, token);
    if (res.ok) {
      const created = await res.json();
      setAlerts(prev => [...prev, created]);
      setNewAlert({ brand: "", keywords: "", max_price_gbp: "", size: "" });
    }
    setSaving(false);
  }

  async function deleteAlert(id) {
    await api(`/alerts/${id}`, { method: "DELETE" }, token);
    setAlerts(prev => prev.filter(a => a.id !== id));
  }

  async function saveTelegram() {
    setSaving(true);
    await api("/me/telegram", {
      method: "PATCH",
      body: JSON.stringify({ telegram_bot_token: tg.bot_token, telegram_chat_id: tg.chat_id }),
    }, token);
    setSaving(false);
    alert("Telegram saved ✓");
  }

  const verdictColor = v => ({ "BUY NOW": "#00ff88", "WORTH IT": "#ffd700", "WAIT": "#ff9500", "SKIP": "#ff4444" })[v] || "#888";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}
        *{box-sizing:border-box;margin:0;padding:0}
        input::placeholder{color:#2a2a2a!important}
        input:focus{border-color:#333!important}
        body{background:#0a0a0a}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:#111} ::-webkit-scrollbar-thumb{background:#2a2a2a}
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: "1px solid #1a1a1a" }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {user && <Pill color={user.subscription_status === "active" ? "#00ff88" : "#ff4444"}>{user.subscription_status}</Pill>}
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#333" }}>{user?.email}</div>
          <Btn variant="ghost" style={{ fontSize: 12, padding: "8px 16px" }} onClick={onLogout}>SIGN OUT</Btn>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a", padding: "0 40px" }}>
        {[["alerts", "Price Alerts"], ["history", "Analysis History"], ["settings", "Settings"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{
            padding: "14px 22px", background: "none", border: "none",
            fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2,
            color: tab === id ? "#00ff88" : "#333", cursor: "pointer",
            borderBottom: `2px solid ${tab === id ? "#00ff88" : "transparent"}`,
            marginBottom: -1, textTransform: "uppercase", transition: "color 0.15s",
          }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: 40, maxWidth: 1000 }}>

        {/* ALERTS TAB */}
        {tab === "alerts" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 32 }}>
            <div>
              <Label>Active Alerts — {alerts.length} Running</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {alerts.length === 0 && (
                  <div style={{ color: "#2a2a2a", fontFamily: "'Space Mono', monospace", fontSize: 11, padding: "20px 0" }}>
                    No alerts yet. Add one →
                  </div>
                )}
                {alerts.map(a => (
                  <div key={a.id} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 3, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <PulsingDot />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#e8e8e0", letterSpacing: 1 }}>{a.brand}</div>
                      <div style={{ fontSize: 11, color: "#333", marginTop: 2 }}>
                        {(a.keywords || []).slice(0, 3).join(" · ")}{a.size ? ` · ${a.size}` : ""}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#00ff88" }}>Under £{a.max_price_gbp}</div>
                    <button onClick={() => deleteAlert(a.id)} style={{ background: "none", border: "none", color: "#2a2a2a", cursor: "pointer", fontSize: 12, transition: "color 0.15s" }}
                      onMouseEnter={e => e.target.style.color = "#ff4444"}
                      onMouseLeave={e => e.target.style.color = "#2a2a2a"}
                    >✕</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>New Alert</Label>
              <Card style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "#2a2a2a", letterSpacing: 2, marginBottom: 6 }}>BRAND</div>
                  <select value={newAlert.brand} onChange={e => setNewAlert(p => ({ ...p, brand: e.target.value }))}
                    style={{ background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: 3, padding: "10px 14px", color: newAlert.brand ? "#e8e8e0" : "#2a2a2a", fontSize: 13, width: "100%", outline: "none" }}>
                    <option value="">Select brand...</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <Input placeholder="Keywords (e.g. AW2003, ghost piece)" value={newAlert.keywords} onChange={e => setNewAlert(p => ({ ...p, keywords: e.target.value }))} />
                <Input placeholder="Max Price (£)" type="number" value={newAlert.max_price_gbp} onChange={e => setNewAlert(p => ({ ...p, max_price_gbp: e.target.value }))} />
                <Input placeholder="Size (e.g. L, M, XL)" value={newAlert.size} onChange={e => setNewAlert(p => ({ ...p, size: e.target.value }))} />
                <Btn variant="green" style={{ width: "100%", opacity: saving ? 0.6 : 1 }} onClick={addAlert} disabled={saving}>
                  + ADD ALERT
                </Btn>
              </Card>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <>
            <Label>Analysis History — Last 50</Label>
            {history.length === 0 && (
              <div style={{ color: "#2a2a2a", fontFamily: "'Space Mono', monospace", fontSize: 11 }}>
                No analyses yet. Use the Chrome extension on a listing.
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {history.map(h => {
                const r = h.result || {};
                const vc = verdictColor(r.verdict);
                return (
                  <div key={h.id} onClick={() => setSelectedAnalysis(selectedAnalysis?.id === h.id ? null : h)}
                    style={{ background: "#111", border: `1px solid ${selectedAnalysis?.id === h.id ? "#2a2a2a" : "#1a1a1a"}`, borderRadius: 3, padding: "14px 18px", cursor: "pointer", transition: "border-color 0.15s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1, marginRight: 16 }}>
                        <div style={{ fontSize: 13, color: "#e8e8e0", marginBottom: 4 }}>{h.listing_title?.slice(0, 70) || "Unknown"}</div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "#333", letterSpacing: 1 }}>
                          {h.platform} · {h.listed_price} · {new Date(h.created_at).toLocaleDateString("en-GB")}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2, color: vc }}>{r.verdict}</div>
                        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#00ff88" }}>+£{r.profit ?? "?"}</div>
                      </div>
                    </div>

                    {selectedAnalysis?.id === h.id && (
                      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1a1a1a" }}>
                        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                          {[["FLIP", r.flipScore], ["SPEED", r.sellSpeed], ["DEMAND", r.marketDemand]].map(([l, v]) => (
                            <ScoreBar key={l} label={l} value={v ?? 0} />
                          ))}
                        </div>
                        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7, marginBottom: 12 }}>{r.marketInsight}</div>
                        {r.japanArbitrage && (
                          <div style={{ background: "#0d1a0d", border: "1px solid #00ff8820", borderRadius: 3, padding: "10px 14px", fontSize: 11, color: "#00ff8870" }}>
                            🇯🇵 {r.japanNote}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 24 }}>
            <Card>
              <Label>Account</Label>
              <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>{user?.email}</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "#00ff88" }}>
                {user?.subscription_status?.toUpperCase()}
              </div>
            </Card>

            <Card>
              <Label>Telegram Deal Alerts</Label>
              <div style={{ fontSize: 12, color: "#444", lineHeight: 1.7, marginBottom: 14 }}>
                Add your Telegram bot token and chat ID to receive instant deal alerts when the scraper finds a match.
              </div>
              <Input placeholder="Bot Token (from @BotFather)" type="password" value={tg.bot_token}
                onChange={e => setTg(p => ({ ...p, bot_token: e.target.value }))} style={{ marginBottom: 10 }} />
              <Input placeholder="Chat ID (from getUpdates)" value={tg.chat_id}
                onChange={e => setTg(p => ({ ...p, chat_id: e.target.value }))} style={{ marginBottom: 14 }} />
              <Btn variant="green" style={{ width: "100%", opacity: saving ? 0.6 : 1 }} onClick={saveTelegram} disabled={saving}>
                SAVE TELEGRAM
              </Btn>
            </Card>

            <Card>
              <Label>Chrome Extension</Label>
              <div style={{ fontSize: 12, color: "#555", lineHeight: 1.7, marginBottom: 14 }}>
                Download the extension and load it into Chrome. Sign in with your account email and password — no API key needed.
              </div>
              <Btn variant="ghost" style={{ width: "100%", fontSize: 14 }} onClick={() => alert("Download link goes here after deploy")}>
                ↓ DOWNLOAD EXTENSION
              </Btn>
            </Card>

            <Btn variant="danger" style={{ width: "100%", fontSize: 14 }} onClick={onLogout}>SIGN OUT</Btn>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────

export default function App() {
  const [view,  setView]  = useState("landing");  // landing | login | dashboard
  const [token, setToken] = useState(() => localStorage.getItem("archivr_token") || null);
  const [user,  setUser]  = useState(null);

  useEffect(() => {
    if (token) setView("dashboard");
  }, []);

  function handleLogin(accessToken, userData) {
    localStorage.setItem("archivr_token", accessToken);
    setToken(accessToken);
    setUser(userData);
    setView("dashboard");
  }

  function handleLogout() {
    localStorage.removeItem("archivr_token");
    setToken(null);
    setUser(null);
    setView("landing");
  }

  if (view === "landing") return <LandingPage onSubscribe={setView} />;
  if (view === "login")   return <LoginPage onLogin={handleLogin} onBack={() => setView("landing")} />;
  if (view === "dashboard" && token) return <Dashboard token={token} onLogout={handleLogout} />;

  return <LandingPage onSubscribe={setView} />;
}
