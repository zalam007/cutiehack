import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import Sidebar from '../../components/Sidebar'
import EntityList from '../../components/EntityList'
import EntityModal from '../../components/EntityModal'
import RelationshipMap from '../../components/RelationshipMap'
import LocationMap from '../../components/LocationMap'
import axios from 'axios'

export default function WorldPage(){
  const router = useRouter()
  const { id } = router.query
  const [world, setWorld] = useState(null)
  const [tab, setTab] = useState('characters')
  const [items, setItems] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(()=>{
    if (!id) return
    // load world
    axios.get(`/api/worlds/${id}`).then(r=> setWorld(r.data))
    loadItems()
  },[id, tab])

  function loadItems(){
    if (!id) return
    axios.get(`/api/${tab}?worldId=${id}`).then(r=> setItems(r.data))
  }

  function handleCreate(){ setEditing({}); setModalOpen(true) }
  function handleEdit(it){ setEditing(it); setModalOpen(true) }
  function handleDelete(it){ if(!confirm('Delete?')) return; axios.delete(`/api/${tab}/${it.id}`).then(loadItems) }

  function handleSave(data){
    const payload = { ...data, worldId: Number(id) }
    if (data.id) {
      axios.put(`/api/${tab}/${data.id}`, payload).then(()=>{ setModalOpen(false); loadItems() })
    } else {
      axios.post(`/api/${tab}`, payload).then(()=>{ setModalOpen(false); loadItems() })
    }
  }

  return (
    <Layout>
      <div className="layout">
        <Sidebar world={world} />
        <div className="main">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2>{world?.name ?? 'World'}</h2>
            <div>
              <button className="button" onClick={handleCreate}>New {tab.slice(0,-1)}</button>
            </div>
          </div>

          <div className="tabbar" style={{marginTop:12}}>
            <button className="button" onClick={()=>setTab('characters')}>Characters</button>
            <button className="button" onClick={()=>setTab('locations')}>Locations</button>
            <button className="button" onClick={()=>setTab('magics')}>Magic</button>
            <button className="button" onClick={()=>setTab('factions')}>Factions</button>
            <button className="button" onClick={()=>setTab('events')}>Story</button>
          </div>

          <div style={{marginTop:12}}>
            {tab === 'characters' && (
              <>
                <EntityList items={items} onEdit={handleEdit} onDelete={handleDelete} />
                <h3 style={{marginTop:18}}>Relationship Map</h3>
                <RelationshipMap characters={items} />
              </>
            )}
            {tab === 'locations' && (
              <>
                <EntityList items={items} onEdit={handleEdit} onDelete={handleDelete} />
                <h3 style={{marginTop:18}}>Location Map</h3>
                <LocationMap locations={items} />
              </>
            )}
            {(tab==='magics' || tab==='factions' || tab==='events') && (
              <EntityList items={items} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </div>

      <EntityModal open={modalOpen} initial={editing||{}} onClose={()=>setModalOpen(false)} onSave={handleSave} />
    </Layout>
  )
}
