import { useState } from 'react'
import Layout from '../components/Layout'
import useSWR from 'swr'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'

const fetcher = url => axios.get(url).then(r=>r.data)

export default function Dashboard(){
  const { data, mutate } = useSWR('/api/worlds', fetcher)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', summary: '' })
  const router = useRouter()

  async function handleCreate(){
    const result = await axios.post('/api/worlds', formData)
    setModalOpen(false)
    setFormData({ name: '', summary: '' })
    mutate()
    router.push(`/world/${result.data.id}`)
  }

  return (
    <Layout>
      <div className="layout">
        <div className="sidebar card">
          <h3>Worlds</h3>
          <div className="muted">Create and manage your worlds</div>
        </div>
        <div className="main">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <h2>Your Worlds</h2>
            <button className="button" onClick={()=>setModalOpen(true)}>Create World</button>
          </div>

          <div style={{marginTop:12}}>
            {data?.length ? (
              data.map(w=> (
                <div key={w.id} className="entity-row" style={{marginBottom:8}}>
                  <div>
                    <Link href={`/world/${w.id}`}><strong>{w.name}</strong></Link>
                    <div className="muted">{w.summary}</div>
                  </div>
                  <div className="muted">{new Date(w.createdAt).toLocaleDateString()}</div>
                </div>
              ))
            ) : (<div className="muted">No worlds yet.</div>)}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.5)'}}>
          <div style={{width:640,background:'#041024',padding:18,borderRadius:8}}>
            <h3>Create New World</h3>
            <div style={{display:'grid',gap:12}}>
              <input 
                placeholder="World Name" 
                value={formData.name} 
                onChange={e=>setFormData({...formData,name:e.target.value})} 
                style={{padding:8}}
              />
              <textarea 
                placeholder="Summary (optional)" 
                value={formData.summary} 
                onChange={e=>setFormData({...formData,summary:e.target.value})} 
                style={{padding:8,minHeight:80}}
              />
            </div>
            <div style={{marginTop:12,display:'flex',justifyContent:'flex-end',gap:8}}>
              <button onClick={()=>setModalOpen(false)}>Cancel</button>
              <button className="button" onClick={handleCreate} disabled={!formData.name}>Create</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
