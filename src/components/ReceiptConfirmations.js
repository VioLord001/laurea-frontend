"use client";
import { useState, useEffect } from "react";
export default function ReceiptConfirmations() {
  const [receipts,setReceipts]=useState([]);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState(null);
  const [acting,setActing]=useState(false);
  const [toast,setToast]=useState("");
  async function load(){try{const r=await fetch("/api/admin/receipts");const d=await r.json();setReceipts(d.receipts||[]);}catch{}setLoading(false);}
  useEffect(()=>{load();const id=setInterval(load,20000);return()=>clearInterval(id);},[]);
  function showToast(m){setToast(m);setTimeout(()=>setToast(""),3000);}
  async function decide(orderId,action){setActing(true);try{await fetch("/api/admin/confirm",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId,action})});setSelected(null);showToast(action==="approve"?"✓ Order approved!":"✗ Order rejected.");await load();}catch{showToast("Error — try again.");}setActing(false);}
  const pending=receipts.filter(r=>r.status==="pending");
  const done=receipts.filter(r=>r.status!=="pending");
  return(<div style={{background:"#fff",borderRadius:"16px",padding:"20px",border:"1px solid #dbeafe",position:"relative"}}>
    {toast&&<div style={{position:"fixed",top:"20px",right:"20px",background:"#0f1e45",color:"#fff",padding:"12px 20px",borderRadius:"10px",zIndex:9999,fontSize:"14px",fontWeight:"600",boxShadow:"0 4px 20px rgba(0,0,0,0.2)"}}>{toast}</div>}
    <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"}}>
      <h2 style={{fontSize:"16px",fontWeight:"700",color:"#0f1e45",margin:0}}>Receipt Confirmations</h2>
      {pending.length>0&&<span style={{background:"#dc2626",color:"#fff",fontSize:"11px",fontWeight:"700",padding:"3px 8px",borderRadius:"20px"}}>{pending.length} waiting</span>}
      <button onClick={load} style={{marginLeft:"auto",background:"#f0f4ff",border:"none",borderRadius:"8px",padding:"6px 12px",fontSize:"12px",color:"#2563eb",cursor:"pointer",fontWeight:"600"}}>↻ Refresh</button>
    </div>
    {loading&&<div style={{color:"#6b7ea8",fontSize:"13px",padding:"16px 0",textAlign:"center"}}>Loading...</div>}
    {!loading&&pending.length===0&&<div style={{color:"#6b7ea8",fontSize:"13px",padding:"20px 0",textAlign:"center"}}><div style={{fontSize:"28px",marginBottom:"8px"}}>✓</div>No pending receipts — all caught up!</div>}
    {pending.map(r=>(
      <div key={r.orderId} style={{border:"2px solid #fbbf24",borderRadius:"12px",padding:"14px",marginBottom:"10px",background:"#fffbeb"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
          <div>
            <div style={{fontWeight:"700",color:"#0f1e45",fontSize:"15px"}}>Order #{r.orderId}</div>
            <div style={{fontSize:"11px",color:"#92400e",marginTop:"2px"}}>{new Date(r.submittedAt).toLocaleString()}</div>
            <div style={{fontSize:"17px",fontWeight:"700",color:"#2563eb",marginTop:"4px"}}>₦{parseFloat(r.total||0).toLocaleString()}</div>
            {r.items&&<div style={{fontSize:"11px",color:"#6b7ea8",marginTop:"3px"}}>{decodeURIComponent(r.items)}</div>}
          </div>
          <span style={{background:"#fef9c3",color:"#92400e",fontSize:"10px",fontWeight:"700",padding:"4px 10px",borderRadius:"20px",whiteSpace:"nowrap"}}>⏳ Pending</span>
        </div>
        <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
          <button style={{background:"#f0f4ff",color:"#2563eb",border:"1px solid #dbeafe",borderRadius:"8px",padding:"9px 14px",fontSize:"13px",fontWeight:"600",cursor:"pointer",flex:"1"}} onClick={()=>setSelected(r)}>👁 View Receipt</button>
          <button style={{background:"#16a34a",color:"#fff",border:"none",borderRadius:"8px",padding:"9px 16px",fontSize:"13px",fontWeight:"700",cursor:"pointer"}} onClick={()=>decide(r.orderId,"approve")} disabled={acting}>✓ Approve</button>
          <button style={{background:"#dc2626",color:"#fff",border:"none",borderRadius:"8px",padding:"9px 14px",fontSize:"13px",fontWeight:"700",cursor:"pointer"}} onClick={()=>decide(r.orderId,"reject")} disabled={acting}>✗ Reject</button>
        </div>
      </div>
    ))}
    {done.length>0&&<details style={{marginTop:"16px"}}><summary style={{fontSize:"12px",color:"#6b7ea8",cursor:"pointer",padding:"6px 0"}}>Past decisions ({done.length})</summary><div style={{marginTop:"8px",display:"flex",flexDirection:"column",gap:"6px"}}>{done.slice().reverse().map(r=>(<div key={r.orderId} style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px",borderRadius:"8px",background:"#f8faff",flexWrap:"wrap"}}><span style={{fontWeight:"700",color:"#0f1e45",fontSize:"13px"}}>#{r.orderId}</span><span style={{fontSize:"12px",fontWeight:"700",padding:"2px 8px",borderRadius:"12px",background:r.status==="approved"?"#dcfce7":"#fee2e2",color:r.status==="approved"?"#16a34a":"#dc2626"}}>{r.status}</span><span style={{fontSize:"13px",fontWeight:"600",color:"#2563eb"}}>₦{parseFloat(r.total||0).toLocaleString()}</span><button style={{marginLeft:"auto",background:"#f0f4ff",color:"#2563eb",border:"none",borderRadius:"6px",padding:"4px 10px",fontSize:"11px",cursor:"pointer"}} onClick={()=>setSelected(r)}>View</button></div>))}</div></details>}
    {selected&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"16px"}} onClick={()=>setSelected(null)}><div style={{background:"#fff",borderRadius:"20px",padding:"24px",maxWidth:"420px",width:"100%",maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}><div style={{fontWeight:"700",color:"#0f1e45",fontSize:"17px"}}>Order #{selected.orderId}</div><button style={{background:"#f0f4ff",border:"none",borderRadius:"8px",padding:"6px 12px",cursor:"pointer",color:"#6b7ea8",fontSize:"16px"}} onClick={()=>setSelected(null)}>✕</button></div>
      <div style={{fontSize:"20px",fontWeight:"700",color:"#2563eb",marginBottom:"4px"}}>₦{parseFloat(selected.total||0).toLocaleString()}</div>
      {selected.items&&<div style={{fontSize:"12px",color:"#6b7ea8",marginBottom:"14px",lineHeight:"1.5"}}>{decodeURIComponent(selected.items)}</div>}
      {selected.receiptUrl&&(selected.receiptUrl.match(/\.pdf$/i)?<a href={selected.receiptUrl} target="_blank" rel="noreferrer" style={{display:"block",background:"#f0f4ff",color:"#2563eb",textDecoration:"none",padding:"14px",borderRadius:"10px",textAlign:"center",fontWeight:"600",marginBottom:"16px"}}>📄 Open PDF Receipt</a>:<img src={selected.receiptUrl} alt="Receipt" style={{width:"100%",borderRadius:"12px",border:"1px solid #dbeafe",marginBottom:"16px"}}/>)}
      {selected.status==="pending"&&<div style={{display:"flex",gap:"10px"}}><button style={{flex:1,background:"#16a34a",color:"#fff",border:"none",borderRadius:"10px",padding:"14px",fontSize:"15px",fontWeight:"700",cursor:"pointer"}} onClick={()=>decide(selected.orderId,"approve")} disabled={acting}>✓ Approve Order</button><button style={{background:"#dc2626",color:"#fff",border:"none",borderRadius:"10px",padding:"14px 18px",fontSize:"15px",fontWeight:"700",cursor:"pointer"}} onClick={()=>decide(selected.orderId,"reject")} disabled={acting}>✗</button></div>}
      {selected.status!=="pending"&&<div style={{textAlign:"center",fontWeight:"700",padding:"12px",borderRadius:"10px",background:selected.status==="approved"?"#dcfce7":"#fee2e2",color:selected.status==="approved"?"#16a34a":"#dc2626"}}>{selected.status==="approved"?"✓ Approved":"✗ Rejected"}</div>}
    </div></div>}
  </div>);
}
