import { useState } from 'react'

export default function EntityModal({open=false, initial={}, onClose, onSave}){
  const [data, setData] = useState(initial)

  // Reset when initial changes
  if (initial && initial.id !== data.id) {
    setData(initial)
  }

  if (!open) return null
  return (
    <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.5)'}}>
      <div style={{width:640,background:'#041024',padding:18,borderRadius:8}}>
        <h3>{data.id ? 'Edit' : 'Create'}</h3>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
          <input placeholder="Name" value={data.name||''} onChange={e=>setData({...data,name:e.target.value})} />
          <input placeholder="Role / Type" value={data.role||data.type||''} onChange={e=>setData({...data,role:e.target.value, type:e.target.value})} />
          <textarea placeholder="Description" value={data.description||''} onChange={e=>setData({...data,description:e.target.value})} style={{gridColumn:'1 / -1'}} />
        </div>
        <div style={{marginTop:12,display:'flex',justifyContent:'flex-end',gap:8}}>
          <button onClick={onClose}>Cancel</button>
          <button className="button" onClick={()=>onSave?.(data)}>Save</button>
        </div>
      </div>
    </div>
  )
}
