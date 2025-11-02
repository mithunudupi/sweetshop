import React, { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API || "http://localhost:4000";

function App(){
  const [sweets, setSweets] = useState<any[]>([]);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newSweet, setNewSweet] = useState({name:"", category:"", price:0, quantity:0});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(()=>{ fetchSweets(); }, []);

  async function fetchSweets(){
    const res = await fetch(API + "/api/sweets");
    const data = await res.json();
    setSweets(data);
  }

  async function register(){
    const res = await fetch(API + "/api/auth/register", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ email, password, isAdmin })
    });
    const data = await res.json();
    if(data.token){ localStorage.setItem("token", data.token); setToken(data.token); fetchSweets(); }
    else alert(JSON.stringify(data));
  }

  async function login(){
    const res = await fetch(API + "/api/auth/login", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ email, password })
    });
    const data = await res.json();
    if(data.token){ localStorage.setItem("token", data.token); setToken(data.token); fetchSweets(); }
    else alert(JSON.stringify(data));
  }

  async function addSweet(){
    if(!token) return alert("Login as admin to add");
    const res = await fetch(API + "/api/sweets", {
      method:"POST",
      headers:{"Content-Type":"application/json", "Authorization":"Bearer "+token},
      body:JSON.stringify(newSweet)
    });
    const data = await res.json();
    if(data.id) { fetchSweets(); setNewSweet({name:"",category:"",price:0,quantity:0}); }
    else alert(JSON.stringify(data));
  }

  async function purchase(id:number){
    if(!token) return alert("Login to purchase");
    const res = await fetch(API + `/api/sweets/${id}/purchase`, {
      method:"POST",
      headers:{"Content-Type":"application/json", "Authorization":"Bearer "+token},
      body:JSON.stringify({ quantity: 1 })
    });
    const data = await res.json();
    if(data.id) fetchSweets(); else alert(JSON.stringify(data));
  }

  return (
    <div style={{padding:20,fontFamily:"Arial,Helvetica,sans-serif"}}>
      <h1>Sweet Shop</h1>
      <div style={{display:"flex",gap:20}}>
        <div style={{minWidth:300}}>
          <h3>Auth</h3>
          <input placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} /><br/>
          <input placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} /><br/>
          <label><input type="checkbox" checked={isAdmin} onChange={e=>setIsAdmin(e.target.checked)} /> Register as admin</label><br/>
          <button onClick={register}>Register</button>
          <button onClick={login}>Login</button>
          <button onClick={()=>{ localStorage.removeItem("token"); setToken(null); }}>Logout</button>
        </div>

        <div style={{flex:1}}>
          <h3>Available Sweets</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
            {sweets.map(s=>(
              <div key={s.id} style={{border:"1px solid #ddd",padding:10,borderRadius:8}}>
                <strong>{s.name}</strong>
                <div>{s.category}</div>
                <div>₹ {s.price.toFixed(2)}</div>
                <div>Stock: {s.quantity}</div>
                <button disabled={s.quantity<=0} onClick={()=>purchase(s.id)}>Purchase</button>
              </div>
            ))}
          </div>

          <h3 style={{marginTop:20}}>Add Sweet (Admin)</h3>
          <input placeholder="name" value={newSweet.name} onChange={e=>setNewSweet({...newSweet,name:e.target.value})} /> 
          <input placeholder="category" value={newSweet.category} onChange={e=>setNewSweet({...newSweet,category:e.target.value})} /> 
          <input placeholder="price" type="number" value={newSweet.price} onChange={e=>setNewSweet({...newSweet,price: Number(e.target.value)})} /> 
          <input placeholder="quantity" type="number" value={newSweet.quantity} onChange={e=>setNewSweet({...newSweet,quantity: Number(e.target.value)})} /> 
          <button onClick={addSweet}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default App;
