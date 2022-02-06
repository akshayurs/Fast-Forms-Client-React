import { useEffect, useState } from 'react'
import AllPolls from '../components/AllPolls'

function Dashboard({ loggedin }) {
  const [view, setView] = useState('prevCreated')

  return (
    <div className="dashboard-screen">
      <div className="top">
        <p
          className={view === 'prevCreated' ? 'selected' : ''}
          onClick={() => setView('prevCreated')}
        >
          Created
        </p>
        <p
          className={view === 'prevAns' ? 'selected' : ''}
          onClick={() => setView('prevAns')}
        >
          Answered
        </p>
        <p
          className={view === 'public' ? 'selected' : ''}
          onClick={() => setView('public')}
        >
          Public
        </p>
      </div>
      <div className="container">
        {view === 'prevCreated' && <AllPolls page={'created'} />}
        {view === 'prevAns' && <AllPolls page={'answered'} />}
        {view === 'public' && <AllPolls page={'public'} />}
      </div>
    </div>
  )
}

export default Dashboard
