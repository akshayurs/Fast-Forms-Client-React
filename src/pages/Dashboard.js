import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AllPolls from '../components/AllPolls'
import Loading from '../helpers/Loading'
import { fetchData } from '../helpers/Fetch'

const pageNum = (pageName) => {
  if (pageName === 'created') {
    return 2
  } else if (pageName === 'answered') {
    return 3
  } else if (pageName === 'public') {
    return 1
  }
}

function Dashboard({ loggedin }) {
  const [view, setView] = useState('public')
  const [pollAns, setPollAns] = useState(null)
  const [pollCreated, setPollCreated] = useState(null)
  const [pollPublic, setPollPublic] = useState(null)

  const [loading, setLoading] = useState({ state: false, text: '' })
  const [polls, setPolls] = useState({
    poll1: [],
    poll2: [],
    poll3: [],
  })
  const [pollsPage, setPollsPage] = useState({ poll1: 0, poll2: 0, poll3: 0 })
  const [pagination, setPagination] = useState({
    poll1: { prev: false, next: false },
    poll2: { prev: false, next: false },
    poll3: { prev: false, next: false },
  })
  useEffect(() => {
    setLoading({ state: true, text: 'Loading Polls' })
    Promise.all([
      getPolls('created'),
      getPolls('answered'),
      getPolls('public'),
    ]).then(() => {
      setLoading({ state: false, text: '' })
    })
  }, [])

  const getPolls = async (page) => {
    let pageNumber = pollsPage[`poll${pageNum(page)}`] + 1
    setPollsPage((prev) => {
      const clone = { ...prev }
      clone[`poll${pageNum(page)}`] = pageNumber
      return clone
    })
    let url = process.env.REACT_APP_SERVER_URL
    if (pageNum(page) === 2) {
      url += '/userpolls'
    } else if (pageNum(page) === 3) {
      url += '/userans'
    } else if (pageNum(page) === 1) {
      url += '/publicpolls'
    }
    const { data } = await fetchData(
      `${url}/?pageNumber=${pageNumber}&numberOfItems=10`
    )
    setPagination((prev) => {
      const clone = { ...prev }
      clone[`poll${pageNum(page)}`] = {
        prev: data.prevPage,
        next: data.nextPage,
      }
      return clone
    })
    const tempPolls = page === 'answered' ? data.answers : data.polls
    setPolls((prev) => {
      const clone = { ...prev }
      clone[`poll${pageNum(page)}`] = [
        ...clone[`poll${pageNum(page)}`],
        ...tempPolls,
      ]
      return clone
    })
  }

  return (
    <div className="dashboard-screen">
      <Loading text={loading.text} loading={loading.state}></Loading>
      <div className="top">
        <p
          className={view === 'public' ? 'selected' : ''}
          onClick={() => setView('public')}
        >
          Public
        </p>
        <p
          className={view === 'created' ? 'selected' : ''}
          onClick={() => setView('created')}
        >
          Created
        </p>
        <p
          className={view === 'answered' ? 'selected' : ''}
          onClick={() => setView('answered')}
        >
          Answered
        </p>
      </div>
      <div className="container">
        {view === 'created' ? (
          <Link to="/poll" className="create-poll">
            Create Poll
          </Link>
        ) : view === 'public' ? (
          <Link to="/search" className="search-poll">
            Search
          </Link>
        ) : (
          ''
        )}
        {view === 'created' && (
          <AllPolls
            polls={polls[`poll${pageNum('created')}`]}
            setPolls={setPolls}
            pagination={pagination[`poll${pageNum('created')}`]}
            page={'created'}
            getPolls={getPolls}
          />
        )}
        {view === 'answered' && (
          <AllPolls
            polls={polls[`poll${pageNum('answered')}`]}
            setPolls={setPolls}
            pagination={pagination[`poll${pageNum('answered')}`]}
            page={'answered'}
            getPolls={getPolls}
          />
        )}
        {view === 'public' && (
          <AllPolls
            polls={polls[`poll${pageNum('public')}`]}
            setPolls={setPolls}
            pagination={pagination[`poll${pageNum('public')}`]}
            page={'public'}
            getPolls={getPolls}
          />
        )}
      </div>
    </div>
  )
}

export default Dashboard
