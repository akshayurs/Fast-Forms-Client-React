import { useEffect, useState } from 'react'
import PrevPolls from '../components/PrevPolls'
import PublicPolls from '../components/PublicPolls'
import { fetchData } from '../helpers/Fetch'

function Dashboard({ loggedin }) {
  const [view, setView] = useState('prevCreated')

  return (
    <div className="dashboard-screen">
      <div className="top">
        <p
          className={view === 'prevCreated' && 'selected'}
          onClick={() => setView('prevCreated')}
        >
          Created
        </p>
        <p
          className={view === 'prevAns' && 'selected'}
          onClick={() => setView('prevAns')}
        >
          Answered
        </p>
        <p
          className={view === 'public' && 'selected'}
          onClick={() => setView('public')}
        >
          Public
        </p>
      </div>
      <div className="container">
        {view === 'prevCreated' && <PrevPolls />}
        {view === 'prevAns' && <PrevPolls />}
        {view === 'public' && <PublicPolls />}
      </div>
    </div>
  )
}

export default Dashboard
