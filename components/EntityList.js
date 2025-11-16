export default function EntityList({items=[], onEdit, onDelete, fields=['name']}){
  return (
    <div>
      {items.map(it=> (
        <div key={it.id} className="entity-row">
          <div>
            <strong>{it.name || it.title}</strong>
            <div className="muted">{fields.map(f=> it[f]).filter(Boolean).join(' — ')}</div>
          </div>
          <div className="flex gap">
            <button className="button" onClick={()=>onEdit?.(it)}>Edit</button>
            <button onClick={()=>onDelete?.(it)} style={{background:'transparent',color:'#fda'}}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
