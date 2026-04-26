import { useState, useEffect } from "react";

const Style = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    :root{
      --blue:#2563eb;--blue-l:#eff6ff;--blue-m:#dbeafe;
      --green:#16a34a;--green-l:#f0fdf4;
      --red:#dc2626;--red-l:#fef2f2;
      --orange:#ea580c;--orange-l:#fff7ed;
      --yellow:#ca8a04;--yellow-l:#fefce8;
      --purple:#7c3aed;--purple-l:#f5f3ff;
      --gray:#6b7280;--gray-l:#f9fafb;--gray-m:#e5e7eb;
      --text:#111827;--text2:#374151;--white:#fff;--bg:#f3f4f6;
      --font:'Nunito',sans-serif;--r:16px;--rs:10px;
    }
    html,body,#root{height:100%;background:var(--bg);color:var(--text);font-family:var(--font);}
    button{cursor:pointer;border:none;outline:none;font-family:var(--font);}
    input,textarea,select{font-family:var(--font);outline:none;border:none;background:none;}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-thumb{background:var(--gray-m);border-radius:4px;}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes pop{0%{transform:scale(0.85);opacity:0}100%{transform:scale(1);opacity:1}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
    .fade{animation:fadeUp 0.3s ease both;}
    .spin{animation:spin 0.8s linear infinite;}
  `}</style>
);

// ── helpers ───────────────────────────────────────────────────────────────────
const uid = () => "CF-" + Math.floor(1000 + Math.random() * 9000);
const timeAgo = ts => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return Math.floor(s/60) + "m ago";
  if (s < 86400) return Math.floor(s/3600) + "h ago";
  return Math.floor(s/86400) + "d ago";
};

const CAT = {
  water:       { icon:"💧", label:"Water",        bg:"#eff6ff", color:"#2563eb" },
  electricity: { icon:"⚡", label:"Electricity",  bg:"#fefce8", color:"#ca8a04" },
  road:        { icon:"🛣️", label:"Roads",         bg:"#fff7ed", color:"#ea580c" },
  sanitation:  { icon:"🗑️", label:"Sanitation",   bg:"#f0fdf4", color:"#16a34a" },
  park:        { icon:"🌳", label:"Parks",         bg:"#f0fdf4", color:"#15803d" },
  drainage:    { icon:"🚧", label:"Drainage",      bg:"#fef2f2", color:"#dc2626" },
  transport:   { icon:"🚌", label:"Transport",     bg:"#f5f3ff", color:"#7c3aed" },
  noise:       { icon:"📢", label:"Noise",         bg:"#fff7ed", color:"#ea580c" },
};

const STAT = {
  pending:     { label:"Pending",     bg:"#fefce8", color:"#ca8a04", dot:"#ca8a04" },
  in_progress: { label:"In Progress", bg:"#eff6ff", color:"#2563eb", dot:"#2563eb" },
  escalated:   { label:"Escalated",   bg:"#fef2f2", color:"#dc2626", dot:"#dc2626" },
  resolved:    { label:"Resolved",    bg:"#f0fdf4", color:"#16a34a", dot:"#16a34a" },
};

const DEPTS = {
  water:"Jal Board", electricity:"TNEB", road:"PWD Roads",
  sanitation:"Salem Corporation", park:"Salem Corporation",
  drainage:"Salem Corporation", transport:"TNMTC", noise:"Salem Police",
};

const INITIAL_ISSUES = [
  {
    id:"CF-1001", title:"Water Pipeline Burst", cat:"water", sev:"critical", status:"escalated",
    place:"Shevapet, Salem", ts:Date.now()-7200000, confirms:47, dept:"Jal Board", sla:24, elapsed:48,
    reporter:"Gopika", mine:true,
    desc:"Underground pipeline burst near main junction. Severe flooding since 6 hours. Roads are completely waterlogged and people cannot walk.",
    steps:[
      {done:true, label:"Complaint Submitted",  time:"10 Jan 9:14 AM",  note:"Registered successfully"},
      {done:true, label:"Viewed by Officer",     time:"10 Jan 11:32 AM", note:"Officer Mehta – Jal Board"},
      {done:false,label:"Repair Work Started",   time:"—",               note:""},
      {done:false,label:"Issue Resolved",        time:"—",               note:""},
    ]
  },
  {
    id:"CF-1002", title:"Overflowing Garbage Bins", cat:"sanitation", sev:"high", status:"in_progress",
    place:"Suramangalam, Salem", ts:Date.now()-86400000, confirms:23, dept:"Salem Corporation", sla:24, elapsed:26,
    reporter:"Ramesh K.", mine:false,
    desc:"Garbage bins near bus stand overflowing for 3 days. Very bad smell and health risk for nearby residents.",
    steps:[
      {done:true, label:"Complaint Submitted",  time:"9 Jan 2:30 PM",  note:"Registered successfully"},
      {done:true, label:"Viewed by Officer",     time:"9 Jan 5:45 PM",  note:"Supervisor Kumar"},
      {done:true, label:"Repair Work Started",   time:"10 Jan 8:00 AM", note:"Crew assigned and on the way"},
      {done:false,label:"Issue Resolved",        time:"—",              note:""},
    ]
  },
  {
    id:"CF-1003", title:"Street Light Not Working", cat:"electricity", sev:"medium", status:"pending",
    place:"Fairlands, Salem", ts:Date.now()-259200000, confirms:12, dept:"TNEB", sla:48, elapsed:72,
    reporter:"Priya S.", mine:false,
    desc:"Three street lights on main road have not worked for a week. Very dangerous for pedestrians and two-wheelers at night.",
    steps:[
      {done:true, label:"Complaint Submitted",  time:"7 Jan 8:00 PM",  note:"Registered successfully"},
      {done:false,label:"Viewed by Officer",     time:"—",              note:""},
      {done:false,label:"Repair Work Started",   time:"—",              note:""},
      {done:false,label:"Issue Resolved",        time:"—",              note:""},
    ]
  },
  {
    id:"CF-1004", title:"Deep Pothole on Road", cat:"road", sev:"high", status:"resolved",
    place:"Omalur Road, Salem", ts:Date.now()-432000000, confirms:34, dept:"PWD Roads", sla:48, elapsed:29,
    reporter:"Anbu M.", mine:false,
    desc:"Large pothole causing accidents. Two vehicles were already damaged. Urgent repair needed.",
    steps:[
      {done:true,label:"Complaint Submitted",  time:"5 Jan 11:00 AM",  note:"Registered successfully"},
      {done:true,label:"Viewed by Officer",     time:"5 Jan 2:15 PM",   note:"JE Sharma – PWD"},
      {done:true,label:"Repair Work Started",   time:"6 Jan 9:00 AM",   note:"Road repair team deployed"},
      {done:true,label:"Issue Resolved",        time:"7 Jan 4:30 PM",   note:"JE Sharma verified & closed"},
    ]
  },
  {
    id:"CF-1005", title:"Sewage Overflow on Road", cat:"drainage", sev:"critical", status:"pending",
    place:"Lakshmipuram, Salem", ts:Date.now()-64800000, confirms:61, dept:"Salem Corporation", sla:24, elapsed:18,
    reporter:"Vijay R.", mine:false,
    desc:"Sewage manhole overflowing onto the main market road. Very strong odour and unhygienic conditions. Children at risk.",
    steps:[
      {done:true, label:"Complaint Submitted",  time:"10 Jan 3:00 PM",  note:"Registered successfully"},
      {done:false,label:"Viewed by Officer",     time:"—",               note:""},
      {done:false,label:"Repair Work Started",   time:"—",               note:""},
      {done:false,label:"Issue Resolved",        time:"—",               note:""},
    ]
  },
  {
    id:"CF-1006", title:"Broken Water Tap at Colony", cat:"water", sev:"medium", status:"in_progress",
    place:"Ammapet, Salem", ts:Date.now()-172800000, confirms:19, dept:"Jal Board", sla:24, elapsed:20,
    reporter:"Meena V.", mine:false,
    desc:"Public water supply tap at colony entrance is broken. Water wasting continuously for 2 days.",
    steps:[
      {done:true, label:"Complaint Submitted",  time:"8 Jan 10:00 AM",  note:"Registered successfully"},
      {done:true, label:"Viewed by Officer",     time:"8 Jan 3:00 PM",   note:"Officer Ravi – Jal Board"},
      {done:false,label:"Repair Work Started",   time:"—",               note:""},
      {done:false,label:"Issue Resolved",        time:"—",               note:""},
    ]
  },
  {
    id:"CF-1007", title:"Fallen Tree Blocking Road", cat:"road", sev:"high", status:"resolved",
    place:"Hasthampatti, Salem", ts:Date.now()-345600000, confirms:28, dept:"PWD Roads", sla:12, elapsed:8,
    reporter:"Karthik B.", mine:false,
    desc:"A large tree fell during last night's storm and is blocking the entire road. Vehicles cannot pass.",
    steps:[
      {done:true,label:"Complaint Submitted",  time:"6 Jan 7:00 AM",   note:"Registered successfully"},
      {done:true,label:"Viewed by Officer",     time:"6 Jan 7:45 AM",   note:"Emergency response team"},
      {done:true,label:"Repair Work Started",   time:"6 Jan 9:00 AM",   note:"Tree cutting crew deployed"},
      {done:true,label:"Issue Resolved",        time:"6 Jan 12:30 PM",  note:"Road cleared & verified"},
    ]
  },
  {
    id:"CF-1008", title:"No Bus Service Since Morning", cat:"transport", sev:"medium", status:"pending",
    place:"Kondalampatti, Salem", ts:Date.now()-43200000, confirms:38, dept:"TNMTC", sla:24, elapsed:12,
    reporter:"Selvi T.", mine:false,
    desc:"Bus route 15A has not operated since 6 AM. Many workers and students are stranded at the bus stop.",
    steps:[
      {done:true, label:"Complaint Submitted",  time:"10 Jan 10:00 AM", note:"Registered successfully"},
      {done:false,label:"Viewed by Officer",     time:"—",               note:""},
      {done:false,label:"Repair Work Started",   time:"—",               note:""},
      {done:false,label:"Issue Resolved",        time:"—",               note:""},
    ]
  },
  {
    id:"CF-1009", title:"Park Benches Broken & Damaged", cat:"park", sev:"low", status:"pending",
    place:"Swarnapuri, Salem", ts:Date.now()-518400000, confirms:9, dept:"Salem Corporation", sla:72, elapsed:48,
    reporter:"Devi N.", mine:false,
    desc:"Most benches in the public park are broken. Elderly people and children have nowhere to sit. Needs immediate replacement.",
    steps:[
      {done:true, label:"Complaint Submitted",  time:"4 Jan 6:00 PM",   note:"Registered successfully"},
      {done:false,label:"Viewed by Officer",     time:"—",               note:""},
      {done:false,label:"Repair Work Started",   time:"—",               note:""},
      {done:false,label:"Issue Resolved",        time:"—",               note:""},
    ]
  },
  {
    id:"CF-1010", title:"Loud Construction Noise at Night", cat:"noise", sev:"medium", status:"escalated",
    place:"Alagapuram, Salem", ts:Date.now()-129600000, confirms:44, dept:"Salem Police", sla:12, elapsed:24,
    reporter:"Muthu S.", mine:false,
    desc:"Construction work happening after 10 PM every night. Residents including elderly and infants cannot sleep.",
    steps:[
      {done:true, label:"Complaint Submitted",  time:"9 Jan 11:00 PM",  note:"Registered successfully"},
      {done:true, label:"Viewed by Officer",     time:"10 Jan 6:00 AM",  note:"Inspector Balu – Salem Police"},
      {done:false,label:"Action Taken",          time:"—",               note:""},
      {done:false,label:"Issue Resolved",        time:"—",               note:""},
    ]
  },
  {
    id:"CF-1011", title:"Blocked Drainage Causing Flood", cat:"drainage", sev:"high", status:"in_progress",
    place:"Gugai, Salem", ts:Date.now()-108000000, confirms:52, dept:"Salem Corporation", sla:24, elapsed:30,
    reporter:"Bharathi R.", mine:false,
    desc:"Main drainage channel is completely blocked. During rains, entire street floods up to knee level.",
    steps:[
      {done:true, label:"Complaint Submitted",  time:"9 Jan 9:00 AM",   note:"Registered successfully"},
      {done:true, label:"Viewed by Officer",     time:"9 Jan 11:00 AM",  note:"Engineer Prabhu"},
      {done:true, label:"Repair Work Started",   time:"10 Jan 7:00 AM",  note:"Dewatering team deployed"},
      {done:false,label:"Issue Resolved",        time:"—",               note:""},
    ]
  },
  {
    id:"CF-1012", title:"Power Cut for 12 Hours", cat:"electricity", sev:"critical", status:"resolved",
    place:"Narasothipatti, Salem", ts:Date.now()-604800000, confirms:73, dept:"TNEB", sla:12, elapsed:11,
    reporter:"Gopal K.", mine:false,
    desc:"Entire area has no electricity for 12+ hours. No prior notice given by TNEB. Pumps and hospitals affected.",
    steps:[
      {done:true,label:"Complaint Submitted",  time:"3 Jan 2:00 PM",   note:"Registered successfully"},
      {done:true,label:"Viewed by Officer",     time:"3 Jan 2:30 PM",   note:"TNEB emergency team"},
      {done:true,label:"Repair Work Started",   time:"3 Jan 4:00 PM",   note:"Line fault repair started"},
      {done:true,label:"Issue Resolved",        time:"3 Jan 9:00 PM",   note:"Power restored & verified"},
    ]
  },
];

// ── Small UI pieces ───────────────────────────────────────────────────────────
function Chip({ label, bg, color, small }) {
  return (
    <span style={{
      display:"inline-block", padding: small ? "2px 8px" : "3px 10px",
      borderRadius:99, fontSize: small ? 11 : 12, fontWeight:700, background:bg, color
    }}>{label}</span>
  );
}

function Card({ children, style={}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background:"var(--white)", borderRadius:"var(--r)",
      boxShadow:"0 1px 4px rgba(0,0,0,0.07)", padding:16,
      cursor:onClick?"pointer":"default", ...style
    }}>{children}</div>
  );
}

function PrimaryBtn({ children, onClick, style={}, disabled, loading }) {
  return (
    <button onClick={onClick} disabled={disabled||loading} style={{
      width:"100%", padding:"13px", borderRadius:"var(--rs)", fontSize:15,
      fontWeight:700, background: disabled ? "var(--gray-m)" : "var(--blue)",
      color: disabled ? "var(--gray)" : "white",
      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
      transition:"opacity 0.15s", ...style
    }}>
      {loading
        ? <span className="spin" style={{width:18,height:18,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"white",borderRadius:"50%",display:"inline-block"}}/>
        : children}
    </button>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)",
      background:"#1f2937", color:"white", borderRadius:12, padding:"11px 20px",
      fontSize:13, fontWeight:700, zIndex:999, whiteSpace:"nowrap",
      animation:"pop 0.25s ease both", boxShadow:"0 4px 16px rgba(0,0,0,0.2)"
    }}>{msg}</div>
  );
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function Auth({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = () => { setLoading(true); setTimeout(()=>{ setLoading(false); setSent(true); },1200); };
  const verify  = () => { setLoading(true); setTimeout(()=>{ setLoading(false); onLogin("Gopika"); },1200); };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20, background:"var(--white)" }}>
      <div style={{ width:"100%", maxWidth:360 }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ width:68, height:68, borderRadius:20, background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, margin:"0 auto 14px", boxShadow:"0 4px 20px rgba(37,99,235,0.35)" }}>🏛️</div>
          <h1 style={{ fontSize:28, fontWeight:800 }}>CivicFix</h1>
          <p style={{ color:"var(--gray)", fontSize:14, marginTop:4 }}>Report civic issues in Salem, Tamil Nadu</p>
        </div>

        <Card>
          {!sent ? (
            <>
              <p style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Enter your mobile number</p>
              <p style={{ color:"var(--gray)", fontSize:13, marginBottom:16 }}>We will send you a one-time password</p>
              <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                <div style={{ padding:"11px 12px", background:"var(--gray-l)", borderRadius:"var(--rs)", fontSize:14, color:"var(--gray)", flexShrink:0, fontWeight:700 }}>🇮🇳 +91</div>
                <input style={{ flex:1, background:"var(--gray-l)", borderRadius:"var(--rs)", padding:"11px 14px", fontSize:15, width:"100%" }}
                  placeholder="Mobile number" value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/,"").slice(0,10))}/>
              </div>
              <PrimaryBtn onClick={sendOtp} disabled={phone.length<10} loading={loading}>Send OTP →</PrimaryBtn>
              <button onClick={()=>onLogin("Gopika")} style={{ display:"block", margin:"12px auto 0", background:"none", color:"var(--gray)", fontSize:13, fontWeight:600 }}>
                Skip → Continue as Gopika
              </button>
            </>
          ) : (
            <>
              <p style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Enter OTP</p>
              <p style={{ color:"var(--gray)", fontSize:13, marginBottom:16 }}>Sent to +91 {phone}</p>
              <input style={{ width:"100%", background:"var(--gray-l)", borderRadius:"var(--rs)", padding:"13px", fontSize:24, letterSpacing:"0.5em", textAlign:"center", marginBottom:16, display:"block" }}
                placeholder="· · · · · ·" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/,"").slice(0,6))}/>
              <PrimaryBtn onClick={verify} disabled={otp.length<4} loading={loading}>✅ Verify & Login</PrimaryBtn>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

// ── Issue Card (Feed) ─────────────────────────────────────────────────────────
function IssueCard({ issue, onClick, currentUser }) {
  const cat  = CAT[issue.cat]  || CAT.road;
  const stat = STAT[issue.status] || STAT.pending;
  const overdue = issue.elapsed > issue.sla;
  const isMe = issue.reporter === currentUser;

  return (
    <Card onClick={onClick} style={{ marginBottom:10, position:"relative", overflow:"hidden" }}>
      {overdue && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"var(--red)" }}/>}
      {isMe   && <div style={{ position:"absolute", top:0, right:0, left:0, height:3, background:"var(--blue)" }}/>}
      <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
        <div style={{ width:46, height:46, borderRadius:13, background:cat.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{cat.icon}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3, flexWrap:"wrap" }}>
            <span style={{ fontSize:11, color:"var(--gray)", fontWeight:700 }}>{issue.id}</span>
            {isMe   && <span style={{ fontSize:10, background:"var(--blue-l)", color:"var(--blue)", padding:"1px 7px", borderRadius:99, fontWeight:700 }}>My Report</span>}
            {overdue && <span style={{ fontSize:10, background:"var(--red-l)",  color:"var(--red)",  padding:"1px 7px", borderRadius:99, fontWeight:700 }}>⚠ Overdue</span>}
          </div>
          <div style={{ fontWeight:800, fontSize:15, marginBottom:4, lineHeight:1.3 }}>{issue.title}</div>
          <div style={{ fontSize:12, color:"var(--gray)", marginBottom:8 }}>📍 {issue.place}</div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <Chip label={cat.label} bg={cat.bg} color={cat.color}/>
            <Chip label={stat.label} bg={stat.bg} color={stat.color}/>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12, paddingTop:10, borderTop:"1px solid var(--gray-m)", fontSize:13, color:"var(--gray)" }}>
        <span>👥 <b style={{ color:"var(--text)" }}>{issue.confirms}</b> confirmed • <span style={{ color:"var(--gray)" }}>by {issue.reporter}</span></span>
        <span>{timeAgo(issue.ts)}</span>
      </div>
    </Card>
  );
}

// ── Tracking Detail ───────────────────────────────────────────────────────────
function IssueDetail({ issue, onBack, onEscalate, onConfirm, currentUser }) {
  const cat  = CAT[issue.cat]  || CAT.road;
  const stat = STAT[issue.status] || STAT.pending;
  const overdue = issue.elapsed > issue.sla;
  const isMe = issue.reporter === currentUser;
  const pct = Math.min((issue.elapsed / issue.sla) * 100, 100);

  return (
    <div className="fade">
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:6, background:"none", color:"var(--blue)", fontWeight:700, fontSize:14, marginBottom:16 }}>
        ← Back to Feed
      </button>

      {/* Title */}
      <Card style={{ marginBottom:12 }}>
        <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:12 }}>
          <div style={{ width:50, height:50, borderRadius:14, background:cat.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{cat.icon}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:"var(--gray)", fontWeight:700, marginBottom:2 }}>{issue.id} • {issue.dept}</div>
            <div style={{ fontWeight:800, fontSize:16, lineHeight:1.3 }}>{issue.title}</div>
          </div>
        </div>
        <p style={{ fontSize:14, color:"var(--text2)", lineHeight:1.65, marginBottom:12 }}>{issue.desc}</p>
        <div style={{ fontSize:13, color:"var(--gray)", marginBottom:12 }}>📍 {issue.place} &nbsp;•&nbsp; 👤 Reported by <b style={{ color:"var(--text)" }}>{issue.reporter}</b> &nbsp;•&nbsp; {timeAgo(issue.ts)}</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          <Chip label={cat.label} bg={cat.bg} color={cat.color}/>
          <Chip label={stat.label} bg={stat.bg} color={stat.color}/>
        </div>
      </Card>

      {/* Tracking Timeline */}
      <Card style={{ marginBottom:12 }}>
        <div style={{ fontWeight:800, fontSize:15, marginBottom:16 }}>📋 Complaint Tracking</div>
        {issue.steps.map((s, i) => (
          <div key={i} style={{ display:"flex", gap:14, marginBottom: i < issue.steps.length-1 ? 18 : 0 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
              <div style={{
                width:32, height:32, borderRadius:"50%", flexShrink:0,
                background: s.done ? "var(--blue)" : "var(--gray-m)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color: s.done ? "white" : "var(--gray)", fontSize:14, fontWeight:800,
              }}>
                {s.done ? "✓" : <span style={{ fontSize:12 }}>{i+1}</span>}
              </div>
              {i < issue.steps.length-1 && (
                <div style={{ width:2, flex:1, minHeight:14, background: s.done ? "var(--blue-m)" : "var(--gray-m)", marginTop:4 }}/>
              )}
            </div>
            <div style={{ paddingBottom: i < issue.steps.length-1 ? 4 : 0 }}>
              <div style={{ fontWeight:700, fontSize:14, color: s.done ? "var(--text)" : "var(--gray)" }}>{s.label}</div>
              {s.note && <div style={{ fontSize:12, color:"var(--blue)", marginTop:2 }}>👤 {s.note}</div>}
              <div style={{ fontSize:12, color:"var(--gray)", marginTop:2 }}>{s.time}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* SLA Timer */}
      <Card style={{ marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
          <span style={{ fontWeight:700, fontSize:14 }}>⏱ Response Timer</span>
          <span style={{ fontSize:13, color: overdue ? "var(--red)" : "var(--green)", fontWeight:700 }}>
            {issue.elapsed}h used / {issue.sla}h target
          </span>
        </div>
        <div style={{ height:10, background:"var(--gray-m)", borderRadius:99, overflow:"hidden", marginBottom:6 }}>
          <div style={{ height:"100%", borderRadius:99, width:`${pct}%`, background: overdue ? "var(--red)" : "var(--blue)", transition:"width 0.6s" }}/>
        </div>
        {overdue
          ? <p style={{ fontSize:12, color:"var(--red)", fontWeight:700 }}>⚠️ SLA breached by {issue.elapsed - issue.sla} hours! Escalate now.</p>
          : <p style={{ fontSize:12, color:"var(--green)", fontWeight:600 }}>✅ Within target time</p>
        }
      </Card>

      {/* Community confirm */}
      <Card style={{ marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>👥 Community Confirmations</div>
            <div style={{ fontSize:13, color:"var(--gray)" }}><b style={{ color:"var(--text)" }}>{issue.confirms}</b> people in the area confirmed this issue</div>
          </div>
          <button onClick={onConfirm} style={{
            padding:"9px 14px", borderRadius:"var(--rs)", background:"var(--blue-l)",
            color:"var(--blue)", fontWeight:700, fontSize:13, flexShrink:0
          }}>👍 +1 Confirm</button>
        </div>
      </Card>

      {/* Escalate */}
      {issue.status !== "resolved" && (
        <Card style={{ background:"var(--red-l)", border:"1px solid #fecaca", marginBottom:12 }}>
          <div style={{ fontWeight:700, fontSize:14, color:"var(--red)", marginBottom:4 }}>🚨 No response yet?</div>
          <p style={{ fontSize:13, color:"var(--text2)", marginBottom:12 }}>Escalate this complaint to a senior officer or higher authority.</p>
          <PrimaryBtn onClick={onEscalate} style={{ background:"var(--red)" }}>⬆️ Escalate This Complaint</PrimaryBtn>
        </Card>
      )}

      {issue.status === "resolved" && (
        <Card style={{ background:"var(--green-l)", border:"1px solid #bbf7d0" }}>
          <div style={{ fontWeight:800, fontSize:15, color:"var(--green)", marginBottom:4 }}>✅ Issue Resolved!</div>
          <p style={{ fontSize:13, color:"var(--text2)" }}>This issue was resolved in {issue.elapsed} hours. Thank you for reporting!</p>
        </Card>
      )}
    </div>
  );
}

// ── Report Form ───────────────────────────────────────────────────────────────
function ReportForm({ onSubmit, onCancel, currentUser }) {
  const [step, setStep]   = useState(1);
  const [form, setForm]   = useState({ title:"", cat:"", desc:"", place:"", photo:false });
  const [loading, setLoading] = useState(false);
  const [done, setDone]   = useState(null);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const cats = Object.entries(CAT);

  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      const newId = uid();
      const newIssue = {
        id: newId, title: form.title, cat: form.cat,
        sev:"medium", status:"pending",
        place: form.place || "Salem, Tamil Nadu",
        ts: Date.now(), confirms:1, dept: DEPTS[form.cat]||"Salem Corporation",
        sla:24, elapsed:0, reporter: currentUser, mine:true,
        desc: form.desc || "No additional description provided.",
        steps:[
          {done:true, label:"Complaint Submitted",  time: new Date().toLocaleString("en-IN",{hour12:true,hour:"2-digit",minute:"2-digit",day:"numeric",month:"short"}), note:"Registered successfully"},
          {done:false,label:"Viewed by Officer",    time:"—", note:""},
          {done:false,label:"Repair Work Started",  time:"—", note:""},
          {done:false,label:"Issue Resolved",       time:"—", note:""},
        ]
      };
      setLoading(false);
      setDone(newIssue);
      onSubmit(newIssue);
    }, 1800);
  };

  if (done) return (
    <div className="fade" style={{ textAlign:"center", padding:"40px 20px" }}>
      <div style={{ fontSize:60, marginBottom:16 }}>✅</div>
      <h2 style={{ fontWeight:800, fontSize:22, marginBottom:8 }}>Complaint Submitted!</h2>
      <p style={{ color:"var(--gray)", fontSize:14, marginBottom:6 }}>Your complaint is now visible to everyone in Salem.</p>
      <div style={{ background:"var(--blue-l)", borderRadius:"var(--rs)", padding:"12px 16px", marginBottom:24, display:"inline-block" }}>
        <div style={{ fontSize:13, color:"var(--gray)", marginBottom:2 }}>Tracking ID</div>
        <div style={{ fontWeight:800, fontSize:20, color:"var(--blue)" }}>{done.id}</div>
      </div>
      <br/>
      <PrimaryBtn onClick={onCancel}>← Back to Feed</PrimaryBtn>
    </div>
  );

  return (
    <div className="fade">
      <button onClick={onCancel} style={{ display:"flex", alignItems:"center", gap:6, background:"none", color:"var(--blue)", fontWeight:700, fontSize:14, marginBottom:14 }}>← Cancel</button>
      <h2 style={{ fontWeight:800, fontSize:19, marginBottom:2 }}>Report an Issue</h2>
      <p style={{ color:"var(--gray)", fontSize:13, marginBottom:14 }}>Step {step} of 2 — Your report will be public and tracked</p>
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {[1,2].map(s=><div key={s} style={{ flex:1, height:5, borderRadius:99, background: s<=step?"var(--blue)":"var(--gray-m)" }}/>)}
      </div>

      {step === 1 && (
        <div className="fade">
          <Card style={{ marginBottom:12 }}>
            <label style={{ fontSize:13, fontWeight:700, display:"block", marginBottom:8 }}>What is the problem? *</label>
            <input style={{ width:"100%", background:"var(--gray-l)", borderRadius:"var(--rs)", padding:"12px 14px", fontSize:14 }}
              placeholder="e.g. Water leak near my house" value={form.title} onChange={e=>set("title",e.target.value)}/>
          </Card>

          <Card style={{ marginBottom:12 }}>
            <label style={{ fontSize:13, fontWeight:700, display:"block", marginBottom:10 }}>Select Category *</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {cats.map(([k,v])=>(
                <button key={k} onClick={()=>set("cat",k)} style={{
                  padding:"12px 8px", borderRadius:"var(--rs)", textAlign:"center",
                  background: form.cat===k ? v.bg : "var(--gray-l)",
                  border:`2px solid ${form.cat===k ? v.color : "transparent"}`,
                  transition:"all 0.15s",
                }}>
                  <div style={{ fontSize:22, marginBottom:3 }}>{v.icon}</div>
                  <div style={{ fontSize:12, fontWeight:700, color: form.cat===k ? v.color : "var(--text2)" }}>{v.label}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card style={{ marginBottom:16 }}>
            <label style={{ fontSize:13, fontWeight:700, display:"block", marginBottom:8 }}>Location in Salem *</label>
            <div style={{ position:"relative" }}>
              <input style={{ width:"100%", background:"var(--gray-l)", borderRadius:"var(--rs)", padding:"12px 44px 12px 14px", fontSize:14 }}
                placeholder="e.g. Shevapet, Salem" value={form.place} onChange={e=>set("place",e.target.value)}/>
              <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", fontSize:18 }}>📍</span>
            </div>
          </Card>

          <PrimaryBtn onClick={()=>setStep(2)} disabled={!form.title || !form.cat || !form.place}>Next →</PrimaryBtn>
        </div>
      )}

      {step === 2 && (
        <div className="fade">
          <Card style={{ marginBottom:12 }}>
            <label style={{ fontSize:13, fontWeight:700, display:"block", marginBottom:8 }}>Describe the issue *</label>
            <textarea style={{ width:"100%", background:"var(--gray-l)", borderRadius:"var(--rs)", padding:"12px 14px", fontSize:14, resize:"none", minHeight:100, display:"block" }}
              placeholder="Explain the problem in detail so the officer can understand clearly..."
              value={form.desc} onChange={e=>set("desc",e.target.value)}/>
          </Card>

          <Card style={{ marginBottom:16 }}>
            <label style={{ fontSize:13, fontWeight:700, display:"block", marginBottom:8 }}>Add a Photo (Optional)</label>
            <div onClick={()=>set("photo",!form.photo)} style={{
              background:"var(--gray-l)", borderRadius:"var(--rs)", padding:"24px",
              textAlign:"center", cursor:"pointer", border:`2px dashed ${form.photo?"var(--green)":"var(--gray-m)"}`,
              transition:"all 0.2s"
            }}>
              {form.photo
                ? <><div style={{ fontSize:28, marginBottom:4 }}>✅</div><div style={{ fontSize:13, color:"var(--green)", fontWeight:700 }}>Photo added</div></>
                : <><div style={{ fontSize:28, marginBottom:4 }}>📸</div><div style={{ fontSize:13, color:"var(--gray)" }}>Tap to add photo</div></>
              }
            </div>
          </Card>

          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setStep(1)} style={{ padding:"13px 20px", borderRadius:"var(--rs)", background:"var(--gray-l)", color:"var(--text2)", fontWeight:700, fontSize:14 }}>← Back</button>
            <div style={{ flex:1 }}>
              <PrimaryBtn onClick={submit} disabled={!form.desc} loading={loading}>
                🚀 Submit Complaint
              </PrimaryBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── My Complaints ─────────────────────────────────────────────────────────────
function MyComplaints({ issues, currentUser, onView }) {
  const mine = issues.filter(i=>i.reporter===currentUser);
  return (
    <div className="fade">
      <h2 style={{ fontWeight:800, fontSize:20, marginBottom:2 }}>My Complaints</h2>
      <p style={{ color:"var(--gray)", fontSize:13, marginBottom:16 }}>All complaints filed by you</p>
      {mine.length === 0
        ? <div style={{ textAlign:"center", padding:"50px 20px", color:"var(--gray)" }}>
            <div style={{ fontSize:40, marginBottom:10 }}>📋</div>
            <div style={{ fontWeight:700 }}>No complaints yet</div>
            <div style={{ fontSize:13, marginTop:4 }}>Tap "Report" to file your first complaint</div>
          </div>
        : mine.map(issue=>(
            <IssueCard key={issue.id} issue={issue} onClick={()=>onView(issue)} currentUser={currentUser}/>
          ))
      }
    </div>
  );
}

// ── Profile ───────────────────────────────────────────────────────────────────
function Profile({ issues, currentUser, onLogout }) {
  const mine = issues.filter(i=>i.reporter===currentUser);
  const resolved = mine.filter(i=>i.status==="resolved").length;
  const totalConfirms = mine.reduce((a,i)=>a+i.confirms,0);

  return (
    <div className="fade">
      <Card style={{ textAlign:"center", marginBottom:14 }}>
        <div style={{ width:68, height:68, borderRadius:"50%", background:"var(--blue-l)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"var(--blue)", fontSize:28, margin:"0 auto 10px" }}>
          {currentUser[0]}
        </div>
        <div style={{ fontWeight:800, fontSize:20 }}>{currentUser}</div>
        <div style={{ color:"var(--gray)", fontSize:13, marginTop:3 }}>📍 Salem, Tamil Nadu</div>
        <div style={{ marginTop:10, display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
          <Chip label="✅ Verified Citizen" bg="var(--green-l)" color="var(--green)"/>
          <Chip label="🏆 Active Reporter"  bg="var(--yellow-l)" color="var(--yellow)"/>
        </div>
      </Card>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
        {[
          { l:"Reports",  v:mine.length,    c:"var(--blue)"  },
          { l:"Resolved", v:resolved,       c:"var(--green)" },
          { l:"Confirms", v:totalConfirms,  c:"var(--purple)"},
        ].map(s=>(
          <div key={s.l} style={{ background:"var(--white)", borderRadius:14, padding:"14px 8px", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight:800, fontSize:24, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:11, color:"var(--gray)", marginTop:2, fontWeight:600 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <Card style={{ padding:0, overflow:"hidden" }}>
        {[
          { icon:"📋", label:"My Complaints", sub:`${mine.length} total` },
          { icon:"🔔", label:"Notifications",  sub:"3 unread" },
          { icon:"📍", label:"My Area",        sub:"Salem, Tamil Nadu" },
          { icon:"❓", label:"Help & Support",  sub:"" },
          { icon:"⚙️", label:"Settings",        sub:"" },
        ].map((item,i,arr)=>(
          <div key={item.label} style={{
            display:"flex", alignItems:"center", gap:14, padding:"14px 18px",
            borderBottom: i<arr.length-1 ? "1px solid var(--gray-m)" : "none",
          }}>
            <span style={{ fontSize:20 }}>{item.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700 }}>{item.label}</div>
              {item.sub && <div style={{ fontSize:12, color:"var(--gray)" }}>{item.sub}</div>}
            </div>
            <span style={{ color:"var(--gray)", fontSize:18 }}>›</span>
          </div>
        ))}
        <button onClick={onLogout} style={{
          width:"100%", display:"flex", alignItems:"center", gap:14, padding:"14px 18px",
          background:"transparent", color:"var(--red)", fontSize:14, fontWeight:700,
        }}>
          <span style={{ fontSize:20 }}>🚪</span> Sign Out
        </button>
      </Card>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser]         = useState(null);
  const [issues, setIssues]     = useState(INITIAL_ISSUES);
  const [tab, setTab]           = useState("home");
  const [selected, setSelected] = useState(null);
  const [reporting, setReport]  = useState(false);
  const [toast, setToast]       = useState(null);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");

  const say = msg => { setToast(msg); setTimeout(()=>setToast(null),3000); };

  const handleSubmit = newIssue => {
    setIssues(prev=>[newIssue,...prev]);
    say("✅ Complaint submitted! Tracking ID: " + newIssue.id);
  };

  const handleEscalate = issue => {
    setIssues(prev=>prev.map(i=>i.id===issue.id?{...i,status:"escalated"}:i));
    setSelected(prev=>({...prev,status:"escalated"}));
    say("🚨 Complaint escalated to higher authority!");
  };

  const handleConfirm = issue => {
    setIssues(prev=>prev.map(i=>i.id===issue.id?{...i,confirms:i.confirms+1}:i));
    setSelected(prev=>({...prev,confirms:prev.confirms+1}));
    say("👍 Confirmation added!");
  };

  const stats = {
    total:   issues.length,
    pending: issues.filter(i=>i.status==="pending").length,
    active:  issues.filter(i=>i.status==="in_progress").length,
    done:    issues.filter(i=>i.status==="resolved").length,
  };

  const filtered = issues.filter(i=>{
    if (filter!=="all" && i.status!==filter && i.cat!==filter) return false;
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) &&
        !i.place.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (!user) return <><Style/><Auth onLogin={name=>setUser(name)}/></>;

  const showDetail  = !!selected && !reporting;
  const showReport  = reporting;
  const showHome    = !selected && !reporting && tab==="home";
  const showMine    = !selected && !reporting && tab==="mine";
  const showProfile = !selected && !reporting && tab==="profile";

  return (
    <>
      <Style/>
      <div style={{ display:"flex", flexDirection:"column", height:"100vh", maxWidth:480, margin:"0 auto", background:"var(--bg)" }}>

        {/* Header */}
        <div style={{ background:"var(--white)", padding:"13px 16px", borderBottom:"1px solid var(--gray-m)", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:50 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:36, height:36, borderRadius:11, background:"var(--blue)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🏛️</div>
            <div>
              <div style={{ fontWeight:800, fontSize:17 }}>CivicFix</div>
              <div style={{ fontSize:11, color:"var(--gray)" }}>Salem, Tamil Nadu</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button style={{ background:"none", fontSize:20, position:"relative", padding:2 }}>
              🔔
              <span style={{ position:"absolute", top:0, right:0, width:8, height:8, background:"var(--red)", borderRadius:"50%", animation:"pulse 2s infinite" }}/>
            </button>
            <div style={{ width:34, height:34, borderRadius:"50%", background:"var(--blue-l)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, color:"var(--blue)", fontSize:15 }}>
              {user[0]}
            </div>
          </div>
        </div>

        {/* Scroll content */}
        <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 86px" }}>

          {/* HOME FEED */}
          {showHome && (
            <div className="fade">
              <div style={{ marginBottom:14 }}>
                <h2 style={{ fontWeight:800, fontSize:20 }}>Hello, {user} 👋</h2>
                <p style={{ color:"var(--gray)", fontSize:13, marginTop:2 }}>Public issues reported in Salem</p>
              </div>

              {/* Stats */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:14 }}>
                {[
                  { l:"Total",   v:stats.total,   c:"var(--blue)",   bg:"var(--blue-l)"   },
                  { l:"Pending", v:stats.pending, c:"var(--yellow)", bg:"var(--yellow-l)" },
                  { l:"Active",  v:stats.active,  c:"var(--blue)",   bg:"var(--blue-l)"   },
                  { l:"Done",    v:stats.done,    c:"var(--green)",  bg:"var(--green-l)"  },
                ].map(s=>(
                  <div key={s.l} style={{ background:s.bg, borderRadius:12, padding:"10px 6px", textAlign:"center" }}>
                    <div style={{ fontWeight:800, fontSize:20, color:s.c }}>{s.v}</div>
                    <div style={{ fontSize:10, color:"var(--gray)", marginTop:1, fontWeight:700 }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Report Button */}
              <button onClick={()=>setReport(true)} style={{
                width:"100%", padding:"14px", borderRadius:"var(--r)", marginBottom:14,
                background:"var(--blue)", color:"white", fontWeight:800, fontSize:15,
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow:"0 4px 14px rgba(37,99,235,0.3)",
              }}>
                ➕ Report a New Issue
              </button>

              {/* Search */}
              <div style={{ position:"relative", marginBottom:10 }}>
                <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:15 }}>🔍</span>
                <input style={{ width:"100%", background:"var(--white)", borderRadius:"var(--rs)", padding:"11px 14px 11px 36px", fontSize:14, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}
                  placeholder="Search issues or location..."
                  value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>

              {/* Filters */}
              <div style={{ display:"flex", gap:6, marginBottom:14, overflowX:"auto", paddingBottom:2 }}>
                {[
                  { id:"all",         label:"All" },
                  { id:"pending",     label:"⏳ Pending" },
                  { id:"in_progress", label:"🔄 Active" },
                  { id:"escalated",   label:"🚨 Escalated" },
                  { id:"resolved",    label:"✅ Resolved" },
                  { id:"water",       label:"💧 Water" },
                  { id:"road",        label:"🛣️ Roads" },
                  { id:"electricity", label:"⚡ Electricity" },
                  { id:"sanitation",  label:"🗑️ Sanitation" },
                  { id:"drainage",    label:"🚧 Drainage" },
                ].map(f=>(
                  <button key={f.id} onClick={()=>setFilter(f.id)} style={{
                    padding:"6px 13px", borderRadius:99, fontSize:12, fontWeight:700, flexShrink:0,
                    background: filter===f.id ? "var(--blue)" : "var(--white)",
                    color:      filter===f.id ? "white" : "var(--gray)",
                    boxShadow:"0 1px 3px rgba(0,0,0,0.07)",
                  }}>{f.label}</button>
                ))}
              </div>

              {/* Feed */}
              <div style={{ fontWeight:700, fontSize:14, color:"var(--gray)", marginBottom:8 }}>
                {filtered.length} complaint{filtered.length!==1?"s":""} found
              </div>
              {filtered.length === 0
                ? <div style={{ textAlign:"center", padding:"40px 20px", color:"var(--gray)" }}>
                    <div style={{ fontSize:40, marginBottom:10 }}>🔍</div>
                    <div style={{ fontWeight:700 }}>No issues found</div>
                  </div>
                : filtered.map(issue=>(
                    <IssueCard key={issue.id} issue={issue} onClick={()=>setSelected(issue)} currentUser={user}/>
                  ))
              }
            </div>
          )}

          {/* DETAIL / TRACKING */}
          {showDetail && (
            <IssueDetail
              issue={selected}
              onBack={()=>setSelected(null)}
              onEscalate={()=>handleEscalate(selected)}
              onConfirm={()=>handleConfirm(selected)}
              currentUser={user}
            />
          )}

          {/* REPORT FORM */}
          {showReport && (
            <ReportForm
              onSubmit={handleSubmit}
              onCancel={()=>{ setReport(false); }}
              currentUser={user}
            />
          )}

          {/* MY COMPLAINTS */}
          {showMine && (
            <MyComplaints issues={issues} currentUser={user} onView={issue=>{ setSelected(issue); setTab("home"); }}/>
          )}

          {/* PROFILE */}
          {showProfile && (
            <Profile issues={issues} currentUser={user} onLogout={()=>setUser(null)}/>
          )}
        </div>

        {/* Bottom Nav */}
        <div style={{
          position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
          width:"100%", maxWidth:480,
          background:"var(--white)", borderTop:"1px solid var(--gray-m)",
          display:"flex", zIndex:50,
        }}>
          {[
            { id:"home",    icon:"🏠", label:"Feed"       },
            { id:"mine",    icon:"📋", label:"My Issues"  },
            { id:"profile", icon:"👤", label:"Profile"    },
          ].map(t=>(
            <button key={t.id} onClick={()=>{ setTab(t.id); setSelected(null); setReport(false); }}
              style={{
                flex:1, padding:"10px 6px 12px", background:"transparent",
                display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                color: tab===t.id ? "var(--blue)" : "var(--gray)",
                fontSize:11, fontWeight: tab===t.id ? 800 : 600,
              }}>
              <span style={{ fontSize:23 }}>{t.icon}</span>
              {t.label}
              {tab===t.id && <div style={{ width:5, height:5, borderRadius:"50%", background:"var(--blue)" }}/>}
            </button>
          ))}
        </div>

        <Toast msg={toast}/>
      </div>
    </>
  );
}
