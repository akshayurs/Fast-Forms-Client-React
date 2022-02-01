import { useEffect, useState } from 'react'
import PrevPolls from '../components/PrevPolls'
import PublicPolls from '../components/PublicPolls'
import { fetchData } from '../helpers/Fetch'

function Dashboard({ loggedin }) {
  const [view, setView] = useState('prev')

  return (
    <div className="dashboard-screen">
      <div className="top">
        <p
          className={view === 'prev' && 'selected'}
          onClick={() => setView('prev')}
        >
          Previous Polls
        </p>
        <p
          className={view === 'public' && 'selected'}
          onClick={() => setView('public')}
        >
          Public Polls
        </p>
      </div>
      <div className="container">
        {view === 'prev' ? <PrevPolls /> : <PublicPolls />}
      </div>
    </div>
  )
}

export default Dashboard
