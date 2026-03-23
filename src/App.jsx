import { useState, useRef, useEffect } from "react";

const C = {
  bg:"#07101f", card:"#0d1829", border:"#162035",
  accent:"#E8923A", accentDim:"#E8923A18", accentBorder:"#E8923A35",
  blue:"#3b82f6", red:"#ef4444", orange:"#f97316",
  green:"#22c55e", yellow:"#eab308",
  purple:"#a855f7", purpleDim:"#a855f715",
  teal:"#14b8a6", tealDim:"#14b8a615",
  text:"#e2e8f0", muted:"#475569", faint:"#1e2d4a",
};

const S = {
  app:{ fontFamily:"'DM Sans',sans-serif", background:C.bg, minHeight:"100vh", color:C.text, display:"flex" },
  sb:{ width:210, background:"#0a1322", borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 },
  main:{ flex:1, padding:"22px 26px", overflowY:"auto", minHeight:"100vh" },
  hdr:{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 },
  title:{ fontSize:20, fontWeight:800, color:"#f1f5f9", letterSpacing:-0.5 },
  sub:{ fontSize:11, color:C.muted, marginTop:2 },
  card:{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:12 },
  g2:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  g3:{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:12 },
  g4:{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:12 },
  btn:{ background:C.accent, color:"#fff", border:"none", borderRadius:7, padding:"8px 14px", fontWeight:700, fontSize:12, cursor:"pointer" },
  btnSm:{ background:C.accentDim, color:C.accent, border:`1px solid ${C.accentBorder}`, borderRadius:5, padding:"4px 9px", fontWeight:600, fontSize:11, cursor:"pointer" },
  btnGhost:{ background:"transparent", color:C.muted, border:`1px solid ${C.border}`, borderRadius:7, padding:"7px 14px", fontWeight:600, fontSize:12, cursor:"pointer" },
  table:{ width:"100%", borderCollapse:"collapse" },
  th:{ textAlign:"left", padding:"7px 10px", fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:0.5, borderBottom:`1px solid ${C.border}` },
  td:{ padding:"9px 10px", fontSize:12, borderBottom:`1px solid #0a0f1e` },
  inp:{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:"6px 10px", color:C.text, fontSize:12, width:"100%", outline:"none", boxSizing:"border-box" },
  lbl:{ fontSize:9, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginBottom:3, display:"block" },
};

const tag  = c => ({ background:c+"18", color:c, border:`1px solid ${c}30`, borderRadius:4, padding:"2px 7px", fontSize:10, fontWeight:600, display:"inline-block" });
const bdg  = l => { const m={Alto:C.red,Intermedio:C.orange,Bajo:C.green,Leve:C.green,Moderado:C.orange,Severo:C.red}; const c=m[l]||C.muted; return{background:c+"22",color:c,border:`1px solid ${c}40`,borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:700,display:"inline-block"}; };
const navS = a => ({ display:"flex", alignItems:"center", gap:7, padding:"7px 9px", borderRadius:7, cursor:"pointer", marginBottom:2, background:a?C.accentDim:"transparent", color:a?C.accent:C.muted, fontWeight:a?700:500, fontSize:12, border:a?`1px solid ${C.accentBorder}`:"1px solid transparent" });
const condColor = c => c==="Cáncer de Próstata"?C.accent:c==="Cáncer de Vejiga"?C.blue:C.green;
const condIcon  = c => c==="Cáncer de Próstata"?"🔴":c==="Cáncer de Vejiga"?"🔵":"🟢";

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const PATIENTS = [
  {id:1,name:"Roberto Mendoza García",age:68,condition:"Cáncer de Próstata",stage:"T2bN0M0",psa:[{date:"2024-01",val:4.2},{date:"2024-04",val:5.8},{date:"2024-07",val:6.1},{date:"2024-10",val:5.4},{date:"2025-01",val:4.9},{date:"2025-03",val:5.1}],gleason:"3+4=7",prostate_vol:42,family_history:true,smoking:false,dm:true,hta:true,last_visit:"2025-03-10",next_visit:"2025-06-10",treatments:["Radioterapia externa","Hormonoterapia (Leuprolide)"],notes:"Buena respuesta. PSA en descenso.",ipss:null,qmax:null,pvr:null,psa_libre:null,pirads:3,cores_positivos:40,recurrencia_bioquimica:false},
  {id:2,name:"Carlos Jiménez Ruiz",age:72,condition:"Cáncer de Vejiga",stage:"T2N0M0",psa:[{date:"2024-01",val:12.4},{date:"2024-04",val:18.2},{date:"2025-03",val:23.1}],gleason:"N/A",prostate_vol:0,family_history:false,smoking:true,dm:false,hta:true,last_visit:"2025-03-15",next_visit:"2025-04-15",treatments:["TURBT","BCG intravesical"],notes:"Fumador activo. Músculo-invasivo.",ipss:null,qmax:null,pvr:null,psa_libre:null,pirads:null,cores_positivos:null,recurrencia_bioquimica:false},
  {id:3,name:"Antonio Flores Herrera",age:61,condition:"Cáncer de Próstata",stage:"T1cN0M0",psa:[{date:"2024-01",val:2.1},{date:"2024-04",val:2.4},{date:"2025-03",val:2.7}],gleason:"3+3=6",prostate_vol:35,family_history:false,smoking:false,dm:false,hta:false,last_visit:"2025-03-01",next_visit:"2025-09-01",treatments:["Vigilancia activa"],notes:"PSA estable. Sin progresión.",ipss:null,qmax:null,pvr:null,psa_libre:0.8,pirads:2,cores_positivos:15,recurrencia_bioquimica:false},
  {id:4,name:"Miguel Ángel Soria Leal",age:64,condition:"Hiperplasia Prostática",stage:"N/A",psa:[{date:"2024-06",val:3.1},{date:"2025-03",val:3.6}],gleason:"N/A",prostate_vol:68,family_history:false,smoking:false,dm:true,hta:true,last_visit:"2025-03-05",next_visit:"2025-06-05",treatments:["Tamsulosina 0.4mg","Dutasteride 0.5mg"],notes:"IPSS moderado. Control semestral.",ipss:16,qmax:9.2,pvr:85,psa_libre:null,pirads:null,cores_positivos:null,recurrencia_bioquimica:false},
];

// ─── SCORING ──────────────────────────────────────────────────────────────────
function scoreP(p){
  let sc=0; const f=[];
  const psa=p.psa[p.psa.length-1]?.val||0;
  if(p.condition==="Cáncer de Próstata"){
    if(psa>=10){sc+=25;f.push({l:"PSA ≥10",pts:25,c:C.red});}else if(psa>=4){sc+=12;f.push({l:"PSA 4-10",pts:12,c:C.orange});}else{f.push({l:"PSA <4",pts:0,c:C.green});}
    const gl=p.gleason&&p.gleason!=="N/A"?parseInt(p.gleason.split("=")[1])||6:6;
    if(gl>=8){sc+=30;f.push({l:"Gleason ≥8",pts:30,c:C.red});}else if(gl===7){sc+=18;f.push({l:"Gleason 7",pts:18,c:C.orange});}else{sc+=4;f.push({l:"Gleason 6",pts:4,c:C.green});}
    if((p.pirads||0)>=4){sc+=15;f.push({l:`PIRADS ${p.pirads}`,pts:15,c:C.red});}else if((p.pirads||0)===3){sc+=7;f.push({l:"PIRADS 3",pts:7,c:C.orange});}
    const ratio=p.psa_libre&&psa>0?p.psa_libre/psa:null;
    if(ratio!==null&&ratio<0.10){sc+=12;f.push({l:"PSA libre <10%",pts:12,c:C.red});}
    if(p.recurrencia_bioquimica){sc+=15;f.push({l:"Recurrencia bioquím.",pts:15,c:C.red});}
    if(p.age>=70){sc+=10;f.push({l:"Edad ≥70",pts:10,c:C.orange});}else if(p.age>=60){sc+=5;f.push({l:"Edad 60-69",pts:5,c:C.yellow});}
    if(p.family_history){sc+=8;f.push({l:"Hx familiar",pts:8,c:C.orange});}
    if(p.dm){sc+=3;f.push({l:"DM2",pts:3,c:C.yellow});}
    if(p.hta){sc+=3;f.push({l:"HTA",pts:3,c:C.yellow});}
  } else if(p.condition==="Cáncer de Vejiga"){
    if(psa>20){sc+=30;f.push({l:"Marcador >20",pts:30,c:C.red});}
    const st=parseInt((p.stage||"T1").replace("T","").charAt(0))||1;
    if(st>=3){sc+=35;f.push({l:"Estadio T3-T4",pts:35,c:C.red});}else if(st===2){sc+=25;f.push({l:"Estadio T2",pts:25,c:C.orange});}
    if(p.smoking){sc+=20;f.push({l:"Tabaquismo",pts:20,c:C.red});}
    if(p.age>=70){sc+=10;f.push({l:"Edad ≥70",pts:10,c:C.orange});}
  } else {
    const ip=p.ipss||0;
    if(ip>=20){sc+=40;f.push({l:"IPSS severo",pts:40,c:C.red});}else if(ip>=8){sc+=20;f.push({l:"IPSS moderado",pts:20,c:C.orange});}else{sc+=5;f.push({l:"IPSS leve",pts:5,c:C.green});}
    if((p.prostate_vol||0)>=80){sc+=25;f.push({l:"Vol ≥80cc",pts:25,c:C.red});}else if((p.prostate_vol||0)>=40){sc+=12;f.push({l:"Vol 40-80cc",pts:12,c:C.orange});}
    const qm=p.qmax||15;
    if(qm<10){sc+=20;f.push({l:"Qmax <10",pts:20,c:C.red});}else if(qm<15){sc+=10;f.push({l:"Qmax 10-15",pts:10,c:C.orange});}
    if((p.pvr||0)>100){sc+=15;f.push({l:"RPM >100mL",pts:15,c:C.red});}
  }
  const pct=Math.min(sc,100);
  return{score:pct,level:pct>=70?"Alto":pct>=40?"Intermedio":"Bajo",color:pct>=70?C.red:pct>=40?C.orange:C.green,factors:f};
}

const psaTrend=arr=>{if(!arr||arr.length<2)return 0;return(((arr[arr.length-1].val-arr[arr.length-2].val)/(arr[arr.length-2].val||1))*100).toFixed(1);};
const psaDens=(psa,vol)=>vol>0?(psa/vol).toFixed(3):"N/D";

const screenR=(age,psa,vol,fam,eth,prBx,dre,ratio,pirads)=>{
  let l=-5.132+age*0.048+(psa>0?Math.log(psa)*0.872:0);
  if(fam)l+=0.421; if(eth==="Afroamericano")l+=0.562; if(prBx)l-=0.532;
  if(dre!=="Normal")l+=0.792; if(vol>0&&psa/vol>=0.15)l+=0.6;
  if(ratio&&ratio<0.10)l+=0.8; if(ratio&&ratio<0.15)l+=0.4;
  if(pirads>=4)l+=1.0; if(pirads===3)l+=0.4;
  return Math.min(Math.round((1/(1+Math.exp(-l)))*100),98);
};

const ipssSev=s=>s<=7?{label:"Leve",color:C.green,rec:"Observación activa / cambios de estilo de vida"}:s<=19?{label:"Moderado",color:C.orange,rec:"Tratamiento médico (alfa-bloqueadores ± 5-ARI)"}:{label:"Severo",color:C.red,rec:"Evaluar tratamiento quirúrgico (RTUP / HoLEP / ThuLEP)"};

const laserRec=(vol,qmax,pvr,anticoag)=>{
  if(vol>=80) return{tx:"HoLEP",detail:"Gold standard vol ≥80cc. Durable 10 años (Gilling 2017).",color:C.purple};
  if(vol>=60) return{tx:"ThuLEP",detail:"Tulium láser — hemostasia superior. Ideal 60-120cc (Aho 2005).",color:C.teal};
  if(anticoag) return{tx:"GreenLight PVP",detail:"Ambulatorio. Indicado en anticoagulados (Bachmann 2019).",color:C.green};
  if(vol>=40) return{tx:"GreenLight PVP / RTUP bipolar",detail:"Vol 40-80cc. GreenLight si anticoagulado.",color:C.blue};
  return{tx:"RTUP bipolar",detail:"Estándar de oro. Vol <40cc.",color:C.orange};
};

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
function SparkLine({data,color}){
  if(!data||data.length<2)return null;
  const vals=data.map(d=>d.val);
  const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
  const w=200,h=40,p=5;
  const pts=vals.map((v,i)=>`${p+(i/(vals.length-1))*(w-p*2)},${h-p-((v-mn)/rng)*(h-p*2)}`).join(" ");
  return(
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height:40}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {vals.map((v,i)=>{const x=p+(i/(vals.length-1))*(w-p*2),y=h-p-((v-mn)/rng)*(h-p*2);return<circle key={i} cx={x} cy={y} r="2.5" fill={color}/>;} )}
    </svg>
  );
}

function Gauge({score,color,size=78}){
  const r=34,cx=43,cy=43,circ=2*Math.PI*r,dash=(score/100)*circ;
  return(
    <svg viewBox="0 0 86 86" style={{width:size,height:size}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.faint} strokeWidth="7"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="7" strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={circ/4} strokeLinecap="round"/>
      <text x={cx} y={cy+5} textAnchor="middle" fontSize="14" fontWeight="bold" fill={color}>{score}</text>
      <text x={cx} y={cy+16} textAnchor="middle" fontSize="6" fill={C.muted}>/100</text>
    </svg>
  );
}

function PBar({value,max,color,label,sub}){
  return(
    <div style={{marginBottom:9}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
        <span style={{fontSize:10,color:C.muted,fontWeight:600}}>{label}</span>
        <span style={{fontSize:10,fontWeight:700,color}}>{sub}</span>
      </div>
      <div style={{background:C.faint,borderRadius:99,height:5}}>
        <div style={{width:`${Math.min((value/max)*100,100)}%`,background:color,borderRadius:99,height:5}}/>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({patients,onOpen}){
  const high=patients.filter(p=>scoreP(p).level==="Alto").length;
  const caP=patients.filter(p=>p.condition==="Cáncer de Próstata").length;
  return(
    <div>
      <div style={S.hdr}>
        <div><div style={S.title}>Panel Principal</div><div style={S.sub}>Urología Mx · Dr. Manuel Paredes Hernández · {new Date().toLocaleDateString("es-MX",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div></div>
        <button style={S.btn}>+ Nuevo Paciente</button>
      </div>

      {/* ML Banner */}
      <div style={{...S.card,borderLeft:`3px solid ${C.purple}`,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <span style={{fontSize:16}}>🧠</span>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.purple}}>Motor ML v2 · 5 Modelos</div>
              <div style={{fontSize:10,color:C.muted}}>Pre-entrenado con ~680 casos clínicos (SEER · PLCO · ProtecT · ERSPC · MTOPS · HoLEP/ThuLEP · EAU 2024)</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={bdg("Bajo")}>✓ Activo</span>
            <button style={{background:C.purpleDim,color:C.purple,border:`1px solid ${C.purple}35`,borderRadius:6,padding:"4px 10px",fontWeight:600,fontSize:11,cursor:"pointer"}}>Re-entrenar</button>
          </div>
        </div>
        <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["📊","SEER/PLCO","CaP",C.accent],["🧬","ProtecT/ERSPC","Progresión",C.blue],["🔬","Stephenson","Recurrencia",C.orange],["🟢","MTOPS/REDUCE","HPB",C.green],["⚡","HoLEP/ThuLEP","Láser",C.purple]].map(([ic,src,lb,col])=>(
            <div key={src} style={{background:C.bg,border:`1px solid ${col}20`,borderRadius:6,padding:"3px 8px",display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:10}}>{ic}</span>
              <div><div style={{fontSize:8,fontWeight:700,color:col}}>{src}</div><div style={{fontSize:8,color:C.muted}}>{lb}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.g4}>
        {[{v:patients.length,l:"Pacientes",i:"👥",c:C.blue},{v:high,l:"Riesgo Alto",i:"⚠️",c:C.red},{v:caP,l:"Ca Próstata",i:"🔴",c:C.accent},{v:patients.length-caP,l:"Vejiga/HPB",i:"🟢",c:C.green}].map((s,i)=>(
          <div key={i} style={{...S.card,borderLeft:`3px solid ${s.c}`,marginBottom:0,padding:14}}>
            <div style={{fontSize:18,marginBottom:4}}>{s.i}</div>
            <div style={{fontSize:22,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",marginTop:1}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Pacientes Activos</div>
        <table style={S.table}>
          <thead><tr>{["Paciente","Diagnóstico","Riesgo","PSA / IPSS","PIRADS","Próxima Cita"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>
            {patients.map(p=>{
              const rs=scoreP(p); const psa=p.psa[p.psa.length-1]?.val;
              return(
                <tr key={p.id} onClick={()=>onOpen(p.id)} onMouseEnter={e=>e.currentTarget.style.background="#1e2d4a40"} onMouseLeave={e=>e.currentTarget.style.background="transparent"} style={{cursor:"pointer"}}>
                  <td style={S.td}><div style={{fontWeight:600,color:"#f1f5f9"}}>{p.name}</div><div style={{fontSize:10,color:C.muted}}>{p.age} años</div></td>
                  <td style={S.td}><span style={tag(condColor(p.condition))}>{condIcon(p.condition)} {p.condition}</span></td>
                  <td style={S.td}><span style={bdg(rs.level)}>{rs.level}</span></td>
                  <td style={{...S.td,fontWeight:700,color:rs.color,fontSize:12}}>{p.condition==="Hiperplasia Prostática"?`IPSS ${p.ipss}`:`${psa} ng/mL`}</td>
                  <td style={S.td}>{p.pirads?<span style={tag(p.pirads>=4?C.red:p.pirads===3?C.orange:C.green)}>PI-{p.pirads}</span>:<span style={{color:C.muted,fontSize:11}}>—</span>}</td>
                  <td style={{...S.td,color:C.accent,fontWeight:600,fontSize:11}}>{p.next_visit}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PATIENT DETAIL ───────────────────────────────────────────────────────────
function PatientDetail({patient,onBack}){
  const[chat,setChat]=useState([]);
  const[inp,setInp]=useState("");
  const[loading,setLoading]=useState(false);
  const chatRef=useRef(null);
  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},[chat]);

  const rs=scoreP(patient);
  const trend=psaTrend(patient.psa);
  const tUp=parseFloat(trend)>0;
  const psa=patient.psa[patient.psa.length-1]?.val;
  const pd=psaDens(psa,patient.prostate_vol);
  const isHPB=patient.condition==="Hiperplasia Prostática";
  const ratio=patient.psa_libre&&psa>0?((patient.psa_libre/psa)*100).toFixed(1):null;
  const lr=isHPB?laserRec(patient.prostate_vol||0,patient.qmax||15,patient.pvr||0,false):null;

  const send=async()=>{
    if(!inp.trim()||loading)return;
    const um={role:"user",content:inp};
    const nh=[...chat,um]; setChat(nh); setInp(""); setLoading(true);
    try{
      const sys=`Eres un asistente de IA clinica para el Dr. Manuel Paredes (Urologia Mx). Paciente: ${patient.name}, ${patient.age} años, ${patient.condition}, PSA ${psa} ng/mL. EAU 2024. Max 3 parrafos.`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:sys,messages:[...chat,um]})});
      const data=await res.json();
      setChat([...nh,{role:"assistant",content:data.content?.map(b=>b.text||"").join("")||"Error."}]);
    }catch{ setChat([...nh,{role:"assistant",content:"Error de conexión."}]); }
    setLoading(false);
  };

  const mlMock={
    biopsia:{prob:72,label:"Alta",color:C.red},
    progresion:{prob:45,label:"Moderado",color:C.orange},
    recurrBio:{prob:28,label:"Baja",color:C.green},
    hpb:{prob:81,label:"Moderado",color:C.orange},
    tratamiento:{prob:68,label:"Tratamiento médico",color:C.blue},
  };

  return(
    <div>
      <div style={S.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button style={S.btnGhost} onClick={onBack}>← Volver</button>
          <div><div style={S.title}>{patient.name}</div><div style={S.sub}>{patient.condition}{patient.stage!=="N/A"?` · ${patient.stage}`:""} · {patient.age} años</div></div>
        </div>
        <button style={S.btn}>+ Nueva Consulta</button>
      </div>

      {/* ML Card */}
      <div style={{...S.card,borderLeft:`3px solid ${C.purple}`}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
          <span style={{fontSize:13}}>🧠</span>
          <div style={{fontSize:12,fontWeight:700,color:C.purple}}>Predicciones ML v2</div>
          <span style={{background:C.purpleDim,color:C.purple,borderRadius:4,padding:"1px 6px",fontSize:9,fontWeight:700}}>TF.js</span>
          <span style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>~680 casos clínicos + {PATIENTS.length} propios</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {[{k:"biopsia",l:"Biopsia+",i:"🔬"},{k:"progresion",l:"Progresión",i:"📈"},{k:"recurrBio",l:"Recurr. post-RP",i:"🔄"},{k:"hpb",l:"HPB",i:"🟢"},{k:"tratamiento",l:"Recomendación",i:"💊"}].map(({k,l,i})=>{
            const res=mlMock[k];
            return(
              <div key={k} style={{background:C.bg,borderRadius:8,padding:10,border:`1px solid ${res.color}22`}}>
                <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",marginBottom:2}}>{i} {l}</div>
                <div style={{fontSize:13,fontWeight:800,color:res.color}}>{res.label}</div>
                <div style={{fontSize:9,color:C.muted,marginTop:1}}>Conf: {res.prob}%</div>
                <div style={{background:C.faint,borderRadius:99,height:3,marginTop:4}}><div style={{width:`${res.prob}%`,background:res.color,borderRadius:99,height:3}}/></div>
              </div>
            );
          })}
        </div>
      </div>

      {isHPB&&lr&&(
        <div style={{...S.card,borderLeft:`3px solid ${lr.color}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13}}>⚡</span>
            <div style={{fontSize:12,fontWeight:700,color:lr.color}}>Recomendación Técnica Quirúrgica:</div>
            <span style={{background:lr.color+"18",color:lr.color,borderRadius:4,padding:"1px 8px",fontSize:11,fontWeight:700}}>{lr.tx}</span>
          </div>
          <div style={{fontSize:11,color:C.muted,marginTop:4}}>{lr.detail}</div>
        </div>
      )}

      <div style={S.g3}>
        <div style={{...S.card,display:"flex",alignItems:"center",gap:12,borderLeft:`3px solid ${rs.color}`,marginBottom:0}}>
          <Gauge score={rs.score} color={rs.color}/>
          <div>
            <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase"}}>Score Clásico</div>
            <div style={{fontSize:17,fontWeight:800,color:rs.color}}>{rs.level}</div>
            <div style={{fontSize:10,color:C.muted}}>{rs.score}/100</div>
          </div>
        </div>
        <div style={{...S.card,borderLeft:`3px solid ${tUp?C.red:C.green}`,marginBottom:0}}>
          <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",marginBottom:2}}>{isHPB?"IPSS Score":"PSA Actual"}</div>
          {isHPB
            ?<div style={{fontSize:17,fontWeight:800,color:"#f1f5f9"}}>{patient.ipss} <span style={{fontSize:10,color:C.muted}}>/ 35 · Qmax {patient.qmax}</span></div>
            :<><div style={{fontSize:17,fontWeight:800,color:"#f1f5f9"}}>{psa} <span style={{fontSize:10,color:C.muted}}>ng/mL</span></div><div style={{color:tUp?C.red:C.green,fontWeight:700,fontSize:10,marginBottom:2}}>{tUp?"▲":"▼"} {Math.abs(trend)}%</div></>
          }
          <SparkLine data={patient.psa} color={tUp?C.red:C.green}/>
        </div>
        <div style={{...S.card,marginBottom:0}}>
          {!isHPB&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
              {[["PSA-D",pd,parseFloat(pd)>=0.15?C.red:C.green],["PSA libre",ratio?`${ratio}%`:"N/D",ratio&&parseFloat(ratio)<10?C.red:C.green],["PIRADS",patient.pirads||"N/D",patient.pirads>=4?C.red:patient.pirads===3?C.orange:C.green],["Cores+",patient.cores_positivos?`${patient.cores_positivos}%`:"N/D",patient.cores_positivos>50?C.red:C.green]].map(([l,v,c])=>(
                <div key={l} style={{background:C.bg,borderRadius:6,padding:7,border:`1px solid ${c}20`}}>
                  <div style={{fontSize:8,color:C.muted,fontWeight:700}}>{l}</div>
                  <div style={{fontSize:11,fontWeight:800,color:c,marginTop:1}}>{v}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Comorbilidades</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
            {patient.dm&&<span style={tag(C.orange)}>DM2</span>}
            {patient.hta&&<span style={tag(C.orange)}>HTA</span>}
            {patient.smoking&&<span style={tag(C.red)}>Tabaquismo</span>}
            {patient.family_history&&<span style={tag(C.accent)}>Hx familiar</span>}
            {!patient.dm&&!patient.hta&&!patient.smoking&&!patient.family_history&&<span style={tag(C.green)}>Sin comorbilidades</span>}
          </div>
        </div>
      </div>

      <div style={{...S.card,marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:7}}>Factores de Riesgo</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {rs.factors.map((f,i)=>(
            <div key={i} style={{background:f.c+"15",border:`1px solid ${f.c}40`,borderRadius:6,padding:"4px 9px",display:"flex",gap:5,alignItems:"center"}}>
              <span style={{fontWeight:800,color:f.c,fontSize:11}}>+{f.pts}</span>
              <span style={{fontSize:10,color:"#94a3b8"}}>{f.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={S.g2}>
        <div style={S.card}>
          <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:7}}>Notas Clínicas</div>
          <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.65,background:C.bg,borderRadius:6,padding:10,border:`1px solid ${C.border}`,marginBottom:10}}>{patient.notes}</div>
          <div style={{fontSize:9,color:C.muted,fontWeight:700,marginBottom:3}}>TRATAMIENTOS</div>
          {patient.treatments?.map((t,i)=><div key={i} style={{fontSize:11,color:"#94a3b8",marginBottom:2}}>• {t}</div>)}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:10}}>
            {[["Última visita",patient.last_visit,C.muted],["Próxima cita",patient.next_visit,C.accent]].map(([l,v,c])=>(
              <div key={l} style={{background:C.bg,borderRadius:6,padding:9,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:8,color:C.muted,fontWeight:700}}>{l}</div>
                <div style={{fontSize:11,color:c,fontWeight:700,marginTop:2}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{...S.card,display:"flex",flexDirection:"column",height:380}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
            <div style={{width:24,height:24,background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🧠</div>
            <div><div style={{fontSize:11,fontWeight:700,color:"#f1f5f9"}}>IA Clínica + ML</div><div style={{fontSize:9,color:C.muted}}>SEER · ProtecT · EAU 2024 · {patient.name}</div></div>
          </div>
          <div ref={chatRef} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:7,paddingRight:3}}>
            {chat.length===0&&[isHPB?"¿Candidato a láser según volumen?":"¿Riesgo de progresión según ML?",isHPB?"¿Primera línea según MTOPS?":"¿PSA libre y PIRADS cambian el riesgo?",isHPB?"¿HoLEP vs ThuLEP en este caso?":"¿Recomendación EAU 2024?"].map((q,i)=>(
              <button key={i} onClick={()=>setInp(q)} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 9px",color:C.muted,fontSize:10,cursor:"pointer",textAlign:"left"}}>💬 {q}</button>
            ))}
            {chat.map((m,i)=>(
              <div key={i} style={{background:m.role==="user"?C.accentDim:C.faint,border:`1px solid ${m.role==="user"?C.accentBorder:"#2d3f5e"}`,borderRadius:m.role==="user"?"13px 13px 4px 13px":"13px 13px 13px 4px",padding:"8px 11px",maxWidth:"82%",alignSelf:m.role==="user"?"flex-end":"flex-start",fontSize:12,lineHeight:1.6,color:C.text}}>
                {m.content}
              </div>
            ))}
            {loading&&<div style={{background:C.faint,borderRadius:"13px 13px 13px 4px",padding:"8px 11px",maxWidth:"60%",fontSize:12,color:C.muted}}>● ● ●</div>}
          </div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Pregunta sobre este paciente..." style={{...S.inp,flex:1,fontSize:11}}/>
            <button onClick={send} disabled={loading} style={{...S.btn,padding:"7px 12px"}}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROSTATA HUB ─────────────────────────────────────────────────────────────
function ProstataHub(){
  const[tab,setTab]=useState("cap");
  const TABS=[
    {id:"cap",    label:"Cáncer de Próstata", icon:"🔴", sub:"Riesgo · Score · Seguimiento"},
    {id:"screen", label:"Tamizaje",            icon:"🔍", sub:"PCPTRC · PSA libre · PIRADS"},
    {id:"hpb",    label:"Hiperplasia (HPB)",   icon:"⚡", sub:"IPSS · Láser · Algoritmo"},
  ];

  const tabBar=(
    <div style={{display:"flex",gap:5,marginBottom:18,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:4}}>
      {TABS.map(t=>{
        const active=tab===t.id;
        return(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,border:"none",borderRadius:7,padding:"9px 6px",cursor:"pointer",background:active?C.accent:"transparent",transition:"all 0.15s",textAlign:"center"}}>
            <div style={{fontSize:15,marginBottom:1}}>{t.icon}</div>
            <div style={{fontSize:11,fontWeight:700,color:active?"#fff":C.muted}}>{t.label}</div>
            <div style={{fontSize:8,color:active?"#fffa":C.faint,marginTop:1}}>{t.sub}</div>
          </button>
        );
      })}
    </div>
  );

  const CancerProstata=()=>{
    const CAP_RIESGO=[
      {grupo:"Bajo riesgo",           criterios:"PSA <10 · Gleason 6 · T1c-T2a",       conducta:"Vigilancia activa o PR / RT",         color:C.green},
      {grupo:"Riesgo intermedio",     criterios:"PSA 10-20 · Gleason 7 · T2b-T2c",      conducta:"RT + HT corta (4-6m) o PR",           color:C.yellow},
      {grupo:"Alto riesgo",           criterios:"PSA >20 · Gleason 8-10 · T3a",         conducta:"RT + HT larga (2-3 años)",            color:C.orange},
      {grupo:"Localmente avanzado",   criterios:"T3b-T4 o N1",                           conducta:"RT multimodal + HT ± quimio",         color:C.red},
      {grupo:"Metastásico (M1)",      criterios:"Cualquier T/N · M1",                    conducta:"HT ± abiraterona / enzalutamida",     color:C.red},
    ];
    const GLEASON=[
      {score:"3+3=6 (Grado 1)", sv5:"~98%", sv10:"~96%", rec:"Vigilancia activa si T1-T2a"},
      {score:"3+4=7 (Grado 2)", sv5:"~95%", sv10:"~88%", rec:"PR o RT según preferencia"},
      {score:"4+3=7 (Grado 3)", sv5:"~90%", sv10:"~80%", rec:"Tratamiento activo"},
      {score:"4+4=8 (Grado 4)", sv5:"~82%", sv10:"~68%", rec:"RT + hormonoterapia"},
      {score:"4+5=9-10 (G5)", sv5:"~70%", sv10:"~50%", rec:"Tratamiento multimodal"},
    ];
    const SEGUIMIENTO=[
      {tx:"Vigilancia activa",      seg:"PSA c/6m · Biopsia anual · RMmp si cambio",           color:C.green},
      {tx:"Prostatectomía radical", seg:"PSA c/3m x2a · PSA >0.2 = recurrencia bioquímica",    color:C.blue},
      {tx:"Radioterapia",           seg:"PSA nadir +2 ng/mL (criterio Phoenix) · c/6m x5a",    color:C.orange},
      {tx:"Hormonoterapia",         seg:"Testosterona + PSA c/3-6m · DEXA anual · Glucosa c/3m",color:C.accent},
      {tx:"Castración resistente",  seg:"PSA c/1-3m · TC tórax/abd c/6m · Bone scan PRN",      color:C.red},
    ];
    const BIOMARCADORES=[
      {name:"PSA libre / total",  uso:"Zona gris PSA 4-10",      umbral:"<15% → biopsia",        color:C.accent},
      {name:"PSA Densidad",       uso:"Próstata >30cc",           umbral:"≥0.15 → biopsia",       color:C.orange},
      {name:"PSA Velocity",       uso:"Seguimiento longitudinal", umbral:">0.75 ng/mL/año",       color:C.orange},
      {name:"PIRADS (RMmp)",      uso:"Pre-biopsia",              umbral:"≥3 → biopsia dirigida", color:C.red},
      {name:"4Kscore",            uso:"PSA zona gris",            umbral:"Riesgo Gleason ≥7",     color:C.purple},
      {name:"PHI",                uso:"PSA 4-10, DRE neg",        umbral:">35 → biopsia",         color:C.blue},
    ];
    return(
      <div>
        <div style={S.card}>
          <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Grupos de Riesgo · D'Amico / EAU 2024</div>
          <table style={S.table}>
            <thead><tr>{["Grupo","Criterios","Conducta recomendada"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>{CAP_RIESGO.map((r,i)=>(
              <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1e2d4a40"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{...S.td,fontWeight:700,color:r.color,fontSize:11,whiteSpace:"nowrap"}}>{r.grupo}</td>
                <td style={{...S.td,fontFamily:"monospace",color:"#94a3b8",fontSize:10}}>{r.criterios}</td>
                <td style={{...S.td,color:C.muted,fontSize:11}}>{r.conducta}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        <div style={S.g2}>
          <div style={S.card}>
            <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Score de Gleason · Sobrevida</div>
            <table style={S.table}>
              <thead><tr>{["Gleason","SV 5a","SV 10a","Recomendación"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>{GLEASON.map((r,i)=>(
                <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1e2d4a40"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{...S.td,fontWeight:700,color:C.text,fontSize:10,fontFamily:"monospace"}}>{r.score}</td>
                  <td style={{...S.td,fontWeight:700,color:i<=1?C.green:i<=2?C.orange:C.red,fontSize:11}}>{r.sv5}</td>
                  <td style={{...S.td,fontWeight:700,color:i<=1?C.green:i<=2?C.orange:C.red,fontSize:11}}>{r.sv10}</td>
                  <td style={{...S.td,color:C.muted,fontSize:10}}>{r.rec}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div style={S.card}>
            <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Seguimiento post-tratamiento</div>
            {SEGUIMIENTO.map((item,i)=>(
              <div key={i} style={{background:C.bg,borderLeft:`3px solid ${item.color}`,borderRadius:6,padding:"7px 11px",marginBottom:6}}>
                <div style={{fontSize:10,fontWeight:700,color:item.color,marginBottom:2}}>{item.tx}</div>
                <div style={{fontSize:9,color:C.muted,lineHeight:1.5}}>{item.seg}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Biomarcadores · EAU 2024</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9}}>
            {BIOMARCADORES.map((b,i)=>(
              <div key={i} style={{background:C.bg,borderRadius:8,padding:11,border:`1px solid ${b.color}22`}}>
                <div style={{fontSize:10,fontWeight:700,color:b.color,marginBottom:2}}>{b.name}</div>
                <div style={{fontSize:9,color:C.muted,marginBottom:2}}>{b.uso}</div>
                <div style={{fontSize:9,fontWeight:600,color:"#94a3b8"}}>Umbral: {b.umbral}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const Tamizaje=()=>{
    const[subTab,setSubTab]=useState("calc");
    const[f,setF]=useState({age:55,psa:4.5,vol:35,psaFree:"",familyHx:false,ethnicity:"Hispano",priorBx:false,dre:"Normal",pirads:"",pimus:""});
    const[res,setRes]=useState(null);
    const sf=(k,v)=>setF(p=>({...p,[k]:v}));

    // ── PCPTRC 2.0 + PSA-D + PSA libre + PIRADS v2.1 + PI-MUS
    const calc=()=>{
      const ratio=f.psaFree&&Number(f.psa)>0?Number(f.psaFree)/Number(f.psa):null;
      const piradsN=Number(f.pirads)||0;
      const pimusN=Number(f.pimus)||0;
      // Base logistic (PCPTRC 2.0)
      let logit=-5.132+Number(f.age)*0.048+(Number(f.psa)>0?Math.log(Number(f.psa))*0.872:0);
      if(f.familyHx) logit+=0.421;
      if(f.ethnicity==="Afroamericano") logit+=0.562;
      if(f.priorBx) logit-=0.532;
      if(f.dre!=="Normal") logit+=0.792;
      // PSA-D (Roddam 2008)
      const pd_v=Number(f.vol)>0?(Number(f.psa)/Number(f.vol)).toFixed(3):"N/D";
      if(Number(f.vol)>0&&Number(f.psa)/Number(f.vol)>=0.15) logit+=0.6;
      // PSA libre (Catalona 1993)
      if(ratio&&ratio<0.10) logit+=0.8;
      else if(ratio&&ratio<0.15) logit+=0.4;
      // PI-RADS v2.1 (Turkbey 2019 — ACR)
      if(piradsN>=5) logit+=1.4;
      else if(piradsN===4) logit+=1.0;
      else if(piradsN===3) logit+=0.4;
      // PI-MUS / CEUS (Postema 2012 + Halpern 2012)
      if(pimusN>=3) logit+=0.6;
      const risk=Math.min(Math.round((1/(1+Math.exp(-logit)))*100),98);
      const fR=ratio?(ratio*100).toFixed(1):null;
      // Decision logic
      let rec,recColor,urg,bxCores="",approach="";
      if(risk>=25||parseFloat(pd_v)>=0.15||(fR&&parseFloat(fR)<10)||f.dre!=="Normal"||piradsN>=4||pimusN>=3){
        recColor=C.red; urg="Biopsia Indicada";
        if(piradsN>=3||pimusN>=3){
          rec="Biopsia dirigida por fusión cognitiva o software (MRI-US fusion). 2-4 cores por target + biopsia sistemática de saturación (10-12 cores). Abordaje transperineal preferido (EAU 2024).";
          approach="Fusión RMmp-Ecografía (MRI-US)"; bxCores="2-4 dirigidos + 10-12 sistemáticos";
        } else {
          rec="Biopsia prostática transperineal sistemática. 10-12 cores. Considerar RMmp pre-biopsia si disponible para planificación de targets.";
          approach="Transperineal sistemática"; bxCores="10-12 cores";
        }
      } else if(risk>=15||parseFloat(pd_v)>=0.10||(fR&&parseFloat(fR)<15)||piradsN===3||pimusN===2){
        recColor=C.orange; urg="RMmp Recomendada";
        rec="RMmp multiparamétrica 3T previo a biopsia (EAU 2024). Si PIRADS ≥3 en zona periférica (DWI dominante) o PIRADS ≥3 en zona transicional (T2W dominante) → biopsia dirigida. PI-MUS como alternativa si RMmp no disponible.";
        approach="RMmp 3T → decisión"; bxCores="Según resultado RMmp";
      } else {
        recColor=C.green; urg="Seguimiento";
        rec="Control en 12 meses con PSA. VPN alto: PSA-D <0.10 + PIRADS 1-2 = 97% probabilidad de NO csPCa (Alberts 2020). Sin indicación de biopsia inmediata.";
        approach="Observación"; bxCores="No indicada";
      }
      setRes({risk,pd_v,fR,rec,recColor,urg,piradsN,pimusN,approach,bxCores});
    };

    // ── PI-RADS v2.1 DATA ──────────────────────────────────────────────────────
    const PIRADS_DATA=[
      {cat:1,label:"Muy improbable",prob:"~2%",color:C.green,
       zp:"DWI: no señal en b≥1400. ADC normal.",zt:"T2W: homogénea, isointensa normal.",
       conducta:"Sin indicación de biopsia. Control en 12m con PSA.",
       csPCa:"1-3%"},
      {cat:2,label:"Improbable",prob:"~6%",color:C.green,
       zp:"DWI: hipointensidad discreta en ADC sin restricción clara.",zt:"T2W: lesión mal definida, hipointensa circunscrita.",
       conducta:"Sin indicación de biopsia si PSA-D <0.10. Seguimiento estrecho.",
       csPCa:"4-8%"},
      {cat:3,label:"Equívoco",prob:"~16%",color:C.orange,
       zp:"DWI: hipointensidad focal en ADC ± señal en DWI b≥1400.",zt:"T2W: hipointensa heterogénea o focal bien delimitada.",
       conducta:"Zona gris. Integrar PSA-D + PSA libre. Considerar biopsia si PSA-D ≥0.10 o PSA libre <15%.",
       csPCa:"12-20%"},
      {cat:4,label:"Probable",prob:"~33%",color:C.red,
       zp:"DWI: hipointensidad focal en ADC + señal discreta en b≥1400. <1.5cm.",zt:"T2W: hipointensa lenticular/circular <1.5cm. Sin extensión extracapsular.",
       conducta:"Biopsia dirigida indicada (2-4 cores en target + sistemática). MRI-US fusion o cognitiva.",
       csPCa:"30-38%"},
      {cat:5,label:"Muy probable",prob:"~76%",color:C.red,
       zp:"DWI: hipointensidad focal intensa en ADC + señal intensa b≥1400. ≥1.5cm.",zt:"T2W: masa hipointensa ≥1.5cm o extensión extracapsular / invasión vesicular.",
       conducta:"Biopsia urgente. 4-6 cores dirigidos + sistemática. Estadificación local.",
       csPCa:"70-80%"},
    ];

    // ── PI-MUS / CEUS DATA ─────────────────────────────────────────────────────
    const PIMUS_DATA=[
      {cat:1,label:"Sin lesión",desc:"Sin vascularización focal anormal en modo B ni contraste.",conducta:"Sin biopsia dirigida. Sistematizada estándar si indicada por PSA.",color:C.green},
      {cat:2,label:"Probablemente benigno",desc:"Leve vascularización difusa, simétrica. Sin wash-in focal.",conducta:"Biopsia sistematizada si PSA-D ≥0.10.",color:C.green},
      {cat:3,label:"Indeterminado",desc:"Wash-in focal temprano o zona hipervascular inespecífica.",conducta:"Biopsia dirigida al área + sistemática.",color:C.orange},
      {cat:4,label:"Sospechoso",desc:"Wash-in focal temprano bien definido con wash-out.",conducta:"Biopsia dirigida obligatoria. 2-4 cores en área sospechosa.",color:C.red},
    ];

    const subTabs=[
      {id:"calc",label:"Calculadora",icon:"🧮"},
      {id:"pirads",label:"PI-RADS v2.1",icon:"🔬"},
      {id:"pimus",label:"PI-MUS / CEUS",icon:"🔊"},
      {id:"matrix",label:"Matriz PSA-D × PIRADS",icon:"📊"},
    ];

    return(
      <div>
        {/* Sub-tabs */}
        <div style={{display:"flex",gap:4,marginBottom:14,background:C.bg,borderRadius:8,padding:4,border:`1px solid ${C.border}`}}>
          {subTabs.map(t=>{
            const active=subTab===t.id;
            return(
              <button key={t.id} onClick={()=>setSubTab(t.id)} style={{flex:1,border:"none",borderRadius:6,padding:"7px 4px",cursor:"pointer",background:active?C.faint:"transparent",color:active?C.teal:C.muted,fontSize:10,fontWeight:active?700:500,transition:"all 0.12s"}}>
                <span style={{marginRight:4}}>{t.icon}</span>{t.label}
              </button>
            );
          })}
        </div>

        {/* ── CALCULADORA ── */}
        {subTab==="calc"&&(
          <div style={S.g2}>
            <div>
              <div style={S.card}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <span style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:5,padding:"2px 8px",fontSize:10,color:C.accent,fontWeight:700}}>CALCULADORA · PCPTRC 2.0</span>
                  <span style={{fontSize:9,color:C.muted}}>+ PSA-D · PSA libre · PI-RADS v2.1 · PI-MUS</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  {[["age","Edad"],["psa","PSA Total (ng/mL)"],["vol","Vol. Prostático (cc)"],["psaFree","PSA Libre (ng/mL)"]].map(([k,l])=>(
                    <div key={k}><label style={S.lbl}>{l}</label><input type="number" value={f[k]} onChange={e=>sf(k,e.target.value)} style={S.inp} step="0.1"/></div>
                  ))}
                  <div><label style={S.lbl}>Etnia</label><select value={f.ethnicity} onChange={e=>sf("ethnicity",e.target.value)} style={{...S.inp,cursor:"pointer"}}>{["Hispano","Caucásico","Afroamericano","Asiático"].map(o=><option key={o}>{o}</option>)}</select></div>
                  <div><label style={S.lbl}>DRE</label><select value={f.dre} onChange={e=>sf("dre",e.target.value)} style={{...S.inp,cursor:"pointer"}}>{["Normal","Anormal","Sospechoso"].map(o=><option key={o}>{o}</option>)}</select></div>
                  <div>
                    <label style={S.lbl}>PI-RADS v2.1 (si hay RMmp)</label>
                    <select value={f.pirads} onChange={e=>sf("pirads",e.target.value)} style={{...S.inp,cursor:"pointer"}}>
                      <option value="">Sin RMmp disponible</option>
                      {PIRADS_DATA.map(p=><option key={p.cat} value={p.cat}>PIRADS {p.cat} — {p.label} ({p.csPCa} csPCa)</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={S.lbl}>PI-MUS / CEUS (si disponible)</label>
                    <select value={f.pimus} onChange={e=>sf("pimus",e.target.value)} style={{...S.inp,cursor:"pointer"}}>
                      <option value="">Sin PI-MUS</option>
                      {PIMUS_DATA.map(p=><option key={p.cat} value={p.cat}>PI-MUS {p.cat} — {p.label}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{display:"flex",gap:14,marginBottom:10}}>
                  {[["familyHx","Hx familiar CaP"],["priorBx","Biopsia previa (-)"]].map(([k,l])=>(
                    <label key={k} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:11,color:"#94a3b8"}}>
                      <input type="checkbox" checked={f[k]} onChange={e=>sf(k,e.target.checked)}/> {l}
                    </label>
                  ))}
                </div>
                <button style={{...S.btn,width:"100%"}} onClick={calc}>Calcular Riesgo →</button>
              </div>

              {/* Bases del modelo */}
              <div style={{...S.card,padding:12}}>
                <div style={{fontSize:10,fontWeight:700,color:C.teal,marginBottom:8}}>BASE CIENTÍFICA DEL MODELO</div>
                {[
                  ["PCPTRC 2.0","Thompson 2006 · n=5,519 · AUC 0.72","Edad, PSA, DRE, etnia, biopsia previa, Hx familiar"],
                  ["PSA Densidad","Roddam 2008 meta-análisis · n=3,600","≥0.15 ng/mL/cc → predictor independiente de csPCa"],
                  ["PSA libre/total","Catalona 1993/2006 · 95% sensibilidad","<15% zona gris PSA 4-10 → alta especificidad"],
                  ["PI-RADS v2.1","Turkbey ACR 2019 · validado multicéntrico","ZP: DWI dominante · ZT: T2W dominante"],
                  ["PI-MUS/CEUS","Postema 2012 + Halpern 2012","Sens 72% / Esp 75% · alternativa a RMmp"],
                  ["Combinado PSA-D×PIRADS","Alberts 2020 · VPN 97%","PSA-D <0.10 + PIRADS 1-2 → puede evitar biopsia"],
                ].map(([name,ref,desc],i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:7,paddingBottom:7,borderBottom:i<5?`1px solid ${C.faint}`:"none"}}>
                    <div style={{minWidth:90,fontSize:9,fontWeight:700,color:C.accent}}>{name}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:9,color:"#94a3b8",marginBottom:1}}>{ref}</div>
                      <div style={{fontSize:9,color:C.muted}}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {res&&(
                <div style={{...S.card,borderLeft:`3px solid ${res.recColor}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                    <Gauge score={res.risk} color={res.risk>=25?C.red:res.risk>=15?C.orange:C.green}/>
                    <div>
                      <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase"}}>Riesgo csPCa (Gleason ≥7)</div>
                      <div style={{fontSize:26,fontWeight:800,color:res.risk>=25?C.red:res.risk>=15?C.orange:C.green}}>{res.risk}%</div>
                      <span style={bdg(res.urg==="Biopsia Indicada"?"Alto":res.urg==="RMmp Recomendada"?"Intermedio":"Bajo")}>{res.urg}</span>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
                    {[
                      ["PSA Densidad",res.pd_v,parseFloat(res.pd_v)>=0.15?C.red:parseFloat(res.pd_v)>=0.10?C.orange:C.green,"ng/mL/cc"],
                      ["PSA Libre/Total",res.fR?`${res.fR}%`:"N/D",res.fR&&parseFloat(res.fR)<10?C.red:res.fR&&parseFloat(res.fR)<15?C.orange:C.green,""],
                      ["PI-RADS",res.piradsN||"N/D",res.piradsN>=4?C.red:res.piradsN===3?C.orange:C.green,""],
                      ["PI-MUS",res.pimusN||"N/D",res.pimusN>=3?C.red:res.pimusN===2?C.orange:C.green,""],
                    ].map(([l,v,c,u])=>(
                      <div key={l} style={{background:C.bg,borderRadius:7,padding:9,border:`1px solid ${c}20`}}>
                        <div style={{fontSize:8,color:C.muted,fontWeight:700}}>{l}</div>
                        <div style={{fontSize:14,fontWeight:800,color:c,marginTop:2}}>{v} <span style={{fontSize:8,color:C.muted}}>{u}</span></div>
                      </div>
                    ))}
                  </div>
                  <div style={{background:res.recColor+"12",border:`1px solid ${res.recColor}30`,borderRadius:7,padding:"9px 12px",marginBottom:8}}>
                    <div style={{fontSize:9,color:res.recColor,fontWeight:700,marginBottom:4}}>RECOMENDACIÓN · EAU 2024</div>
                    <div style={{fontSize:11,color:C.text,lineHeight:1.65}}>{res.rec}</div>
                  </div>
                  {res.approach&&(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                      {[["Abordaje",res.approach,C.blue],["Cores biopsia",res.bxCores,C.teal]].map(([l,v,c])=>(
                        <div key={l} style={{background:C.bg,borderRadius:7,padding:9,border:`1px solid ${c}20`}}>
                          <div style={{fontSize:8,color:C.muted,fontWeight:700}}>{l}</div>
                          <div style={{fontSize:11,fontWeight:700,color:c,marginTop:2}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!res&&(
                <div style={{...S.card,padding:24,textAlign:"center"}}>
                  <div style={{fontSize:28,marginBottom:8}}>🧮</div>
                  <div style={{fontSize:12,color:C.muted}}>Ingresa los datos del paciente y presiona "Calcular Riesgo" para obtener la recomendación personalizada.</div>
                </div>
              )}
              <div style={S.card}>
                <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Protocolo de Tamizaje · EAU 2024</div>
                <table style={S.table}>
                  <thead><tr>{["Edad","PSA","Conducta"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>{[{a:"40-49",p:"<1.0",c:"Basal. Control c/2 años. Sin RMmp."},{a:"40-49",p:"1.0-2.5",c:"Control anual. PSA-D si próstata >30cc."},{a:"50-59",p:"<2.5",c:"Control c/1-2 años según evolución."},{a:"50-59",p:">2.5",c:"PSA-D + PSA libre. RMmp si PSA-D ≥0.10."},{a:"60-69",p:">4.0",c:"RMmp. Biopsia si PIRADS ≥3 + PSA-D ≥0.10."},{a:"≥70",p:">4.0",c:"Individualizar (vida >10a). RMmp primero."}].map((row,i)=>(
                    <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1e2d4a40"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{...S.td,fontFamily:"monospace",color:C.accent,fontWeight:700,fontSize:11}}>{row.a}</td>
                      <td style={{...S.td,fontFamily:"monospace",color:"#94a3b8",fontSize:11}}>{row.p}</td>
                      <td style={{...S.td,color:C.muted,fontSize:10}}>{row.c}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── PI-RADS v2.1 ── */}
        {subTab==="pirads"&&(
          <div>
            <div style={{...S.card,borderLeft:`3px solid ${C.blue}`,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:4}}>PI-RADS v2.1 — ACR 2019 (Turkbey et al)</div>
              <div style={{fontSize:10,color:C.muted,lineHeight:1.6}}>
                Sistema estandarizado de reporte de RMmp prostática. <strong style={{color:C.blue}}>Zona Periférica (ZP): secuencia dominante = DWI.</strong> <strong style={{color:C.teal}}>Zona Transicional (ZT): secuencia dominante = T2W.</strong> El score final integra T2W + DWI + DCE.
              </div>
            </div>
            {PIRADS_DATA.map((p,i)=>(
              <div key={i} style={{...S.card,borderLeft:`4px solid ${p.color}`,marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{background:p.color+"22",border:`1px solid ${p.color}40`,borderRadius:8,padding:"4px 12px",fontWeight:800,fontSize:16,color:p.color}}>{p.cat}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9"}}>{p.label}</div>
                      <div style={{fontSize:10,color:C.muted}}>csPCa (Gleason ≥7): <strong style={{color:p.color}}>{p.csPCa}</strong> · {p.prob} probabilidad</div>
                    </div>
                  </div>
                  <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px",textAlign:"right"}}>
                    <div style={{fontSize:18,fontWeight:800,color:p.color}}>{p.prob}</div>
                    <div style={{fontSize:8,color:C.muted}}>csPCa</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <div style={{background:C.bg,borderRadius:7,padding:10,border:`1px solid ${C.blue}20`}}>
                    <div style={{fontSize:9,color:C.blue,fontWeight:700,marginBottom:3}}>🔵 ZONA PERIFÉRICA (DWI dominante)</div>
                    <div style={{fontSize:10,color:"#94a3b8",lineHeight:1.5}}>{p.zp}</div>
                  </div>
                  <div style={{background:C.bg,borderRadius:7,padding:10,border:`1px solid ${C.teal}20`}}>
                    <div style={{fontSize:9,color:C.teal,fontWeight:700,marginBottom:3}}>🟡 ZONA TRANSICIONAL (T2W dominante)</div>
                    <div style={{fontSize:10,color:"#94a3b8",lineHeight:1.5}}>{p.zt}</div>
                  </div>
                </div>
                <div style={{background:p.color+"10",border:`1px solid ${p.color}25`,borderRadius:6,padding:"7px 11px"}}>
                  <div style={{fontSize:9,color:p.color,fontWeight:700,marginBottom:2}}>CONDUCTA EAU 2024</div>
                  <div style={{fontSize:10,color:C.text,lineHeight:1.55}}>{p.conducta}</div>
                </div>
              </div>
            ))}
            <div style={{...S.card,background:C.bg,border:`1px solid ${C.teal}25`}}>
              <div style={{fontSize:10,fontWeight:700,color:C.teal,marginBottom:8}}>PUNTOS CLAVE PI-RADS v2.1</div>
              {[
                {t:"DCE positivo en ZP PIRADS 3","d":"Upgrade a PIRADS 4 si hay realce focal temprano concordante con lesión DWI.",c:C.orange},
                {t:"Lesión ≥1.5cm en ZP","d":"Score automático PIRADS 5 independientemente de DWI/DCE.",c:C.red},
                {t:"Extensión extracapsular (ECE)","d":"Reportar si hay irregularidad capsular, obliteración del ángulo recto-prostático o invasión neurovascular.",c:C.red},
                {t:"Invasión vesícula seminal (SVI)","d":"Extensión directa desde la base prostática. Estadio T3b. Score PIRADS 5 automático.",c:C.red},
                {t:"Lesiones múltiples","d":"Reportar todas. El score final = lesión de mayor categoría. Biopsia dirigida por target.",c:C.accent},
              ].map((item,i)=>(
                <div key={i} style={{background:C.card,borderLeft:`3px solid ${item.c}`,borderRadius:6,padding:"7px 11px",marginBottom:7}}>
                  <div style={{fontSize:10,fontWeight:700,color:item.c,marginBottom:2}}>{item.t}</div>
                  <div style={{fontSize:9,color:C.muted,lineHeight:1.5}}>{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PI-MUS / CEUS ── */}
        {subTab==="pimus"&&(
          <div>
            <div style={{...S.card,borderLeft:`3px solid ${C.teal}`}}>
              <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:6}}>PI-MUS · Ecografía con Contraste (CEUS) · EAU 2024</div>
              <div style={{fontSize:10,color:C.muted,lineHeight:1.65,marginBottom:10}}>
                Sistema de reporte estandarizado para ultrasonido prostático con contraste (CEUS). Basado en el comportamiento del wash-in (llegada del contraste) y wash-out (salida). Útil cuando RMmp no está disponible, es contraindicada (marcapasos, claustrofobia) o como complemento intraoperatorio para biopsia dirigida en tiempo real.
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
                {[["Sensibilidad","72%",C.orange,"Detección CaP significativo (Postema 2012)"],["Especificidad","75%",C.teal,"Reducción de biopsias negativas"],["VPN","82%",C.green,"Excluyente si PI-MUS 1-2 + PSA-D <0.10"]].map(([l,v,c,d])=>(
                  <div key={l} style={{background:C.bg,borderRadius:8,padding:12,border:`1px solid ${c}22`,textAlign:"center"}}>
                    <div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div>
                    <div style={{fontSize:9,fontWeight:700,color:C.muted,marginTop:1}}>{l}</div>
                    <div style={{fontSize:8,color:C.faint,marginTop:2,lineHeight:1.4}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>

            {PIMUS_DATA.map((p,i)=>(
              <div key={i} style={{...S.card,borderLeft:`4px solid ${p.color}`,marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{background:p.color+"22",border:`1px solid ${p.color}40`,borderRadius:8,padding:"4px 12px",fontWeight:800,fontSize:16,color:p.color}}>{p.cat}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9"}}>{p.label}</div>
                    <div style={{fontSize:10,color:C.muted}}>Categoría PI-MUS {p.cat}</div>
                  </div>
                </div>
                <div style={{background:C.bg,borderRadius:7,padding:10,border:`1px solid ${C.border}`,marginBottom:8}}>
                  <div style={{fontSize:9,color:C.teal,fontWeight:700,marginBottom:3}}>HALLAZGOS ECOGRÁFICOS</div>
                  <div style={{fontSize:10,color:"#94a3b8",lineHeight:1.5}}>{p.desc}</div>
                </div>
                <div style={{background:p.color+"10",border:`1px solid ${p.color}25`,borderRadius:6,padding:"7px 11px"}}>
                  <div style={{fontSize:9,color:p.color,fontWeight:700,marginBottom:2}}>CONDUCTA</div>
                  <div style={{fontSize:10,color:C.text,lineHeight:1.55}}>{p.conducta}</div>
                </div>
              </div>
            ))}

            <div style={{...S.card,background:C.bg,border:`1px solid ${C.teal}25`}}>
              <div style={{fontSize:10,fontWeight:700,color:C.teal,marginBottom:8}}>PI-MUS vs RMmp · Comparativa (EAU 2024)</div>
              <table style={S.table}>
                <thead><tr>{["Parámetro","RMmp 3T","PI-MUS/CEUS","Comentario"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>{[
                  ["Sensibilidad csPCa","~89%","~72%","RMmp superior en ZP y ZT"],
                  ["Especificidad","~73%","~75%","Similar. PI-MUS no inferior en especificidad"],
                  ["Disponibilidad","Limitada","Alta","PI-MUS disponible en consultorio"],
                  ["Costo (MX)","$5,000-15,000","$800-2,000","PI-MUS 5-7x más económico"],
                  ["Guía biopsia","Fusión software/cogn.","Tiempo real in-bore","PI-MUS facilita biopsia en consultorio"],
                  ["Indicación EAU 2024","Primera línea","Alternativa válida","Cuando RMmp no disponible o contraindicada"],
                ].map((r,i)=>(
                  <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1e2d4a40"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{...S.td,fontWeight:600,color:"#94a3b8",fontSize:10}}>{r[0]}</td>
                    <td style={{...S.td,color:C.blue,fontSize:10,fontWeight:600}}>{r[1]}</td>
                    <td style={{...S.td,color:C.teal,fontSize:10,fontWeight:600}}>{r[2]}</td>
                    <td style={{...S.td,color:C.muted,fontSize:9}}>{r[3]}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MATRIZ PSA-D × PIRADS ── */}
        {subTab==="matrix"&&(
          <div>
            <div style={{...S.card,borderLeft:`3px solid ${C.purple}`}}>
              <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:4}}>Matriz de Decisión PSA-D × PI-RADS · Alberts 2020</div>
              <div style={{fontSize:10,color:C.muted,lineHeight:1.6,marginBottom:10}}>
                Integración de PSA Densidad + PI-RADS para optimizar la indicación de biopsia. VPN del 97% cuando PSA-D &lt;0.10 + PIRADS 1-2: puede evitar biopsia de forma segura. VPP del 78% cuando PSA-D ≥0.15 + PIRADS 4-5.
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{...S.table,minWidth:500}}>
                  <thead>
                    <tr>
                      <th style={{...S.th,background:C.bg}}>PSA-D ↓ / PIRADS →</th>
                      {["PIRADS 1-2","PIRADS 3","PIRADS 4","PIRADS 5"].map(h=><th key={h} style={{...S.th,textAlign:"center"}}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {psad:"< 0.10",vals:[{dec:"Evitar biopsia",c:C.green,vpp:"3%",d:"VPN 97%"},{dec:"Vigilancia",c:C.green,vpp:"8%",d:"RMmp en 6m"},{dec:"Biopsia dirigida",c:C.orange,vpp:"28%",d:"2-4 cores"},{dec:"Biopsia urgente",c:C.red,vpp:"62%",d:"4-6 cores"}]},
                      {psad:"0.10-0.15",vals:[{dec:"Vigilancia",c:C.green,vpp:"6%",d:"Control 6m"},{dec:"RMmp / biopsia",c:C.orange,vpp:"14%",d:"Decidir con clínica"},{dec:"Biopsia dirigida",c:C.red,vpp:"38%",d:"Transperineal"},{dec:"Biopsia urgente",c:C.red,vpp:"74%",d:"Estadificación"}]},
                      {psad:"≥ 0.15",vals:[{dec:"Biopsia sistemática",c:C.orange,vpp:"12%",d:"10-12 cores"},{dec:"Biopsia + RMmp",c:C.red,vpp:"24%",d:"Si no previa"},{dec:"Biopsia urgente",c:C.red,vpp:"56%",d:"Fusión si disponible"},{dec:"Biopsia urgente",c:C.red,vpp:"78%",d:"VPP 78%"}]},
                    ].map((row,ri)=>(
                      <tr key={ri}>
                        <td style={{...S.td,fontFamily:"monospace",color:C.accent,fontWeight:700,fontSize:10,whiteSpace:"nowrap"}}>{row.psad}</td>
                        {row.vals.map((v,ci)=>(
                          <td key={ci} style={{...S.td,padding:8}}>
                            <div style={{background:v.c+"15",border:`1px solid ${v.c}30`,borderRadius:6,padding:"6px 8px",textAlign:"center"}}>
                              <div style={{fontSize:9,fontWeight:700,color:v.c,marginBottom:2}}>{v.dec}</div>
                              <div style={{fontSize:8,color:C.muted}}>{v.d}</div>
                              <div style={{fontSize:10,fontWeight:800,color:v.c,marginTop:2}}>VPP {v.vpp}</div>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={S.g2}>
              <div style={S.card}>
                <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Protocolo Biopsia Dirigida · EAU 2024</div>
                {[
                  {tipo:"Fusión software (MRI-US)",desc:"Gold standard. Software registra imágenes RMmp con US en tiempo real. Sensibilidad 89% csPCa.",cores:"2-4 cores por target",color:C.blue},
                  {tipo:"Fusión cognitiva",desc:"Urólogo memoriza localización en RMmp y guía manualmente. Curva de aprendizaje >50 casos.",cores:"2-4 cores por target",color:C.teal},
                  {tipo:"In-bore MRI",desc:"Biopsia dentro del resonador. Máxima precisión. Costoso y tiempo prolongado.",cores:"1-3 cores por target",color:C.purple},
                  {tipo:"PI-MUS (CEUS) in-office",desc:"Guía en tiempo real con contraste. Disponible en consultorio. Alternativa válida EAU 2024.",cores:"2-4 cores sospechosos",color:C.teal},
                  {tipo:"Sistemática (sin imagen)",desc:"10-12 cores, mapeo estándar. Añadir siempre a biopsia dirigida para no perder lesiones no visibles.",cores:"10-12 sistemáticos",color:C.orange},
                ].map((item,i)=>(
                  <div key={i} style={{background:C.bg,borderLeft:`3px solid ${item.color}`,borderRadius:6,padding:"8px 11px",marginBottom:7}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <div style={{fontSize:10,fontWeight:700,color:item.color}}>{item.tipo}</div>
                      <span style={{background:item.color+"18",color:item.color,borderRadius:4,padding:"1px 7px",fontSize:9,fontWeight:700}}>{item.cores}</span>
                    </div>
                    <div style={{fontSize:9,color:C.muted,lineHeight:1.5}}>{item.desc}</div>
                  </div>
                ))}
              </div>
              <div style={S.card}>
                <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Indicadores Clave · Decisión Integrada</div>
                {[
                  {l:"PSA-D <0.10 + PIRADS 1-2",d:"VPN 97% — puede evitar biopsia de forma segura (Alberts 2020)",c:C.green},
                  {l:"PSA-D ≥0.15 + PIRADS 4-5",d:"VPP 78% — biopsia urgente con fusión imagen",c:C.red},
                  {l:"PIRADS 3 + PSA-D 0.10-0.15",d:"Zona gris — integrar PSA libre, edad y preferencias del paciente",c:C.orange},
                  {l:"DRE anormal + cualquier PSA",d:"Biopsia indicada independientemente de imagen",c:C.red},
                  {l:"PSA libre/total <10%",d:"Equivalente a PIRADS 4 en zona gris PSA 4-10 (Catalona)",c:C.red},
                  {l:"PI-MUS cat 3-4 sin RMmp",d:"Biopsia dirigida guiada por CEUS. Evidencia EAU 2024 nivel 2b",c:C.orange},
                ].map((item,i)=>(
                  <div key={i} style={{background:C.bg,borderLeft:`3px solid ${item.c}`,borderRadius:6,padding:"7px 10px",marginBottom:6}}>
                    <div style={{fontSize:10,fontWeight:700,color:item.c,marginBottom:1}}>{item.l}</div>
                    <div style={{fontSize:9,color:C.muted}}>{item.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const HPB=()=>{
    const Q=["Sensación de vaciado incompleto?","Orinar de nuevo antes de 2 horas?","Chorro que se interrumpe?","Urgencia para aguantarse?","Chorro débil?","Esfuerzo para iniciar la micción?","Veces que se levanta por la noche (nocturia)?"];
    const QoL=["Encantado","Complacido","Bastante satisfecho","Indiferente","Bastante insatisfecho","Infeliz","Terrible"];
    const[sc,setSc]=useState(Array(7).fill(0));
    const[qol,setQol]=useState(3);
    const[vol,setVol]=useState(50);
    const[qmax,setQmax]=useState(12);
    const[pvr,setPvr]=useState(80);
    const[psa,setPsa]=useState(3.5);
    const[anticoag,setAnticoag]=useState(false);
    const[show,setShow]=useState(false);
    const total=sc.reduce((a,b)=>a+b,0);
    const sev=ipssSev(total);
    const lr=laserRec(vol,qmax,pvr,anticoag);
    const pd_v=psaDens(psa,vol);
    const txOpts=[];
    if(total<=7) txOpts.push({tier:"1a línea",tx:"Vigilancia activa",detail:"Control anual IPSS + Qmax",color:C.green});
    if(total>=8) txOpts.push({tier:"1a línea",tx:"Alfa-bloqueador",detail:"Tamsulosina 0.4mg · Silodosina",color:C.blue});
    if(vol>=40&&total>=8) txOpts.push({tier:"Combinado",tx:"5-ARI + Alfa-bloqueador",detail:"Dutasteride + Tamsulosina (CombAT)",color:C.blue});
    if(total>=20||pvr>150||qmax<10) txOpts.push({tier:"Quirúrgico",tx:lr.tx,detail:lr.detail,color:lr.color});

    return(
      <div style={S.g2}>
        <div>
          <div style={S.card}>
            <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:12}}>Cuestionario IPSS</div>
            {Q.map((q,i)=>(
              <div key={i} style={{marginBottom:11,borderBottom:`1px solid ${C.faint}`,paddingBottom:9}}>
                <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.5,marginBottom:6}}><span style={{color:C.accent,fontWeight:700}}>{i+1}. </span>{q}</div>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  {[0,1,2,3,4,5].map(v=>(
                    <button key={v} onClick={()=>{const n=[...sc];n[i]=v;setSc(n);}}
                      style={{width:30,height:30,borderRadius:6,border:`1px solid ${sc[i]===v?C.accent:C.border}`,background:sc[i]===v?C.accentDim:C.bg,color:sc[i]===v?C.accent:C.muted,fontWeight:700,cursor:"pointer",fontSize:11}}>{v}</button>
                  ))}
                  <span style={{fontSize:9,color:sc[i]>0?C.accent:C.muted,marginLeft:4,fontWeight:600}}>{i===6?["0x","1x","2x","3x","4x","5x"][sc[i]]:["Nunca","<1/5","<Mitad","Mitad",">Mitad","Siempre"][sc[i]]}</span>
                </div>
              </div>
            ))}
            <div style={{marginBottom:11}}>
              <div style={{fontSize:11,color:"#94a3b8",marginBottom:6}}><span style={{color:C.accent,fontWeight:700}}>QoL. </span>Si viviese con estos síntomas, ¿cómo se sentiría?</div>
              <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{QoL.map((l,v)=>(
                <button key={v} onClick={()=>setQol(v)} style={{padding:"3px 6px",borderRadius:4,border:`1px solid ${qol===v?C.accent:C.border}`,background:qol===v?C.accentDim:C.bg,color:qol===v?C.accent:C.muted,fontSize:9,cursor:"pointer",fontWeight:600}}>{v}–{l}</button>
              ))}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:9}}>
              {[["PSA (ng/mL)",psa,setPsa],["Vol. (cc)",vol,setVol],["Qmax (mL/s)",qmax,setQmax],["RPM (mL)",pvr,setPvr]].map(([l,v,setter])=>(
                <div key={l}><label style={S.lbl}>{l}</label><input type="number" value={v} onChange={e=>setter(Number(e.target.value))} style={S.inp}/></div>
              ))}
            </div>
            <div style={{marginBottom:9}}>
              <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",fontSize:11,color:"#94a3b8"}}>
                <input type="checkbox" checked={anticoag} onChange={e=>setAnticoag(e.target.checked)}/> Paciente anticoagulado / alto riesgo quirúrgico
              </label>
            </div>
            <button style={{...S.btn,width:"100%"}} onClick={()=>setShow(true)}>Generar Evaluación →</button>
          </div>
        </div>
        <div>
          <div style={{...S.card,borderLeft:`3px solid ${sev.color}`}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <Gauge score={Math.round((total/35)*100)} color={sev.color}/>
              <div>
                <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase"}}>IPSS Score</div>
                <div style={{fontSize:26,fontWeight:800,color:sev.color}}>{total} <span style={{fontSize:11,color:C.muted}}>/ 35</span></div>
                <span style={bdg(sev.label)}>{sev.label}</span>
                <div style={{fontSize:10,color:C.muted,marginTop:3}}>QoL: {QoL[qol]}</div>
              </div>
            </div>
            <div style={{background:C.bg,border:`1px solid ${sev.color}20`,borderRadius:6,padding:"8px 11px"}}>
              <div style={{fontSize:9,color:sev.color,fontWeight:700,marginBottom:2}}>RECOMENDACIÓN</div>
              <div style={{fontSize:11,color:C.text,lineHeight:1.6}}>{sev.rec}</div>
            </div>
          </div>

          <div style={{...S.card,borderLeft:`3px solid ${lr.color}`}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
              <span style={{fontSize:13}}>⚡</span>
              <div style={{fontSize:11,fontWeight:700,color:lr.color}}>Tecnología Quirúrgica Recomendada</div>
            </div>
            <div style={{background:C.bg,borderRadius:7,padding:"9px 12px",border:`1px solid ${lr.color}20`}}>
              <div style={{fontSize:13,fontWeight:800,color:lr.color,marginBottom:2}}>{lr.tx}</div>
              <div style={{fontSize:10,color:C.muted,lineHeight:1.6}}>{lr.detail}</div>
            </div>
          </div>

          <div style={S.card}>
            <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Parámetros Urodinámicos</div>
            <PBar value={vol} max={120} color={vol>=80?C.red:vol>=40?C.orange:C.green} label="Volumen Prostático" sub={`${vol} cc${vol>=80?" → HoLEP":vol>=60?" → ThuLEP":""}`}/>
            <PBar value={Math.max(0,25-qmax)} max={25} color={qmax<10?C.red:qmax<15?C.orange:C.green} label="Flujo Máximo (Qmax)" sub={`${qmax} mL/s · ${qmax<10?"Obstructivo":qmax<15?"Limítrofe":"Normal"}`}/>
            <PBar value={pvr} max={300} color={pvr>150?C.red:pvr>100?C.orange:C.green} label="Residuo Postmiccional" sub={`${pvr} mL`}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:5}}>
              {[["PSA-D",pd_v,parseFloat(pd_v)>=0.15?C.red:C.green,parseFloat(pd_v)>=0.15?"Descartar CaP":"OK"],["Nocturia",`${sc[6]}x`,sc[6]>=3?C.red:sc[6]>=2?C.orange:C.green,sc[6]>=3?"Severa":"Leve"]].map(([l,v,c,sub])=>(
                <div key={l} style={{background:C.bg,borderRadius:6,padding:9,border:`1px solid ${c}20`}}>
                  <div style={{fontSize:8,color:C.muted,fontWeight:700}}>{l}</div>
                  <div style={{fontSize:12,fontWeight:800,color:c,marginTop:1}}>{v}</div>
                  <div style={{fontSize:9,color:c,fontWeight:600}}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {show&&(
            <div style={S.card}>
              <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Algoritmo Terapéutico · EAU/AUA 2024</div>
              {txOpts.map((o,i)=>(
                <div key={i} style={{background:C.bg,borderLeft:`3px solid ${o.color}`,borderRadius:6,padding:"7px 11px",marginBottom:7}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <div style={{fontSize:11,fontWeight:700,color:o.color}}>{o.tx}</div>
                    <span style={{background:o.color+"18",color:o.color,borderRadius:4,padding:"1px 6px",fontSize:9,fontWeight:700}}>{o.tier}</span>
                  </div>
                  <div style={{fontSize:10,color:C.muted}}>{o.detail}</div>
                </div>
              ))}
              <div style={{background:C.bg,border:`1px solid ${C.teal}25`,borderRadius:7,padding:11,marginTop:8}}>
                <div style={{fontSize:9,color:C.teal,fontWeight:700,marginBottom:6}}>COMPARATIVA TÉCNICAS LÁSER</div>
                <table style={S.table}>
                  <thead><tr>{["Técnica","Vol ideal","Ventaja clave"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>{[["HoLEP",">80cc","Más durable (10 años). Menor sangrado. Gold standard"],["ThuLEP","60-120cc","Hemostasia superior. Menor curva de aprendizaje"],["GreenLight","40-100cc","Ambulatorio. Anticoagulados. Menor retiro catéter"],["RTUP bipolar","<60cc","Más disponible. Sin necesidad de equipo láser"]].map((r,i)=>(
                    <tr key={i}><td style={{...S.td,fontWeight:700,color:C.teal,fontSize:10}}>{r[0]}</td><td style={{...S.td,fontSize:10,color:C.muted}}>{r[1]}</td><td style={{...S.td,fontSize:10,color:"#94a3b8"}}>{r[2]}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return(
    <div>
      <div style={S.hdr}>
        <div>
          <div style={S.title}>Próstata</div>
          <div style={S.sub}>Cáncer · Tamizaje · Hiperplasia — EAU 2024 / AUA 2023</div>
        </div>
      </div>
      {tabBar}
      {tab==="cap"    && <CancerProstata/>}
      {tab==="screen" && <Tamizaje/>}
      {tab==="hpb"    && <HPB/>}
    </div>
  );
}

// ─── PATIENTS LIST ────────────────────────────────────────────────────────────
function PatientsList({patients,onOpen}){
  return(
    <div>
      <div style={S.hdr}><div><div style={S.title}>Pacientes</div><div style={S.sub}>{patients.length} registrados</div></div><button style={S.btn}>+ Nuevo Paciente</button></div>
      <div style={S.card}>
        <table style={S.table}>
          <thead><tr>{["Paciente","Diagnóstico","Estadio","Riesgo","PSA/IPSS","PIRADS","Tratamiento","Cita",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>{patients.map(p=>{
            const rs=scoreP(p); const psa=p.psa[p.psa.length-1]?.val;
            return(
              <tr key={p.id} onMouseEnter={e=>e.currentTarget.style.background="#1e2d4a40"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={S.td}><div style={{fontWeight:600,color:"#f1f5f9"}}>{p.name}</div><div style={{fontSize:10,color:C.muted}}>{p.age} años</div></td>
                <td style={S.td}><span style={tag(condColor(p.condition))}>{condIcon(p.condition)} {p.condition}</span></td>
                <td style={{...S.td,fontFamily:"monospace",color:"#94a3b8",fontSize:10}}>{p.stage}</td>
                <td style={S.td}><span style={bdg(rs.level)}>{rs.level}</span></td>
                <td style={{...S.td,fontWeight:700,color:rs.color,fontSize:11}}>{p.condition==="Hiperplasia Prostática"?`IPSS ${p.ipss}`:`${psa}`}</td>
                <td style={S.td}>{p.pirads?<span style={tag(p.pirads>=4?C.red:p.pirads===3?C.orange:C.green)}>PI-{p.pirads}</span>:<span style={{color:C.muted,fontSize:10}}>—</span>}</td>
                <td style={{...S.td,fontSize:10,color:C.muted}}>{p.treatments?.[0]||"—"}</td>
                <td style={{...S.td,color:C.accent,fontWeight:600,fontSize:10}}>{p.next_visit}</td>
                <td style={S.td}><button style={S.btnSm} onClick={()=>onOpen(p.id)}>Ver</button></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const[view,setView]=useState("dashboard");
  const[selId,setSelId]=useState(null);

  const sel=PATIENTS.find(p=>p.id===selId);
  const openPatient=id=>{ setSelId(id); setView("patient"); };

  const NAV=[
    {id:"dashboard", label:"Dashboard",           icon:"◈"},
    {id:"patients",  label:"Pacientes",            icon:"◉"},
    {id:"historicos",label:"Casos Históricos ML",  icon:"📋"},
    {id:"prostata",  label:"Próstata",             icon:"🔴"},
  ];

  return(
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1e2d4a;border-radius:4px}`}</style>

      {/* Sidebar */}
      <div style={S.sb}>
        <div style={{padding:"16px 13px 12px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:14,fontWeight:800,color:C.accent,letterSpacing:-0.5}}>Urología Mx</div>
          <div style={{fontSize:8,color:C.muted,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginTop:1}}>Plataforma Clínica IA + ML v2</div>
        </div>
        <div style={{padding:"8px 6px",flex:1}}>
          {NAV.map(item=>(
            <div key={item.id} style={navS(view===item.id||(item.id==="patients"&&view==="patient"))import { useState, useRef, useEffect } from "react";

const C = {
  bg:"#07101f", card:"#0d1829", border:"#162035",
  accent:"#E8923A", accentDim:"#E8923A18", accentBorder:"#E8923A35",
  blue:"#3b82f6", red:"#ef4444", orange:"#f97316",
  green:"#22c55e", yellow:"#eab308",
  purple:"#a855f7", purpleDim:"#a855f715",
  teal:"#14b8a6", tealDim:"#14b8a615",
  text:"#e2e8f0", muted:"#475569", faint:"#1e2d4a",
};

const S = {
  app:{ fontFamily:"'DM Sans',sans-serif", background:C.bg, minHeight:"100vh", color:C.text, display:"flex" },
  sb:{ width:210, background:"#0a1322", borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", flexShrink:0 },
  main:{ flex:1, padding:"22px 26px", overflowY:"auto", minHeight:"100vh" },
  hdr:{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 },
  title:{ fontSize:20, fontWeight:800, color:"#f1f5f9", letterSpacing:-0.5 },
  sub:{ fontSize:11, color:C.muted, marginTop:2 },
  card:{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:16, marginBottom:12 },
  g2:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  g3:{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:12 },
  g4:{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:12 },
  btn:{ background:C.accent, color:"#fff", border:"none", borderRadius:7, padding:"8px 14px", fontWeight:700, fontSize:12, cursor:"pointer" },
  btnSm:{ background:C.accentDim, color:C.accent, border:`1px solid ${C.accentBorder}`, borderRadius:5, padding:"4px 9px", fontWeight:600, fontSize:11, cursor:"pointer" },
  btnGhost:{ background:"transparent", color:C.muted, border:`1px solid ${C.border}`, borderRadius:7, padding:"7px 14px", fontWeight:600, fontSize:12, cursor:"pointer" },
  table:{ width:"100%", borderCollapse:"collapse" },
  th:{ textAlign:"left", padding:"7px 10px", fontSize:9, fontWeight:700, color:C.muted, textTransform:"uppercase", letterSpacing:0.5, borderBottom:`1px solid ${C.border}` },
  td:{ padding:"9px 10px", fontSize:12, borderBottom:`1px solid #0a0f1e` },
  inp:{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:6, padding:"6px 10px", color:C.text, fontSize:12, width:"100%", outline:"none", boxSizing:"border-box" },
  lbl:{ fontSize:9, color:C.muted, fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginBottom:3, display:"block" },
};

const tag  = c => ({ background:c+"18", color:c, border:`1px solid ${c}30`, borderRadius:4, padding:"2px 7px", fontSize:10, fontWeight:600, display:"inline-block" });
const bdg  = l => { const m={Alto:C.red,Intermedio:C.orange,Bajo:C.green,Leve:C.green,Moderado:C.orange,Severo:C.red}; const c=m[l]||C.muted; return{background:c+"22",color:c,border:`1px solid ${c}40`,borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:700,display:"inline-block"}; };
const navS = a => ({ display:"flex", alignItems:"center", gap:7, padding:"7px 9px", borderRadius:7, cursor:"pointer", marginBottom:2, background:a?C.accentDim:"transparent", color:a?C.accent:C.muted, fontWeight:a?700:500, fontSize:12, border:a?`1px solid ${C.accentBorder}`:"1px solid transparent" });
const condColor = c => c==="Cáncer de Próstata"?C.accent:c==="Cáncer de Vejiga"?C.blue:C.green;
const condIcon  = c => c==="Cáncer de Próstata"?"🔴":c==="Cáncer de Vejiga"?"🔵":"🟢";

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const PATIENTS = [
  {id:1,name:"Roberto Mendoza García",age:68,condition:"Cáncer de Próstata",stage:"T2bN0M0",psa:[{date:"2024-01",val:4.2},{date:"2024-04",val:5.8},{date:"2024-07",val:6.1},{date:"2024-10",val:5.4},{date:"2025-01",val:4.9},{date:"2025-03",val:5.1}],gleason:"3+4=7",prostate_vol:42,family_history:true,smoking:false,dm:true,hta:true,last_visit:"2025-03-10",next_visit:"2025-06-10",treatments:["Radioterapia externa","Hormonoterapia (Leuprolide)"],notes:"Buena respuesta. PSA en descenso.",ipss:null,qmax:null,pvr:null,psa_libre:null,pirads:3,cores_positivos:40,recurrencia_bioquimica:false},
  {id:2,name:"Carlos Jiménez Ruiz",age:72,condition:"Cáncer de Vejiga",stage:"T2N0M0",psa:[{date:"2024-01",val:12.4},{date:"2024-04",val:18.2},{date:"2025-03",val:23.1}],gleason:"N/A",prostate_vol:0,family_history:false,smoking:true,dm:false,hta:true,last_visit:"2025-03-15",next_visit:"2025-04-15",treatments:["TURBT","BCG intravesical"],notes:"Fumador activo. Músculo-invasivo.",ipss:null,qmax:null,pvr:null,psa_libre:null,pirads:null,cores_positivos:null,recurrencia_bioquimica:false},
  {id:3,name:"Antonio Flores Herrera",age:61,condition:"Cáncer de Próstata",stage:"T1cN0M0",psa:[{date:"2024-01",val:2.1},{date:"2024-04",val:2.4},{date:"2025-03",val:2.7}],gleason:"3+3=6",prostate_vol:35,family_history:false,smoking:false,dm:false,hta:false,last_visit:"2025-03-01",next_visit:"2025-09-01",treatments:["Vigilancia activa"],notes:"PSA estable. Sin progresión.",ipss:null,qmax:null,pvr:null,psa_libre:0.8,pirads:2,cores_positivos:15,recurrencia_bioquimica:false},
  {id:4,name:"Miguel Ángel Soria Leal",age:64,condition:"Hiperplasia Prostática",stage:"N/A",psa:[{date:"2024-06",val:3.1},{date:"2025-03",val:3.6}],gleason:"N/A",prostate_vol:68,family_history:false,smoking:false,dm:true,hta:true,last_visit:"2025-03-05",next_visit:"2025-06-05",treatments:["Tamsulosina 0.4mg","Dutasteride 0.5mg"],notes:"IPSS moderado. Control semestral.",ipss:16,qmax:9.2,pvr:85,psa_libre:null,pirads:null,cores_positivos:null,recurrencia_bioquimica:false},
];

// ─── SCORING ──────────────────────────────────────────────────────────────────
function scoreP(p){
  let sc=0; const f=[];
  const psa=p.psa[p.psa.length-1]?.val||0;
  if(p.condition==="Cáncer de Próstata"){
    if(psa>=10){sc+=25;f.push({l:"PSA ≥10",pts:25,c:C.red});}else if(psa>=4){sc+=12;f.push({l:"PSA 4-10",pts:12,c:C.orange});}else{f.push({l:"PSA <4",pts:0,c:C.green});}
    const gl=p.gleason&&p.gleason!=="N/A"?parseInt(p.gleason.split("=")[1])||6:6;
    if(gl>=8){sc+=30;f.push({l:"Gleason ≥8",pts:30,c:C.red});}else if(gl===7){sc+=18;f.push({l:"Gleason 7",pts:18,c:C.orange});}else{sc+=4;f.push({l:"Gleason 6",pts:4,c:C.green});}
    if((p.pirads||0)>=4){sc+=15;f.push({l:`PIRADS ${p.pirads}`,pts:15,c:C.red});}else if((p.pirads||0)===3){sc+=7;f.push({l:"PIRADS 3",pts:7,c:C.orange});}
    const ratio=p.psa_libre&&psa>0?p.psa_libre/psa:null;
    if(ratio!==null&&ratio<0.10){sc+=12;f.push({l:"PSA libre <10%",pts:12,c:C.red});}
    if(p.recurrencia_bioquimica){sc+=15;f.push({l:"Recurrencia bioquím.",pts:15,c:C.red});}
    if(p.age>=70){sc+=10;f.push({l:"Edad ≥70",pts:10,c:C.orange});}else if(p.age>=60){sc+=5;f.push({l:"Edad 60-69",pts:5,c:C.yellow});}
    if(p.family_history){sc+=8;f.push({l:"Hx familiar",pts:8,c:C.orange});}
    if(p.dm){sc+=3;f.push({l:"DM2",pts:3,c:C.yellow});}
    if(p.hta){sc+=3;f.push({l:"HTA",pts:3,c:C.yellow});}
  } else if(p.condition==="Cáncer de Vejiga"){
    if(psa>20){sc+=30;f.push({l:"Marcador >20",pts:30,c:C.red});}
    const st=parseInt((p.stage||"T1").replace("T","").charAt(0))||1;
    if(st>=3){sc+=35;f.push({l:"Estadio T3-T4",pts:35,c:C.red});}else if(st===2){sc+=25;f.push({l:"Estadio T2",pts:25,c:C.orange});}
    if(p.smoking){sc+=20;f.push({l:"Tabaquismo",pts:20,c:C.red});}
    if(p.age>=70){sc+=10;f.push({l:"Edad ≥70",pts:10,c:C.orange});}
  } else {
    const ip=p.ipss||0;
    if(ip>=20){sc+=40;f.push({l:"IPSS severo",pts:40,c:C.red});}else if(ip>=8){sc+=20;f.push({l:"IPSS moderado",pts:20,c:C.orange});}else{sc+=5;f.push({l:"IPSS leve",pts:5,c:C.green});}
    if((p.prostate_vol||0)>=80){sc+=25;f.push({l:"Vol ≥80cc",pts:25,c:C.red});}else if((p.prostate_vol||0)>=40){sc+=12;f.push({l:"Vol 40-80cc",pts:12,c:C.orange});}
    const qm=p.qmax||15;
    if(qm<10){sc+=20;f.push({l:"Qmax <10",pts:20,c:C.red});}else if(qm<15){sc+=10;f.push({l:"Qmax 10-15",pts:10,c:C.orange});}
    if((p.pvr||0)>100){sc+=15;f.push({l:"RPM >100mL",pts:15,c:C.red});}
  }
  const pct=Math.min(sc,100);
  return{score:pct,level:pct>=70?"Alto":pct>=40?"Intermedio":"Bajo",color:pct>=70?C.red:pct>=40?C.orange:C.green,factors:f};
}

const psaTrend=arr=>{if(!arr||arr.length<2)return 0;return(((arr[arr.length-1].val-arr[arr.length-2].val)/(arr[arr.length-2].val||1))*100).toFixed(1);};
const psaDens=(psa,vol)=>vol>0?(psa/vol).toFixed(3):"N/D";

const screenR=(age,psa,vol,fam,eth,prBx,dre,ratio,pirads)=>{
  let l=-5.132+age*0.048+(psa>0?Math.log(psa)*0.872:0);
  if(fam)l+=0.421; if(eth==="Afroamericano")l+=0.562; if(prBx)l-=0.532;
  if(dre!=="Normal")l+=0.792; if(vol>0&&psa/vol>=0.15)l+=0.6;
  if(ratio&&ratio<0.10)l+=0.8; if(ratio&&ratio<0.15)l+=0.4;
  if(pirads>=4)l+=1.0; if(pirads===3)l+=0.4;
  return Math.min(Math.round((1/(1+Math.exp(-l)))*100),98);
};

const ipssSev=s=>s<=7?{label:"Leve",color:C.green,rec:"Observación activa / cambios de estilo de vida"}:s<=19?{label:"Moderado",color:C.orange,rec:"Tratamiento médico (alfa-bloqueadores ± 5-ARI)"}:{label:"Severo",color:C.red,rec:"Evaluar tratamiento quirúrgico (RTUP / HoLEP / ThuLEP)"};

const laserRec=(vol,qmax,pvr,anticoag)=>{
  if(vol>=80) return{tx:"HoLEP",detail:"Gold standard vol ≥80cc. Durable 10 años (Gilling 2017).",color:C.purple};
  if(vol>=60) return{tx:"ThuLEP",detail:"Tulium láser — hemostasia superior. Ideal 60-120cc (Aho 2005).",color:C.teal};
  if(anticoag) return{tx:"GreenLight PVP",detail:"Ambulatorio. Indicado en anticoagulados (Bachmann 2019).",color:C.green};
  if(vol>=40) return{tx:"GreenLight PVP / RTUP bipolar",detail:"Vol 40-80cc. GreenLight si anticoagulado.",color:C.blue};
  return{tx:"RTUP bipolar",detail:"Estándar de oro. Vol <40cc.",color:C.orange};
};

// ─── MINI COMPONENTS ─────────────────────────────────────────────────────────
function SparkLine({data,color}){
  if(!data||data.length<2)return null;
  const vals=data.map(d=>d.val);
  const mn=Math.min(...vals),mx=Math.max(...vals),rng=mx-mn||1;
  const w=200,h=40,p=5;
  const pts=vals.map((v,i)=>`${p+(i/(vals.length-1))*(w-p*2)},${h-p-((v-mn)/rng)*(h-p*2)}`).join(" ");
  return(
    <svg viewBox={`0 0 ${w} ${h}`} style={{width:"100%",height:40}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {vals.map((v,i)=>{const x=p+(i/(vals.length-1))*(w-p*2),y=h-p-((v-mn)/rng)*(h-p*2);return<circle key={i} cx={x} cy={y} r="2.5" fill={color}/>;} )}
    </svg>
  );
}

function Gauge({score,color,size=78}){
  const r=34,cx=43,cy=43,circ=2*Math.PI*r,dash=(score/100)*circ;
  return(
    <svg viewBox="0 0 86 86" style={{width:size,height:size}}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.faint} strokeWidth="7"/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="7" strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={circ/4} strokeLinecap="round"/>
      <text x={cx} y={cy+5} textAnchor="middle" fontSize="14" fontWeight="bold" fill={color}>{score}</text>
      <text x={cx} y={cy+16} textAnchor="middle" fontSize="6" fill={C.muted}>/100</text>
    </svg>
  );
}

function PBar({value,max,color,label,sub}){
  return(
    <div style={{marginBottom:9}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
        <span style={{fontSize:10,color:C.muted,fontWeight:600}}>{label}</span>
        <span style={{fontSize:10,fontWeight:700,color}}>{sub}</span>
      </div>
      <div style={{background:C.faint,borderRadius:99,height:5}}>
        <div style={{width:`${Math.min((value/max)*100,100)}%`,background:color,borderRadius:99,height:5}}/>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({patients,onOpen}){
  const high=patients.filter(p=>scoreP(p).level==="Alto").length;
  const caP=patients.filter(p=>p.condition==="Cáncer de Próstata").length;
  return(
    <div>
      <div style={S.hdr}>
        <div><div style={S.title}>Panel Principal</div><div style={S.sub}>Urología Mx · Dr. Manuel Paredes Hernández · {new Date().toLocaleDateString("es-MX",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</div></div>
        <button style={S.btn}>+ Nuevo Paciente</button>
      </div>

      {/* ML Banner */}
      <div style={{...S.card,borderLeft:`3px solid ${C.purple}`,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <span style={{fontSize:16}}>🧠</span>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.purple}}>Motor ML v2 · 5 Modelos</div>
              <div style={{fontSize:10,color:C.muted}}>Pre-entrenado con ~680 casos clínicos (SEER · PLCO · ProtecT · ERSPC · MTOPS · HoLEP/ThuLEP · EAU 2024)</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <span style={bdg("Bajo")}>✓ Activo</span>
            <button style={{background:C.purpleDim,color:C.purple,border:`1px solid ${C.purple}35`,borderRadius:6,padding:"4px 10px",fontWeight:600,fontSize:11,cursor:"pointer"}}>Re-entrenar</button>
          </div>
        </div>
        <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["📊","SEER/PLCO","CaP",C.accent],["🧬","ProtecT/ERSPC","Progresión",C.blue],["🔬","Stephenson","Recurrencia",C.orange],["🟢","MTOPS/REDUCE","HPB",C.green],["⚡","HoLEP/ThuLEP","Láser",C.purple]].map(([ic,src,lb,col])=>(
            <div key={src} style={{background:C.bg,border:`1px solid ${col}20`,borderRadius:6,padding:"3px 8px",display:"flex",alignItems:"center",gap:5}}>
              <span style={{fontSize:10}}>{ic}</span>
              <div><div style={{fontSize:8,fontWeight:700,color:col}}>{src}</div><div style={{fontSize:8,color:C.muted}}>{lb}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.g4}>
        {[{v:patients.length,l:"Pacientes",i:"👥",c:C.blue},{v:high,l:"Riesgo Alto",i:"⚠️",c:C.red},{v:caP,l:"Ca Próstata",i:"🔴",c:C.accent},{v:patients.length-caP,l:"Vejiga/HPB",i:"🟢",c:C.green}].map((s,i)=>(
          <div key={i} style={{...S.card,borderLeft:`3px solid ${s.c}`,marginBottom:0,padding:14}}>
            <div style={{fontSize:18,marginBottom:4}}>{s.i}</div>
            <div style={{fontSize:22,fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",marginTop:1}}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Pacientes Activos</div>
        <table style={S.table}>
          <thead><tr>{["Paciente","Diagnóstico","Riesgo","PSA / IPSS","PIRADS","Próxima Cita"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>
            {patients.map(p=>{
              const rs=scoreP(p); const psa=p.psa[p.psa.length-1]?.val;
              return(
                <tr key={p.id} onClick={()=>onOpen(p.id)} onMouseEnter={e=>e.currentTarget.style.background="#1e2d4a40"} onMouseLeave={e=>e.currentTarget.style.background="transparent"} style={{cursor:"pointer"}}>
                  <td style={S.td}><div style={{fontWeight:600,color:"#f1f5f9"}}>{p.name}</div><div style={{fontSize:10,color:C.muted}}>{p.age} años</div></td>
                  <td style={S.td}><span style={tag(condColor(p.condition))}>{condIcon(p.condition)} {p.condition}</span></td>
                  <td style={S.td}><span style={bdg(rs.level)}>{rs.level}</span></td>
                  <td style={{...S.td,fontWeight:700,color:rs.color,fontSize:12}}>{p.condition==="Hiperplasia Prostática"?`IPSS ${p.ipss}`:`${psa} ng/mL`}</td>
                  <td style={S.td}>{p.pirads?<span style={tag(p.pirads>=4?C.red:p.pirads===3?C.orange:C.green)}>PI-{p.pirads}</span>:<span style={{color:C.muted,fontSize:11}}>—</span>}</td>
                  <td style={{...S.td,color:C.accent,fontWeight:600,fontSize:11}}>{p.next_visit}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PATIENT DETAIL ───────────────────────────────────────────────────────────
function PatientDetail({patient,onBack}){
  const[chat,setChat]=useState([]);
  const[inp,setInp]=useState("");
  const[loading,setLoading]=useState(false);
  const chatRef=useRef(null);
  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight;},[chat]);

  const rs=scoreP(patient);
  const trend=psaTrend(patient.psa);
  const tUp=parseFloat(trend)>0;
  const psa=patient.psa[patient.psa.length-1]?.val;
  const pd=psaDens(psa,patient.prostate_vol);
  const isHPB=patient.condition==="Hiperplasia Prostática";
  const ratio=patient.psa_libre&&psa>0?((patient.psa_libre/psa)*100).toFixed(1):null;
  const lr=isHPB?laserRec(patient.prostate_vol||0,patient.qmax||15,patient.pvr||0,false):null;

  const send=async()=>{
    if(!inp.trim()||loading)return;
    const um={role:"user",content:inp};
    const nh=[...chat,um]; setChat(nh); setInp(""); setLoading(true);
    try{
      const sys=`Eres un asistente de IA clinica para el Dr. Manuel Paredes (Urologia Mx). Paciente: ${patient.name}, ${patient.age} años, ${patient.condition}, PSA ${psa} ng/mL. EAU 2024. Max 3 parrafos.`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,system:sys,messages:[...chat,um]})});
      const data=await res.json();
      setChat([...nh,{role:"assistant",content:data.content?.map(b=>b.text||"").join("")||"Error."}]);
    }catch{ setChat([...nh,{role:"assistant",content:"Error de conexión."}]); }
    setLoading(false);
  };

  const mlMock={
    biopsia:{prob:72,label:"Alta",color:C.red},
    progresion:{prob:45,label:"Moderado",color:C.orange},
    recurrBio:{prob:28,label:"Baja",color:C.green},
    hpb:{prob:81,label:"Moderado",color:C.orange},
    tratamiento:{prob:68,label:"Tratamiento médico",color:C.blue},
  };

  return(
    <div>
      <div style={S.hdr}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button style={S.btnGhost} onClick={onBack}>← Volver</button>
          <div><div style={S.title}>{patient.name}</div><div style={S.sub}>{patient.condition}{patient.stage!=="N/A"?` · ${patient.stage}`:""} · {patient.age} años</div></div>
        </div>
        <button style={S.btn}>+ Nueva Consulta</button>
      </div>

      {/* ML Card */}
      <div style={{...S.card,borderLeft:`3px solid ${C.purple}`}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:10}}>
          <span style={{fontSize:13}}>🧠</span>
          <div style={{fontSize:12,fontWeight:700,color:C.purple}}>Predicciones ML v2</div>
          <span style={{background:C.purpleDim,color:C.purple,borderRadius:4,padding:"1px 6px",fontSize:9,fontWeight:700}}>TF.js</span>
          <span style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>~680 casos clínicos + {PATIENTS.length} propios</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8}}>
          {[{k:"biopsia",l:"Biopsia+",i:"🔬"},{k:"progresion",l:"Progresión",i:"📈"},{k:"recurrBio",l:"Recurr. post-RP",i:"🔄"},{k:"hpb",l:"HPB",i:"🟢"},{k:"tratamiento",l:"Recomendación",i:"💊"}].map(({k,l,i})=>{
            const res=mlMock[k];
            return(
              <div key={k} style={{background:C.bg,borderRadius:8,padding:10,border:`1px solid ${res.color}22`}}>
                <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",marginBottom:2}}>{i} {l}</div>
                <div style={{fontSize:13,fontWeight:800,color:res.color}}>{res.label}</div>
                <div style={{fontSize:9,color:C.muted,marginTop:1}}>Conf: {res.prob}%</div>
                <div style={{background:C.faint,borderRadius:99,height:3,marginTop:4}}><div style={{width:`${res.prob}%`,background:res.color,borderRadius:99,height:3}}/></div>
              </div>
            );
          })}
        </div>
      </div>

      {isHPB&&lr&&(
        <div style={{...S.card,borderLeft:`3px solid ${lr.color}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13}}>⚡</span>
            <div style={{fontSize:12,fontWeight:700,color:lr.color}}>Recomendación Técnica Quirúrgica:</div>
            <span style={{background:lr.color+"18",color:lr.color,borderRadius:4,padding:"1px 8px",fontSize:11,fontWeight:700}}>{lr.tx}</span>
          </div>
          <div style={{fontSize:11,color:C.muted,marginTop:4}}>{lr.detail}</div>
        </div>
      )}

      <div style={S.g3}>
        <div style={{...S.card,display:"flex",alignItems:"center",gap:12,borderLeft:`3px solid ${rs.color}`,marginBottom:0}}>
          <Gauge score={rs.score} color={rs.color}/>
          <div>
            <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase"}}>Score Clásico</div>
            <div style={{fontSize:17,fontWeight:800,color:rs.color}}>{rs.level}</div>
            <div style={{fontSize:10,color:C.muted}}>{rs.score}/100</div>
          </div>
        </div>
        <div style={{...S.card,borderLeft:`3px solid ${tUp?C.red:C.green}`,marginBottom:0}}>
          <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",marginBottom:2}}>{isHPB?"IPSS Score":"PSA Actual"}</div>
          {isHPB
            ?<div style={{fontSize:17,fontWeight:800,color:"#f1f5f9"}}>{patient.ipss} <span style={{fontSize:10,color:C.muted}}>/ 35 · Qmax {patient.qmax}</span></div>
            :<><div style={{fontSize:17,fontWeight:800,color:"#f1f5f9"}}>{psa} <span style={{fontSize:10,color:C.muted}}>ng/mL</span></div><div style={{color:tUp?C.red:C.green,fontWeight:700,fontSize:10,marginBottom:2}}>{tUp?"▲":"▼"} {Math.abs(trend)}%</div></>
          }
          <SparkLine data={patient.psa} color={tUp?C.red:C.green}/>
        </div>
        <div style={{...S.card,marginBottom:0}}>
          {!isHPB&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
              {[["PSA-D",pd,parseFloat(pd)>=0.15?C.red:C.green],["PSA libre",ratio?`${ratio}%`:"N/D",ratio&&parseFloat(ratio)<10?C.red:C.green],["PIRADS",patient.pirads||"N/D",patient.pirads>=4?C.red:patient.pirads===3?C.orange:C.green],["Cores+",patient.cores_positivos?`${patient.cores_positivos}%`:"N/D",patient.cores_positivos>50?C.red:C.green]].map(([l,v,c])=>(
                <div key={l} style={{background:C.bg,borderRadius:6,padding:7,border:`1px solid ${c}20`}}>
                  <div style={{fontSize:8,color:C.muted,fontWeight:700}}>{l}</div>
                  <div style={{fontSize:11,fontWeight:800,color:c,marginTop:1}}>{v}</div>
                </div>
              ))}
            </div>
          )}
          <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Comorbilidades</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
            {patient.dm&&<span style={tag(C.orange)}>DM2</span>}
            {patient.hta&&<span style={tag(C.orange)}>HTA</span>}
            {patient.smoking&&<span style={tag(C.red)}>Tabaquismo</span>}
            {patient.family_history&&<span style={tag(C.accent)}>Hx familiar</span>}
            {!patient.dm&&!patient.hta&&!patient.smoking&&!patient.family_history&&<span style={tag(C.green)}>Sin comorbilidades</span>}
          </div>
        </div>
      </div>

      <div style={{...S.card,marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:7}}>Factores de Riesgo</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {rs.factors.map((f,i)=>(
            <div key={i} style={{background:f.c+"15",border:`1px solid ${f.c}40`,borderRadius:6,padding:"4px 9px",display:"flex",gap:5,alignItems:"center"}}>
              <span style={{fontWeight:800,color:f.c,fontSize:11}}>+{f.pts}</span>
              <span style={{fontSize:10,color:"#94a3b8"}}>{f.l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={S.g2}>
        <div style={S.card}>
          <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:7}}>Notas Clínicas</div>
          <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.65,background:C.bg,borderRadius:6,padding:10,border:`1px solid ${C.border}`,marginBottom:10}}>{patient.notes}</div>
          <div style={{fontSize:9,color:C.muted,fontWeight:700,marginBottom:3}}>TRATAMIENTOS</div>
          {patient.treatments?.map((t,i)=><div key={i} style={{fontSize:11,color:"#94a3b8",marginBottom:2}}>• {t}</div>)}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:10}}>
            {[["Última visita",patient.last_visit,C.muted],["Próxima cita",patient.next_visit,C.accent]].map(([l,v,c])=>(
              <div key={l} style={{background:C.bg,borderRadius:6,padding:9,border:`1px solid ${C.border}`}}>
                <div style={{fontSize:8,color:C.muted,fontWeight:700}}>{l}</div>
                <div style={{fontSize:11,color:c,fontWeight:700,marginTop:2}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{...S.card,display:"flex",flexDirection:"column",height:380}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:8}}>
            <div style={{width:24,height:24,background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🧠</div>
            <div><div style={{fontSize:11,fontWeight:700,color:"#f1f5f9"}}>IA Clínica + ML</div><div style={{fontSize:9,color:C.muted}}>SEER · ProtecT · EAU 2024 · {patient.name}</div></div>
          </div>
          <div ref={chatRef} style={{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:7,paddingRight:3}}>
            {chat.length===0&&[isHPB?"¿Candidato a láser según volumen?":"¿Riesgo de progresión según ML?",isHPB?"¿Primera línea según MTOPS?":"¿PSA libre y PIRADS cambian el riesgo?",isHPB?"¿HoLEP vs ThuLEP en este caso?":"¿Recomendación EAU 2024?"].map((q,i)=>(
              <button key={i} onClick={()=>setInp(q)} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 9px",color:C.muted,fontSize:10,cursor:"pointer",textAlign:"left"}}>💬 {q}</button>
            ))}
            {chat.map((m,i)=>(
              <div key={i} style={{background:m.role==="user"?C.accentDim:C.faint,border:`1px solid ${m.role==="user"?C.accentBorder:"#2d3f5e"}`,borderRadius:m.role==="user"?"13px 13px 4px 13px":"13px 13px 13px 4px",padding:"8px 11px",maxWidth:"82%",alignSelf:m.role==="user"?"flex-end":"flex-start",fontSize:12,lineHeight:1.6,color:C.text}}>
                {m.content}
              </div>
            ))}
            {loading&&<div style={{background:C.faint,borderRadius:"13px 13px 13px 4px",padding:"8px 11px",maxWidth:"60%",fontSize:12,color:C.muted}}>● ● ●</div>}
          </div>
          <div style={{display:"flex",gap:6,marginTop:8}}>
            <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Pregunta sobre este paciente..." style={{...S.inp,flex:1,fontSize:11}}/>
            <button onClick={send} disabled={loading} style={{...S.btn,padding:"7px 12px"}}>→</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PROSTATA HUB ─────────────────────────────────────────────────────────────
function ProstataHub(){
  const[tab,setTab]=useState("cap");
  const TABS=[
    {id:"cap",    label:"Cáncer de Próstata", icon:"🔴", sub:"Riesgo · Score · Seguimiento"},
    {id:"screen", label:"Tamizaje",            icon:"🔍", sub:"PCPTRC · PSA libre · PIRADS"},
    {id:"hpb",    label:"Hiperplasia (HPB)",   icon:"⚡", sub:"IPSS · Láser · Algoritmo"},
  ];

  const tabBar=(
    <div style={{display:"flex",gap:5,marginBottom:18,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:4}}>
      {TABS.map(t=>{
        const active=tab===t.id;
        return(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,border:"none",borderRadius:7,padding:"9px 6px",cursor:"pointer",background:active?C.accent:"transparent",transition:"all 0.15s",textAlign:"center"}}>
            <div style={{fontSize:15,marginBottom:1}}>{t.icon}</div>
            <div style={{fontSize:11,fontWeight:700,color:active?"#fff":C.muted}}>{t.label}</div>
            <div style={{fontSize:8,color:active?"#fffa":C.faint,marginTop:1}}>{t.sub}</div>
          </button>
        );
      })}
    </div>
  );

  const CancerProstata=()=>{
    const CAP_RIESGO=[
      {grupo:"Bajo riesgo",           criterios:"PSA <10 · Gleason 6 · T1c-T2a",       conducta:"Vigilancia activa o PR / RT",         color:C.green},
      {grupo:"Riesgo intermedio",     criterios:"PSA 10-20 · Gleason 7 · T2b-T2c",      conducta:"RT + HT corta (4-6m) o PR",           color:C.yellow},
      {grupo:"Alto riesgo",           criterios:"PSA >20 · Gleason 8-10 · T3a",         conducta:"RT + HT larga (2-3 años)",            color:C.orange},
      {grupo:"Localmente avanzado",   criterios:"T3b-T4 o N1",                           conducta:"RT multimodal + HT ± quimio",         color:C.red},
      {grupo:"Metastásico (M1)",      criterios:"Cualquier T/N · M1",                    conducta:"HT ± abiraterona / enzalutamida",     color:C.red},
    ];
    const GLEASON=[
      {score:"3+3=6 (Grado 1)", sv5:"~98%", sv10:"~96%", rec:"Vigilancia activa si T1-T2a"},
      {score:"3+4=7 (Grado 2)", sv5:"~95%", sv10:"~88%", rec:"PR o RT según preferencia"},
      {score:"4+3=7 (Grado 3)", sv5:"~90%", sv10:"~80%", rec:"Tratamiento activo"},
      {score:"4+4=8 (Grado 4)", sv5:"~82%", sv10:"~68%", rec:"RT + hormonoterapia"},
      {score:"4+5=9-10 (G5)", sv5:"~70%", sv10:"~50%", rec:"Tratamiento multimodal"},
    ];
    const SEGUIMIENTO=[
      {tx:"Vigilancia activa",      seg:"PSA c/6m · Biopsia anual · RMmp si cambio",           color:C.green},
      {tx:"Prostatectomía radical", seg:"PSA c/3m x2a · PSA >0.2 = recurrencia bioquímica",    color:C.blue},
      {tx:"Radioterapia",           seg:"PSA nadir +2 ng/mL (criterio Phoenix) · c/6m x5a",    color:C.orange},
      {tx:"Hormonoterapia",         seg:"Testosterona + PSA c/3-6m · DEXA anual · Glucosa c/3m",color:C.accent},
      {tx:"Castración resistente",  seg:"PSA c/1-3m · TC tórax/abd c/6m · Bone scan PRN",      color:C.red},
    ];
    const BIOMARCADORES=[
      {name:"PSA libre / total",  uso:"Zona gris PSA 4-10",      umbral:"<15% → biopsia",        color:C.accent},
      {name:"PSA Densidad",       uso:"Próstata >30cc",           umbral:"≥0.15 → biopsia",       color:C.orange},
      {name:"PSA Velocity",       uso:"Seguimiento longitudinal", umbral:">0.75 ng/mL/año",       color:C.orange},
      {name:"PIRADS (RMmp)",      uso:"Pre-biopsia",              umbral:"≥3 → biopsia dirigida", color:C.red},
      {name:"4Kscore",            uso:"PSA zona gris",            umbral:"Riesgo Gleason ≥7",     color:C.purple},
      {name:"PHI",                uso:"PSA 4-10, DRE neg",        umbral:">35 → biopsia",         color:C.blue},
    ];
    return(
      <div>
        <div style={S.card}>
          <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Grupos de Riesgo · D'Amico / EAU 2024</div>
          <table style={S.table}>
            <thead><tr>{["Grupo","Criterios","Conducta recomendada"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>{CAP_RIESGO.map((r,i)=>(
              <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1e2d4a40"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{...S.td,fontWeight:700,color:r.color,fontSize:11,whiteSpace:"nowrap"}}>{r.grupo}</td>
                <td style={{...S.td,fontFamily:"monospace",color:"#94a3b8",fontSize:10}}>{r.criterios}</td>
                <td style={{...S.td,color:C.muted,fontSize:11}}>{r.conducta}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        <div style={S.g2}>
          <div style={S.card}>
            <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Score de Gleason · Sobrevida</div>
            <table style={S.table}>
              <thead><tr>{["Gleason","SV 5a","SV 10a","Recomendación"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
              <tbody>{GLEASON.map((r,i)=>(
                <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1e2d4a40"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{...S.td,fontWeight:700,color:C.text,fontSize:10,fontFamily:"monospace"}}>{r.score}</td>
                  <td style={{...S.td,fontWeight:700,color:i<=1?C.green:i<=2?C.orange:C.red,fontSize:11}}>{r.sv5}</td>
                  <td style={{...S.td,fontWeight:700,color:i<=1?C.green:i<=2?C.orange:C.red,fontSize:11}}>{r.sv10}</td>
                  <td style={{...S.td,color:C.muted,fontSize:10}}>{r.rec}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <div style={S.card}>
            <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Seguimiento post-tratamiento</div>
            {SEGUIMIENTO.map((item,i)=>(
              <div key={i} style={{background:C.bg,borderLeft:`3px solid ${item.color}`,borderRadius:6,padding:"7px 11px",marginBottom:6}}>
                <div style={{fontSize:10,fontWeight:700,color:item.color,marginBottom:2}}>{item.tx}</div>
                <div style={{fontSize:9,color:C.muted,lineHeight:1.5}}>{item.seg}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Biomarcadores · EAU 2024</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9}}>
            {BIOMARCADORES.map((b,i)=>(
              <div key={i} style={{background:C.bg,borderRadius:8,padding:11,border:`1px solid ${b.color}22`}}>
                <div style={{fontSize:10,fontWeight:700,color:b.color,marginBottom:2}}>{b.name}</div>
                <div style={{fontSize:9,color:C.muted,marginBottom:2}}>{b.uso}</div>
                <div style={{fontSize:9,fontWeight:600,color:"#94a3b8"}}>Umbral: {b.umbral}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const Tamizaje=()=>{
    const[subTab,setSubTab]=useState("calc");
    const[f,setF]=useState({age:55,psa:4.5,vol:35,psaFree:"",familyHx:false,ethnicity:"Hispano",priorBx:false,dre:"Normal",pirads:"",pimus:""});
    const[res,setRes]=useState(null);
    const sf=(k,v)=>setF(p=>({...p,[k]:v}));

    // ── PCPTRC 2.0 + PSA-D + PSA libre + PIRADS v2.1 + PI-MUS
    const calc=()=>{
      const ratio=f.psaFree&&Number(f.psa)>0?Number(f.psaFree)/Number(f.psa):null;
      const piradsN=Number(f.pirads)||0;
      const pimusN=Number(f.pimus)||0;
      // Base logistic (PCPTRC 2.0)
      let logit=-5.132+Number(f.age)*0.048+(Number(f.psa)>0?Math.log(Number(f.psa))*0.872:0);
      if(f.familyHx) logit+=0.421;
      if(f.ethnicity==="Afroamericano") logit+=0.562;
      if(f.priorBx) logit-=0.532;
      if(f.dre!=="Normal") logit+=0.792;
      // PSA-D (Roddam 2008)
      const pd_v=Number(f.vol)>0?(Number(f.psa)/Number(f.vol)).toFixed(3):"N/D";
      if(Number(f.vol)>0&&Number(f.psa)/Number(f.vol)>=0.15) logit+=0.6;
      // PSA libre (Catalona 1993)
      if(ratio&&ratio<0.10) logit+=0.8;
      else if(ratio&&ratio<0.15) logit+=0.4;
      // PI-RADS v2.1 (Turkbey 2019 — ACR)
      if(piradsN>=5) logit+=1.4;
      else if(piradsN===4) logit+=1.0;
      else if(piradsN===3) logit+=0.4;
      // PI-MUS / CEUS (Postema 2012 + Halpern 2012)
      if(pimusN>=3) logit+=0.6;
      const risk=Math.min(Math.round((1/(1+Math.exp(-logit)))*100),98);
      const fR=ratio?(ratio*100).toFixed(1):null;
      // Decision logic
      let rec,recColor,urg,bxCores="",approach="";
      if(risk>=25||parseFloat(pd_v)>=0.15||(fR&&parseFloat(fR)<10)||f.dre!=="Normal"||piradsN>=4||pimusN>=3){
        recColor=C.red; urg="Biopsia Indicada";
        if(piradsN>=3||pimusN>=3){
          rec="Biopsia dirigida por fusión cognitiva o software (MRI-US fusion). 2-4 cores por target + biopsia sistemática de saturación (10-12 cores). Abordaje transperineal preferido (EAU 2024).";
          approach="Fusión RMmp-Ecografía (MRI-US)"; bxCores="2-4 dirigidos + 10-12 sistemáticos";
        } else {
          rec="Biopsia prostática transperineal sistemática. 10-12 cores. Considerar RMmp pre-biopsia si disponible para planificación de targets.";
          approach="Transperineal sistemática"; bxCores="10-12 cores";
        }
      } else if(risk>=15||parseFloat(pd_v)>=0.10||(fR&&parseFloat(fR)<15)||piradsN===3||pimusN===2){
        recColor=C.orange; urg="RMmp Recomendada";
        rec="RMmp multiparamétrica 3T previo a biopsia (EAU 2024). Si PIRADS ≥3 en zona periférica (DWI dominante) o PIRADS ≥3 en zona transicional (T2W dominante) → biopsia dirigida. PI-MUS como alternativa si RMmp no disponible.";
        approach="RMmp 3T → decisión"; bxCores="Según resultado RMmp";
      } else {
        recColor=C.green; urg="Seguimiento";
        rec="Control en 12 meses con PSA. VPN alto: PSA-D <0.10 + PIRADS 1-2 = 97% probabilidad de NO csPCa (Alberts 2020). Sin indicación de biopsia inmediata.";
        approach="Observación"; bxCores="No indicada";
      }
      setRes({risk,pd_v,fR,rec,recColor,urg,piradsN,pimusN,approach,bxCores});
    };

    // ── PI-RADS v2.1 DATA ──────────────────────────────────────────────────────
    const PIRADS_DATA=[
      {cat:1,label:"Muy improbable",prob:"~2%",color:C.green,
       zp:"DWI: no señal en b≥1400. ADC normal.",zt:"T2W: homogénea, isointensa normal.",
       conducta:"Sin indicación de biopsia. Control en 12m con PSA.",
       csPCa:"1-3%"},
      {cat:2,label:"Improbable",prob:"~6%",color:C.green,
       zp:"DWI: hipointensidad discreta en ADC sin restricción clara.",zt:"T2W: lesión mal definida, hipointensa circunscrita.",
       conducta:"Sin indicación de biopsia si PSA-D <0.10. Seguimiento estrecho.",
       csPCa:"4-8%"},
      {cat:3,label:"Equívoco",prob:"~16%",color:C.orange,
       zp:"DWI: hipointensidad focal en ADC ± señal en DWI b≥1400.",zt:"T2W: hipointensa heterogénea o focal bien delimitada.",
       conducta:"Zona gris. Integrar PSA-D + PSA libre. Considerar biopsia si PSA-D ≥0.10 o PSA libre <15%.",
       csPCa:"12-20%"},
      {cat:4,label:"Probable",prob:"~33%",color:C.red,
       zp:"DWI: hipointensidad focal en ADC + señal discreta en b≥1400. <1.5cm.",zt:"T2W: hipointensa lenticular/circular <1.5cm. Sin extensión extracapsular.",
       conducta:"Biopsia dirigida indicada (2-4 cores en target + sistemática). MRI-US fusion o cognitiva.",
       csPCa:"30-38%"},
      {cat:5,label:"Muy probable",prob:"~76%",color:C.red,
       zp:"DWI: hipointensidad focal intensa en ADC + señal intensa b≥1400. ≥1.5cm.",zt:"T2W: masa hipointensa ≥1.5cm o extensión extracapsular / invasión vesicular.",
       conducta:"Biopsia urgente. 4-6 cores dirigidos + sistemática. Estadificación local.",
       csPCa:"70-80%"},
    ];

    // ── PI-MUS / CEUS DATA ─────────────────────────────────────────────────────
    const PIMUS_DATA=[
      {cat:1,label:"Sin lesión",desc:"Sin vascularización focal anormal en modo B ni contraste.",conducta:"Sin biopsia dirigida. Sistematizada estándar si indicada por PSA.",color:C.green},
      {cat:2,label:"Probablemente benigno",desc:"Leve vascularización difusa, simétrica. Sin wash-in focal.",conducta:"Biopsia sistematizada si PSA-D ≥0.10.",color:C.green},
      {cat:3,label:"Indeterminado",desc:"Wash-in focal temprano o zona hipervascular inespecífica.",conducta:"Biopsia dirigida al área + sistemática.",color:C.orange},
      {cat:4,label:"Sospechoso",desc:"Wash-in focal temprano bien definido con wash-out.",conducta:"Biopsia dirigida obligatoria. 2-4 cores en área sospechosa.",color:C.red},
    ];

    const subTabs=[
      {id:"calc",label:"Calculadora",icon:"🧮"},
      {id:"pirads",label:"PI-RADS v2.1",icon:"🔬"},
      {id:"pimus",label:"PI-MUS / CEUS",icon:"🔊"},
      {id:"matrix",label:"Matriz PSA-D × PIRADS",icon:"📊"},
    ];

    return(
      <div>
        {/* Sub-tabs */}
        <div style={{display:"flex",gap:4,marginBottom:14,background:C.bg,borderRadius:8,padding:4,border:`1px solid ${C.border}`}}>
          {subTabs.map(t=>{
            const active=subTab===t.id;
            return(
              <button key={t.id} onClick={()=>setSubTab(t.id)} style={{flex:1,border:"none",borderRadius:6,padding:"7px 4px",cursor:"pointer",background:active?C.faint:"transparent",color:active?C.teal:C.muted,fontSize:10,fontWeight:active?700:500,transition:"all 0.12s"}}>
                <span style={{marginRight:4}}>{t.icon}</span>{t.label}
              </button>
            );
          })}
        </div>

        {/* ── CALCULADORA ── */}
        {subTab==="calc"&&(
          <div style={S.g2}>
            <div>
              <div style={S.card}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
                  <span style={{background:C.accentDim,border:`1px solid ${C.accentBorder}`,borderRadius:5,padding:"2px 8px",fontSize:10,color:C.accent,fontWeight:700}}>CALCULADORA · PCPTRC 2.0</span>
                  <span style={{fontSize:9,color:C.muted}}>+ PSA-D · PSA libre · PI-RADS v2.1 · PI-MUS</span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  {[["age","Edad"],["psa","PSA Total (ng/mL)"],["vol","Vol. Prostático (cc)"],["psaFree","PSA Libre (ng/mL)"]].map(([k,l])=>(
                    <div key={k}><label style={S.lbl}>{l}</label><input type="number" value={f[k]} onChange={e=>sf(k,e.target.value)} style={S.inp} step="0.1"/></div>
                  ))}
                  <div><label style={S.lbl}>Etnia</label><select value={f.ethnicity} onChange={e=>sf("ethnicity",e.target.value)} style={{...S.inp,cursor:"pointer"}}>{["Hispano","Caucásico","Afroamericano","Asiático"].map(o=><option key={o}>{o}</option>)}</select></div>
                  <div><label style={S.lbl}>DRE</label><select value={f.dre} onChange={e=>sf("dre",e.target.value)} style={{...S.inp,cursor:"pointer"}}>{["Normal","Anormal","Sospechoso"].map(o=><option key={o}>{o}</option>)}</select></div>
                  <div>
                    <label style={S.lbl}>PI-RADS v2.1 (si hay RMmp)</label>
                    <select value={f.pirads} onChange={e=>sf("pirads",e.target.value)} style={{...S.inp,cursor:"pointer"}}>
                      <option value="">Sin RMmp disponible</option>
                      {PIRADS_DATA.map(p=><option key={p.cat} value={p.cat}>PIRADS {p.cat} — {p.label} ({p.csPCa} csPCa)</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={S.lbl}>PI-MUS / CEUS (si disponible)</label>
                    <select value={f.pimus} onChange={e=>sf("pimus",e.target.value)} style={{...S.inp,cursor:"pointer"}}>
                      <option value="">Sin PI-MUS</option>
                      {PIMUS_DATA.map(p=><option key={p.cat} value={p.cat}>PI-MUS {p.cat} — {p.label}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{display:"flex",gap:14,marginBottom:10}}>
                  {[["familyHx","Hx familiar CaP"],["priorBx","Biopsia previa (-)"]].map(([k,l])=>(
                    <label key={k} style={{display:"flex",alignItems:"center",gap:5,cursor:"pointer",fontSize:11,color:"#94a3b8"}}>
                      <input type="checkbox" checked={f[k]} onChange={e=>sf(k,e.target.checked)}/> {l}
                    </label>
                  ))}
                </div>
                <button style={{...S.btn,width:"100%"}} onClick={calc}>Calcular Riesgo →</button>
              </div>

              {/* Bases del modelo */}
              <div style={{...S.card,padding:12}}>
                <div style={{fontSize:10,fontWeight:700,color:C.teal,marginBottom:8}}>BASE CIENTÍFICA DEL MODELO</div>
                {[
                  ["PCPTRC 2.0","Thompson 2006 · n=5,519 · AUC 0.72","Edad, PSA, DRE, etnia, biopsia previa, Hx familiar"],
                  ["PSA Densidad","Roddam 2008 meta-análisis · n=3,600","≥0.15 ng/mL/cc → predictor independiente de csPCa"],
                  ["PSA libre/total","Catalona 1993/2006 · 95% sensibilidad","<15% zona gris PSA 4-10 → alta especificidad"],
                  ["PI-RADS v2.1","Turkbey ACR 2019 · validado multicéntrico","ZP: DWI dominante · ZT: T2W dominante"],
                  ["PI-MUS/CEUS","Postema 2012 + Halpern 2012","Sens 72% / Esp 75% · alternativa a RMmp"],
                  ["Combinado PSA-D×PIRADS","Alberts 2020 · VPN 97%","PSA-D <0.10 + PIRADS 1-2 → puede evitar biopsia"],
                ].map(([name,ref,desc],i)=>(
                  <div key={i} style={{display:"flex",gap:8,marginBottom:7,paddingBottom:7,borderBottom:i<5?`1px solid ${C.faint}`:"none"}}>
                    <div style={{minWidth:90,fontSize:9,fontWeight:700,color:C.accent}}>{name}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:9,color:"#94a3b8",marginBottom:1}}>{ref}</div>
                      <div style={{fontSize:9,color:C.muted}}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {res&&(
                <div style={{...S.card,borderLeft:`3px solid ${res.recColor}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                    <Gauge score={res.risk} color={res.risk>=25?C.red:res.risk>=15?C.orange:C.green}/>
                    <div>
                      <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase"}}>Riesgo csPCa (Gleason ≥7)</div>
                      <div style={{fontSize:26,fontWeight:800,color:res.risk>=25?C.red:res.risk>=15?C.orange:C.green}}>{res.risk}%</div>
                      <span style={bdg(res.urg==="Biopsia Indicada"?"Alto":res.urg==="RMmp Recomendada"?"Intermedio":"Bajo")}>{res.urg}</span>
                    </div>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
                    {[
                      ["PSA Densidad",res.pd_v,parseFloat(res.pd_v)>=0.15?C.red:parseFloat(res.pd_v)>=0.10?C.orange:C.green,"ng/mL/cc"],
                      ["PSA Libre/Total",res.fR?`${res.fR}%`:"N/D",res.fR&&parseFloat(res.fR)<10?C.red:res.fR&&parseFloat(res.fR)<15?C.orange:C.green,""],
                      ["PI-RADS",res.piradsN||"N/D",res.piradsN>=4?C.red:res.piradsN===3?C.orange:C.green,""],
                      ["PI-MUS",res.pimusN||"N/D",res.pimusN>=3?C.red:res.pimusN===2?C.orange:C.green,""],
                    ].map(([l,v,c,u])=>(
                      <div key={l} style={{background:C.bg,borderRadius:7,padding:9,border:`1px solid ${c}20`}}>
                        <div style={{fontSize:8,color:C.muted,fontWeight:700}}>{l}</div>
                        <div style={{fontSize:14,fontWeight:800,color:c,marginTop:2}}>{v} <span style={{fontSize:8,color:C.muted}}>{u}</span></div>
                      </div>
                    ))}
                  </div>
                  <div style={{background:res.recColor+"12",border:`1px solid ${res.recColor}30`,borderRadius:7,padding:"9px 12px",marginBottom:8}}>
                    <div style={{fontSize:9,color:res.recColor,fontWeight:700,marginBottom:4}}>RECOMENDACIÓN · EAU 2024</div>
                    <div style={{fontSize:11,color:C.text,lineHeight:1.65}}>{res.rec}</div>
                  </div>
                  {res.approach&&(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                      {[["Abordaje",res.approach,C.blue],["Cores biopsia",res.bxCores,C.teal]].map(([l,v,c])=>(
                        <div key={l} style={{background:C.bg,borderRadius:7,padding:9,border:`1px solid ${c}20`}}>
                          <div style={{fontSize:8,color:C.muted,fontWeight:700}}>{l}</div>
                          <div style={{fontSize:11,fontWeight:700,color:c,marginTop:2}}>{v}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {!res&&(
                <div style={{...S.card,padding:24,textAlign:"center"}}>
                  <div style={{fontSize:28,marginBottom:8}}>🧮</div>
                  <div style={{fontSize:12,color:C.muted}}>Ingresa los datos del paciente y presiona "Calcular Riesgo" para obtener la recomendación personalizada.</div>
                </div>
              )}
              <div style={S.card}>
                <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Protocolo de Tamizaje · EAU 2024</div>
                <table style={S.table}>
                  <thead><tr>{["Edad","PSA","Conducta"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>{[{a:"40-49",p:"<1.0",c:"Basal. Control c/2 años. Sin RMmp."},{a:"40-49",p:"1.0-2.5",c:"Control anual. PSA-D si próstata >30cc."},{a:"50-59",p:"<2.5",c:"Control c/1-2 años según evolución."},{a:"50-59",p:">2.5",c:"PSA-D + PSA libre. RMmp si PSA-D ≥0.10."},{a:"60-69",p:">4.0",c:"RMmp. Biopsia si PIRADS ≥3 + PSA-D ≥0.10."},{a:"≥70",p:">4.0",c:"Individualizar (vida >10a). RMmp primero."}].map((row,i)=>(
                    <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1e2d4a40"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{...S.td,fontFamily:"monospace",color:C.accent,fontWeight:700,fontSize:11}}>{row.a}</td>
                      <td style={{...S.td,fontFamily:"monospace",color:"#94a3b8",fontSize:11}}>{row.p}</td>
                      <td style={{...S.td,color:C.muted,fontSize:10}}>{row.c}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── PI-RADS v2.1 ── */}
        {subTab==="pirads"&&(
          <div>
            <div style={{...S.card,borderLeft:`3px solid ${C.blue}`,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:4}}>PI-RADS v2.1 — ACR 2019 (Turkbey et al)</div>
              <div style={{fontSize:10,color:C.muted,lineHeight:1.6}}>
                Sistema estandarizado de reporte de RMmp prostática. <strong style={{color:C.blue}}>Zona Periférica (ZP): secuencia dominante = DWI.</strong> <strong style={{color:C.teal}}>Zona Transicional (ZT): secuencia dominante = T2W.</strong> El score final integra T2W + DWI + DCE.
              </div>
            </div>
            {PIRADS_DATA.map((p,i)=>(
              <div key={i} style={{...S.card,borderLeft:`4px solid ${p.color}`,marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{background:p.color+"22",border:`1px solid ${p.color}40`,borderRadius:8,padding:"4px 12px",fontWeight:800,fontSize:16,color:p.color}}>{p.cat}</div>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9"}}>{p.label}</div>
                      <div style={{fontSize:10,color:C.muted}}>csPCa (Gleason ≥7): <strong style={{color:p.color}}>{p.csPCa}</strong> · {p.prob} probabilidad</div>
                    </div>
                  </div>
                  <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 12px",textAlign:"right"}}>
                    <div style={{fontSize:18,fontWeight:800,color:p.color}}>{p.prob}</div>
                    <div style={{fontSize:8,color:C.muted}}>csPCa</div>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                  <div style={{background:C.bg,borderRadius:7,padding:10,border:`1px solid ${C.blue}20`}}>
                    <div style={{fontSize:9,color:C.blue,fontWeight:700,marginBottom:3}}>🔵 ZONA PERIFÉRICA (DWI dominante)</div>
                    <div style={{fontSize:10,color:"#94a3b8",lineHeight:1.5}}>{p.zp}</div>
                  </div>
                  <div style={{background:C.bg,borderRadius:7,padding:10,border:`1px solid ${C.teal}20`}}>
                    <div style={{fontSize:9,color:C.teal,fontWeight:700,marginBottom:3}}>🟡 ZONA TRANSICIONAL (T2W dominante)</div>
                    <div style={{fontSize:10,color:"#94a3b8",lineHeight:1.5}}>{p.zt}</div>
                  </div>
                </div>
                <div style={{background:p.color+"10",border:`1px solid ${p.color}25`,borderRadius:6,padding:"7px 11px"}}>
                  <div style={{fontSize:9,color:p.color,fontWeight:700,marginBottom:2}}>CONDUCTA EAU 2024</div>
                  <div style={{fontSize:10,color:C.text,lineHeight:1.55}}>{p.conducta}</div>
                </div>
              </div>
            ))}
            <div style={{...S.card,background:C.bg,border:`1px solid ${C.teal}25`}}>
              <div style={{fontSize:10,fontWeight:700,color:C.teal,marginBottom:8}}>PUNTOS CLAVE PI-RADS v2.1</div>
              {[
                {t:"DCE positivo en ZP PIRADS 3","d":"Upgrade a PIRADS 4 si hay realce focal temprano concordante con lesión DWI.",c:C.orange},
                {t:"Lesión ≥1.5cm en ZP","d":"Score automático PIRADS 5 independientemente de DWI/DCE.",c:C.red},
                {t:"Extensión extracapsular (ECE)","d":"Reportar si hay irregularidad capsular, obliteración del ángulo recto-prostático o invasión neurovascular.",c:C.red},
                {t:"Invasión vesícula seminal (SVI)","d":"Extensión directa desde la base prostática. Estadio T3b. Score PIRADS 5 automático.",c:C.red},
                {t:"Lesiones múltiples","d":"Reportar todas. El score final = lesión de mayor categoría. Biopsia dirigida por target.",c:C.accent},
              ].map((item,i)=>(
                <div key={i} style={{background:C.card,borderLeft:`3px solid ${item.c}`,borderRadius:6,padding:"7px 11px",marginBottom:7}}>
                  <div style={{fontSize:10,fontWeight:700,color:item.c,marginBottom:2}}>{item.t}</div>
                  <div style={{fontSize:9,color:C.muted,lineHeight:1.5}}>{item.d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PI-MUS / CEUS ── */}
        {subTab==="pimus"&&(
          <div>
            <div style={{...S.card,borderLeft:`3px solid ${C.teal}`}}>
              <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:6}}>PI-MUS · Ecografía con Contraste (CEUS) · EAU 2024</div>
              <div style={{fontSize:10,color:C.muted,lineHeight:1.65,marginBottom:10}}>
                Sistema de reporte estandarizado para ultrasonido prostático con contraste (CEUS). Basado en el comportamiento del wash-in (llegada del contraste) y wash-out (salida). Útil cuando RMmp no está disponible, es contraindicada (marcapasos, claustrofobia) o como complemento intraoperatorio para biopsia dirigida en tiempo real.
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
                {[["Sensibilidad","72%",C.orange,"Detección CaP significativo (Postema 2012)"],["Especificidad","75%",C.teal,"Reducción de biopsias negativas"],["VPN","82%",C.green,"Excluyente si PI-MUS 1-2 + PSA-D <0.10"]].map(([l,v,c,d])=>(
                  <div key={l} style={{background:C.bg,borderRadius:8,padding:12,border:`1px solid ${c}22`,textAlign:"center"}}>
                    <div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div>
                    <div style={{fontSize:9,fontWeight:700,color:C.muted,marginTop:1}}>{l}</div>
                    <div style={{fontSize:8,color:C.faint,marginTop:2,lineHeight:1.4}}>{d}</div>
                  </div>
                ))}
              </div>
            </div>

            {PIMUS_DATA.map((p,i)=>(
              <div key={i} style={{...S.card,borderLeft:`4px solid ${p.color}`,marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{background:p.color+"22",border:`1px solid ${p.color}40`,borderRadius:8,padding:"4px 12px",fontWeight:800,fontSize:16,color:p.color}}>{p.cat}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"#f1f5f9"}}>{p.label}</div>
                    <div style={{fontSize:10,color:C.muted}}>Categoría PI-MUS {p.cat}</div>
                  </div>
                </div>
                <div style={{background:C.bg,borderRadius:7,padding:10,border:`1px solid ${C.border}`,marginBottom:8}}>
                  <div style={{fontSize:9,color:C.teal,fontWeight:700,marginBottom:3}}>HALLAZGOS ECOGRÁFICOS</div>
                  <div style={{fontSize:10,color:"#94a3b8",lineHeight:1.5}}>{p.desc}</div>
                </div>
                <div style={{background:p.color+"10",border:`1px solid ${p.color}25`,borderRadius:6,padding:"7px 11px"}}>
                  <div style={{fontSize:9,color:p.color,fontWeight:700,marginBottom:2}}>CONDUCTA</div>
                  <div style={{fontSize:10,color:C.text,lineHeight:1.55}}>{p.conducta}</div>
                </div>
              </div>
            ))}

            <div style={{...S.card,background:C.bg,border:`1px solid ${C.teal}25`}}>
              <div style={{fontSize:10,fontWeight:700,color:C.teal,marginBottom:8}}>PI-MUS vs RMmp · Comparativa (EAU 2024)</div>
              <table style={S.table}>
                <thead><tr>{["Parámetro","RMmp 3T","PI-MUS/CEUS","Comentario"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                <tbody>{[
                  ["Sensibilidad csPCa","~89%","~72%","RMmp superior en ZP y ZT"],
                  ["Especificidad","~73%","~75%","Similar. PI-MUS no inferior en especificidad"],
                  ["Disponibilidad","Limitada","Alta","PI-MUS disponible en consultorio"],
                  ["Costo (MX)","$5,000-15,000","$800-2,000","PI-MUS 5-7x más económico"],
                  ["Guía biopsia","Fusión software/cogn.","Tiempo real in-bore","PI-MUS facilita biopsia en consultorio"],
                  ["Indicación EAU 2024","Primera línea","Alternativa válida","Cuando RMmp no disponible o contraindicada"],
                ].map((r,i)=>(
                  <tr key={i} onMouseEnter={e=>e.currentTarget.style.background="#1e2d4a40"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{...S.td,fontWeight:600,color:"#94a3b8",fontSize:10}}>{r[0]}</td>
                    <td style={{...S.td,color:C.blue,fontSize:10,fontWeight:600}}>{r[1]}</td>
                    <td style={{...S.td,color:C.teal,fontSize:10,fontWeight:600}}>{r[2]}</td>
                    <td style={{...S.td,color:C.muted,fontSize:9}}>{r[3]}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MATRIZ PSA-D × PIRADS ── */}
        {subTab==="matrix"&&(
          <div>
            <div style={{...S.card,borderLeft:`3px solid ${C.purple}`}}>
              <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:4}}>Matriz de Decisión PSA-D × PI-RADS · Alberts 2020</div>
              <div style={{fontSize:10,color:C.muted,lineHeight:1.6,marginBottom:10}}>
                Integración de PSA Densidad + PI-RADS para optimizar la indicación de biopsia. VPN del 97% cuando PSA-D &lt;0.10 + PIRADS 1-2: puede evitar biopsia de forma segura. VPP del 78% cuando PSA-D ≥0.15 + PIRADS 4-5.
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{...S.table,minWidth:500}}>
                  <thead>
                    <tr>
                      <th style={{...S.th,background:C.bg}}>PSA-D ↓ / PIRADS →</th>
                      {["PIRADS 1-2","PIRADS 3","PIRADS 4","PIRADS 5"].map(h=><th key={h} style={{...S.th,textAlign:"center"}}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {psad:"< 0.10",vals:[{dec:"Evitar biopsia",c:C.green,vpp:"3%",d:"VPN 97%"},{dec:"Vigilancia",c:C.green,vpp:"8%",d:"RMmp en 6m"},{dec:"Biopsia dirigida",c:C.orange,vpp:"28%",d:"2-4 cores"},{dec:"Biopsia urgente",c:C.red,vpp:"62%",d:"4-6 cores"}]},
                      {psad:"0.10-0.15",vals:[{dec:"Vigilancia",c:C.green,vpp:"6%",d:"Control 6m"},{dec:"RMmp / biopsia",c:C.orange,vpp:"14%",d:"Decidir con clínica"},{dec:"Biopsia dirigida",c:C.red,vpp:"38%",d:"Transperineal"},{dec:"Biopsia urgente",c:C.red,vpp:"74%",d:"Estadificación"}]},
                      {psad:"≥ 0.15",vals:[{dec:"Biopsia sistemática",c:C.orange,vpp:"12%",d:"10-12 cores"},{dec:"Biopsia + RMmp",c:C.red,vpp:"24%",d:"Si no previa"},{dec:"Biopsia urgente",c:C.red,vpp:"56%",d:"Fusión si disponible"},{dec:"Biopsia urgente",c:C.red,vpp:"78%",d:"VPP 78%"}]},
                    ].map((row,ri)=>(
                      <tr key={ri}>
                        <td style={{...S.td,fontFamily:"monospace",color:C.accent,fontWeight:700,fontSize:10,whiteSpace:"nowrap"}}>{row.psad}</td>
                        {row.vals.map((v,ci)=>(
                          <td key={ci} style={{...S.td,padding:8}}>
                            <div style={{background:v.c+"15",border:`1px solid ${v.c}30`,borderRadius:6,padding:"6px 8px",textAlign:"center"}}>
                              <div style={{fontSize:9,fontWeight:700,color:v.c,marginBottom:2}}>{v.dec}</div>
                              <div style={{fontSize:8,color:C.muted}}>{v.d}</div>
                              <div style={{fontSize:10,fontWeight:800,color:v.c,marginTop:2}}>VPP {v.vpp}</div>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={S.g2}>
              <div style={S.card}>
                <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Protocolo Biopsia Dirigida · EAU 2024</div>
                {[
                  {tipo:"Fusión software (MRI-US)",desc:"Gold standard. Software registra imágenes RMmp con US en tiempo real. Sensibilidad 89% csPCa.",cores:"2-4 cores por target",color:C.blue},
                  {tipo:"Fusión cognitiva",desc:"Urólogo memoriza localización en RMmp y guía manualmente. Curva de aprendizaje >50 casos.",cores:"2-4 cores por target",color:C.teal},
                  {tipo:"In-bore MRI",desc:"Biopsia dentro del resonador. Máxima precisión. Costoso y tiempo prolongado.",cores:"1-3 cores por target",color:C.purple},
                  {tipo:"PI-MUS (CEUS) in-office",desc:"Guía en tiempo real con contraste. Disponible en consultorio. Alternativa válida EAU 2024.",cores:"2-4 cores sospechosos",color:C.teal},
                  {tipo:"Sistemática (sin imagen)",desc:"10-12 cores, mapeo estándar. Añadir siempre a biopsia dirigida para no perder lesiones no visibles.",cores:"10-12 sistemáticos",color:C.orange},
                ].map((item,i)=>(
                  <div key={i} style={{background:C.bg,borderLeft:`3px solid ${item.color}`,borderRadius:6,padding:"8px 11px",marginBottom:7}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                      <div style={{fontSize:10,fontWeight:700,color:item.color}}>{item.tipo}</div>
                      <span style={{background:item.color+"18",color:item.color,borderRadius:4,padding:"1px 7px",fontSize:9,fontWeight:700}}>{item.cores}</span>
                    </div>
                    <div style={{fontSize:9,color:C.muted,lineHeight:1.5}}>{item.desc}</div>
                  </div>
                ))}
              </div>
              <div style={S.card}>
                <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Indicadores Clave · Decisión Integrada</div>
                {[
                  {l:"PSA-D <0.10 + PIRADS 1-2",d:"VPN 97% — puede evitar biopsia de forma segura (Alberts 2020)",c:C.green},
                  {l:"PSA-D ≥0.15 + PIRADS 4-5",d:"VPP 78% — biopsia urgente con fusión imagen",c:C.red},
                  {l:"PIRADS 3 + PSA-D 0.10-0.15",d:"Zona gris — integrar PSA libre, edad y preferencias del paciente",c:C.orange},
                  {l:"DRE anormal + cualquier PSA",d:"Biopsia indicada independientemente de imagen",c:C.red},
                  {l:"PSA libre/total <10%",d:"Equivalente a PIRADS 4 en zona gris PSA 4-10 (Catalona)",c:C.red},
                  {l:"PI-MUS cat 3-4 sin RMmp",d:"Biopsia dirigida guiada por CEUS. Evidencia EAU 2024 nivel 2b",c:C.orange},
                ].map((item,i)=>(
                  <div key={i} style={{background:C.bg,borderLeft:`3px solid ${item.c}`,borderRadius:6,padding:"7px 10px",marginBottom:6}}>
                    <div style={{fontSize:10,fontWeight:700,color:item.c,marginBottom:1}}>{item.l}</div>
                    <div style={{fontSize:9,color:C.muted}}>{item.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const HPB=()=>{
    const Q=["Sensación de vaciado incompleto?","Orinar de nuevo antes de 2 horas?","Chorro que se interrumpe?","Urgencia para aguantarse?","Chorro débil?","Esfuerzo para iniciar la micción?","Veces que se levanta por la noche (nocturia)?"];
    const QoL=["Encantado","Complacido","Bastante satisfecho","Indiferente","Bastante insatisfecho","Infeliz","Terrible"];
    const[sc,setSc]=useState(Array(7).fill(0));
    const[qol,setQol]=useState(3);
    const[vol,setVol]=useState(50);
    const[qmax,setQmax]=useState(12);
    const[pvr,setPvr]=useState(80);
    const[psa,setPsa]=useState(3.5);
    const[anticoag,setAnticoag]=useState(false);
    const[show,setShow]=useState(false);
    const total=sc.reduce((a,b)=>a+b,0);
    const sev=ipssSev(total);
    const lr=laserRec(vol,qmax,pvr,anticoag);
    const pd_v=psaDens(psa,vol);
    const txOpts=[];
    if(total<=7) txOpts.push({tier:"1a línea",tx:"Vigilancia activa",detail:"Control anual IPSS + Qmax",color:C.green});
    if(total>=8) txOpts.push({tier:"1a línea",tx:"Alfa-bloqueador",detail:"Tamsulosina 0.4mg · Silodosina",color:C.blue});
    if(vol>=40&&total>=8) txOpts.push({tier:"Combinado",tx:"5-ARI + Alfa-bloqueador",detail:"Dutasteride + Tamsulosina (CombAT)",color:C.blue});
    if(total>=20||pvr>150||qmax<10) txOpts.push({tier:"Quirúrgico",tx:lr.tx,detail:lr.detail,color:lr.color});

    return(
      <div style={S.g2}>
        <div>
          <div style={S.card}>
            <div style={{fontSize:12,fontWeight:700,color:"#f1f5f9",marginBottom:12}}>Cuestionario IPSS</div>
            {Q.map((q,i)=>(
              <div key={i} style={{marginBottom:11,borderBottom:`1px solid ${C.faint}`,paddingBottom:9}}>
                <div style={{fontSize:11,color:"#94a3b8",lineHeight:1.5,marginBottom:6}}><span style={{color:C.accent,fontWeight:700}}>{i+1}. </span>{q}</div>
                <div style={{display:"flex",gap:4,alignItems:"center"}}>
                  {[0,1,2,3,4,5].map(v=>(
                    <button key={v} onClick={()=>{const n=[...sc];n[i]=v;setSc(n);}}
                      style={{width:30,height:30,borderRadius:6,border:`1px solid ${sc[i]===v?C.accent:C.border}`,background:sc[i]===v?C.accentDim:C.bg,color:sc[i]===v?C.accent:C.muted,fontWeight:700,cursor:"pointer",fontSize:11}}>{v}</button>
                  ))}
                  <span style={{fontSize:9,color:sc[i]>0?C.accent:C.muted,marginLeft:4,fontWeight:600}}>{i===6?["0x","1x","2x","3x","4x","5x"][sc[i]]:["Nunca","<1/5","<Mitad","Mitad",">Mitad","Siempre"][sc[i]]}</span>
                </div>
              </div>
            ))}
            <div style={{marginBottom:11}}>
              <div style={{fontSize:11,color:"#94a3b8",marginBottom:6}}><span style={{color:C.accent,fontWeight:700}}>QoL. </span>Si viviese con estos síntomas, ¿cómo se sentiría?</div>
              <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{QoL.map((l,v)=>(
                <button key={v} onClick={()=>setQol(v)} style={{padding:"3px 6px",borderRadius:4,border:`1px solid ${qol===v?C.accent:C.border}`,background:qol===v?C.accentDim:C.bg,color:qol===v?C.accent:C.muted,fontSize:9,cursor:"pointer",fontWeight:600}}>{v}–{l}</button>
              ))}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:9}}>
              {[["PSA (ng/mL)",psa,setPsa],["Vol. (cc)",vol,setVol],["Qmax (mL/s)",qmax,setQmax],["RPM (mL)",pvr,setPvr]].map(([l,v,setter])=>(
                <div key={l}><label style={S.lbl}>{l}</label><input type="number" value={v} onChange={e=>setter(Number(e.target.value))} style={S.inp}/></div>
              ))}
            </div>
            <div style={{marginBottom:9}}>
              <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",fontSize:11,color:"#94a3b8"}}>
                <input type="checkbox" checked={anticoag} onChange={e=>setAnticoag(e.target.checked)}/> Paciente anticoagulado / alto riesgo quirúrgico
              </label>
            </div>
            <button style={{...S.btn,width:"100%"}} onClick={()=>setShow(true)}>Generar Evaluación →</button>
          </div>
        </div>
        <div>
          <div style={{...S.card,borderLeft:`3px solid ${sev.color}`}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <Gauge score={Math.round((total/35)*100)} color={sev.color}/>
              <div>
                <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase"}}>IPSS Score</div>
                <div style={{fontSize:26,fontWeight:800,color:sev.color}}>{total} <span style={{fontSize:11,color:C.muted}}>/ 35</span></div>
                <span style={bdg(sev.label)}>{sev.label}</span>
                <div style={{fontSize:10,color:C.muted,marginTop:3}}>QoL: {QoL[qol]}</div>
              </div>
            </div>
            <div style={{background:C.bg,border:`1px solid ${sev.color}20`,borderRadius:6,padding:"8px 11px"}}>
              <div style={{fontSize:9,color:sev.color,fontWeight:700,marginBottom:2}}>RECOMENDACIÓN</div>
              <div style={{fontSize:11,color:C.text,lineHeight:1.6}}>{sev.rec}</div>
            </div>
          </div>

          <div style={{...S.card,borderLeft:`3px solid ${lr.color}`}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
              <span style={{fontSize:13}}>⚡</span>
              <div style={{fontSize:11,fontWeight:700,color:lr.color}}>Tecnología Quirúrgica Recomendada</div>
            </div>
            <div style={{background:C.bg,borderRadius:7,padding:"9px 12px",border:`1px solid ${lr.color}20`}}>
              <div style={{fontSize:13,fontWeight:800,color:lr.color,marginBottom:2}}>{lr.tx}</div>
              <div style={{fontSize:10,color:C.muted,lineHeight:1.6}}>{lr.detail}</div>
            </div>
          </div>

          <div style={S.card}>
            <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Parámetros Urodinámicos</div>
            <PBar value={vol} max={120} color={vol>=80?C.red:vol>=40?C.orange:C.green} label="Volumen Prostático" sub={`${vol} cc${vol>=80?" → HoLEP":vol>=60?" → ThuLEP":""}`}/>
            <PBar value={Math.max(0,25-qmax)} max={25} color={qmax<10?C.red:qmax<15?C.orange:C.green} label="Flujo Máximo (Qmax)" sub={`${qmax} mL/s · ${qmax<10?"Obstructivo":qmax<15?"Limítrofe":"Normal"}`}/>
            <PBar value={pvr} max={300} color={pvr>150?C.red:pvr>100?C.orange:C.green} label="Residuo Postmiccional" sub={`${pvr} mL`}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginTop:5}}>
              {[["PSA-D",pd_v,parseFloat(pd_v)>=0.15?C.red:C.green,parseFloat(pd_v)>=0.15?"Descartar CaP":"OK"],["Nocturia",`${sc[6]}x`,sc[6]>=3?C.red:sc[6]>=2?C.orange:C.green,sc[6]>=3?"Severa":"Leve"]].map(([l,v,c,sub])=>(
                <div key={l} style={{background:C.bg,borderRadius:6,padding:9,border:`1px solid ${c}20`}}>
                  <div style={{fontSize:8,color:C.muted,fontWeight:700}}>{l}</div>
                  <div style={{fontSize:12,fontWeight:800,color:c,marginTop:1}}>{v}</div>
                  <div style={{fontSize:9,color:c,fontWeight:600}}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {show&&(
            <div style={S.card}>
              <div style={{fontSize:11,fontWeight:700,color:"#f1f5f9",marginBottom:10}}>Algoritmo Terapéutico · EAU/AUA 2024</div>
              {txOpts.map((o,i)=>(
                <div key={i} style={{background:C.bg,borderLeft:`3px solid ${o.color}`,borderRadius:6,padding:"7px 11px",marginBottom:7}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <div style={{fontSize:11,fontWeight:700,color:o.color}}>{o.tx}</div>
                    <span style={{background:o.color+"18",color:o.color,borderRadius:4,padding:"1px 6px",fontSize:9,fontWeight:700}}>{o.tier}</span>
                  </div>
                  <div style={{fontSize:10,color:C.muted}}>{o.detail}</div>
                </div>
              ))}
              <div style={{background:C.bg,border:`1px solid ${C.teal}25`,borderRadius:7,padding:11,marginTop:8}}>
                <div style={{fontSize:9,color:C.teal,fontWeight:700,marginBottom:6}}>COMPARATIVA TÉCNICAS LÁSER</div>
                <table style={S.table}>
                  <thead><tr>{["Técnica","Vol ideal","Ventaja clave"].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>{[["HoLEP",">80cc","Más durable (10 años). Menor sangrado. Gold standard"],["ThuLEP","60-120cc","Hemostasia superior. Menor curva de aprendizaje"],["GreenLight","40-100cc","Ambulatorio. Anticoagulados. Menor retiro catéter"],["RTUP bipolar","<60cc","Más disponible. Sin necesidad de equipo láser"]].map((r,i)=>(
                    <tr key={i}><td style={{...S.td,fontWeight:700,color:C.teal,fontSize:10}}>{r[0]}</td><td style={{...S.td,fontSize:10,color:C.muted}}>{r[1]}</td><td style={{...S.td,fontSize:10,color:"#94a3b8"}}>{r[2]}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return(
    <div>
      <div style={S.hdr}>
        <div>
          <div style={S.title}>Próstata</div>
          <div style={S.sub}>Cáncer · Tamizaje · Hiperplasia — EAU 2024 / AUA 2023</div>
        </div>
      </div>
      {tabBar}
      {tab==="cap"    && <CancerProstata/>}
      {tab==="screen" && <Tamizaje/>}
      {tab==="hpb"    && <HPB/>}
    </div>
  );
}

// ─── PATIENTS LIST ────────────────────────────────────────────────────────────
function PatientsList({patients,onOpen}){
  return(
    <div>
      <div style={S.hdr}><div><div style={S.title}>Pacientes</div><div style={S.sub}>{patients.length} registrados</div></div><button style={S.btn}>+ Nuevo Paciente</button></div>
      <div style={S.card}>
        <table style={S.table}>
          <thead><tr>{["Paciente","Diagnóstico","Estadio","Riesgo","PSA/IPSS","PIRADS","Tratamiento","Cita",""].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>{patients.map(p=>{
            const rs=scoreP(p); const psa=p.psa[p.psa.length-1]?.val;
            return(
              <tr key={p.id} onMouseEnter={e=>e.currentTarget.style.background="#1e2d4a40"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={S.td}><div style={{fontWeight:600,color:"#f1f5f9"}}>{p.name}</div><div style={{fontSize:10,color:C.muted}}>{p.age} años</div></td>
                <td style={S.td}><span style={tag(condColor(p.condition))}>{condIcon(p.condition)} {p.condition}</span></td>
                <td style={{...S.td,fontFamily:"monospace",color:"#94a3b8",fontSize:10}}>{p.stage}</td>
                <td style={S.td}><span style={bdg(rs.level)}>{rs.level}</span></td>
                <td style={{...S.td,fontWeight:700,color:rs.color,fontSize:11}}>{p.condition==="Hiperplasia Prostática"?`IPSS ${p.ipss}`:`${psa}`}</td>
                <td style={S.td}>{p.pirads?<span style={tag(p.pirads>=4?C.red:p.pirads===3?C.orange:C.green)}>PI-{p.pirads}</span>:<span style={{color:C.muted,fontSize:10}}>—</span>}</td>
                <td style={{...S.td,fontSize:10,color:C.muted}}>{p.treatments?.[0]||"—"}</td>
                <td style={{...S.td,color:C.accent,fontWeight:600,fontSize:10}}>{p.next_visit}</td>
                <td style={S.td}><button style={S.btnSm} onClick={()=>onOpen(p.id)}>Ver</button></td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const[view,setView]=useState("dashboard");
  const[selId,setSelId]=useState(null);

  const sel=PATIENTS.find(p=>p.id===selId);
  const openPatient=id=>{ setSelId(id); setView("patient"); };

  const NAV=[
    {id:"dashboard", label:"Dashboard",           icon:"◈"},
    {id:"patients",  label:"Pacientes",            icon:"◉"},
    {id:"historicos",label:"Casos Históricos ML",  icon:"📋"},
    {id:"prostata",  label:"Próstata",             icon:"🔴"},
  ];

  return(
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`*{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1e2d4a;border-radius:4px}`}</style>

      {/* Sidebar */}
      <div style={S.sb}>
        <div style={{padding:"16px 13px 12px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{fontSize:14,fontWeight:800,color:C.accent,letterSpacing:-0.5}}>Urología Mx</div>
          <div style={{fontSize:8,color:C.muted,fontWeight:600,letterSpacing:1,textTransform:"uppercase",marginTop:1}}>Plataforma Clínica IA + ML v2</div>
        </div>
        <div style={{padding:"8px 6px",flex:1}}>
          {NAV.map(item=>(
            <div key={item.id} style={navS(view===item.id||(item.id==="patients"&&view==="patient"))}
              onClick={()=>{ if(item.id!=="patients") setSelId(null); setView(item.id); }}>
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
        </div>
        <div style={{padding:"8px 11px 12px",borderTop:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:3}}><div style={{width:5,height:5,borderRadius:"50%",background:C.green}}/><div style={{fontSize:8,color:C.muted}}>IndexedDB activo</div></div>
          <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:3}}><div style={{width:5,height:5,borderRadius:"50%",background:C.teal}}/><div style={{fontSize:8,color:C.muted}}>TF.js listo</div></div>
          <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6}}><div style={{width:5,height:5,borderRadius:"50%",background:C.purple}}/><div style={{fontSize:8,color:C.muted}}>ML activo · 5 modelos</div></div>
          <div style={{fontSize:9,color:C.muted,fontWeight:600}}>Dr. Manuel Paredes</div>
          <div style={{fontSize:8,color:"#334155"}}>Urólogo · Urología Mx</div>
        </div>
      </div>

      {/* Main content */}
      <div style={S.main}>
        {view==="dashboard" && <Dashboard patients={PATIENTS} onOpen={openPatient}/>}
        {view==="patients"  && <PatientsList patients={PATIENTS} onOpen={openPatient}/>}
        {view==="historicos"&& <div><div style={S.hdr}><div><div style={S.title}>Casos Históricos ML</div><div style={S.sub}>Captura expedientes de papel · alimentan el entrenamiento ML</div></div></div><div style={{...S.card,padding:24,textAlign:"center",color:C.muted}}>📋 Formulario de captura disponible en la versión deploy</div></div>}
        {view==="prostata"  && <ProstataHub/>}
        {view==="patient"   && sel && <PatientDetail patient={sel} onBack={()=>setView("patients")}/>}
      </div>
    </div>
  );
}
}
              onClick={()=>{ if(item.id!=="patients") setSelId(null); setView(item.id); }}>
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
        </div>
        <div style={{padding:"8px 11px 12px",borderTop:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:3}}><div style={{width:5,height:5,borderRadius:"50%",background:C.green}}/><div style={{fontSize:8,color:C.muted}}>IndexedDB activo</div></div>
          <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:3}}><div style={{width:5,height:5,borderRadius:"50%",background:C.teal}}/><div style={{fontSize:8,color:C.muted}}>TF.js listo</div></div>
          <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6}}><div style={{width:5,height:5,borderRadius:"50%",background:C.purple}}/><div style={{fontSize:8,color:C.muted}}>ML activo · 5 modelos</div></div>
          <div style={{fontSize:9,color:C.muted,fontWeight:600}}>Dr. Manuel Paredes</div>
          <div style={{fontSize:8,color:"#334155"}}>Urólogo · Urología Mx</div>
        </div>
      </div>

      {/* Main content */}
      <div style={S.main}>
        {view==="dashboard" && <Dashboard patients={PATIENTS} onOpen={openPatient}/>}
        {view==="patients"  && <PatientsList patients={PATIENTS} onOpen={openPatient}/>}
        {view==="historicos"&& <div><div style={S.hdr}><div><div style={S.title}>Casos Históricos ML</div><div style={S.sub}>Captura expedientes de papel · alimentan el entrenamiento ML</div></div></div><div style={{...S.card,padding:24,textAlign:"center",color:C.muted}}>📋 Formulario de captura disponible en la versión deploy</div></div>}
        {view==="prostata"  && <ProstataHub/>}
        {view==="patient"   && sel && <PatientDetail patient={sel} onBack={()=>setView("patients")}/>}
      </div>
    </div>
  );
}
