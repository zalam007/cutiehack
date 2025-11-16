import Link from 'next/link'

export default function Layout({ children }){
  return (
    <div className="container">
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
        <h1 style={{margin:0}}>LoreForge</h1>
        <div className="flex gap">
          <Link href="/" className="muted">Dashboard</Link>
        </div>
      </div>
      <div className="card">{children}</div>
    </div>
  )
}
