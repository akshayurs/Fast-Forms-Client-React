import { useEffect, useState } from 'react'
import { fetchData } from '../helpers/Fetch'
import Loading from '../helpers/Loading'
import { GrAddCircle } from 'react-icons/gr'
import { Link } from 'react-router-dom'
import PollItem from './PollItem'
function AllPolls({ page }) {
  const [loading, setLoading] = useState({ state: false, text: '' })
  const [polls, setPolls] = useState([])
  const [pollsPage, setPollsPage] = useState(0)
  const [pagination, setPagination] = useState({ prev: false, next: false })
  const getPolls = async () => {
    let pageNumber = pollsPage + 1
    setPollsPage(pageNumber)
    setLoading({ state: true, text: 'Loading Polls' })
    let url = process.env.REACT_APP_SERVER_URL
    if (page === 'created') {
      url += '/userpolls'
    } else if (page === 'answered') {
      url += '/userans'
    } else if (page === 'public') {
      url += '/publicpolls'
    }
    const { data } = await fetchData(
      `${url}/?pageNumber=${pageNumber}&numberOfItems=10`
    )
    setPagination({ prev: data.prev, next: data.next })
    setLoading({ state: false, text: '' })
    setPolls(page === 'answered' ? data.answers : data.polls)
  }
  useEffect(() => {
    getPolls()
  }, [])
  return (
    <div className="polls">
      <Loading text={loading.text} loading={loading.state}></Loading>
      {page === 'created' ? (
        <Link to="/createpoll" className="create-poll">
          Create Poll
        </Link>
      ) : (
        ''
      )}
      {polls.map((poll) => {
        return (
          <PollItem
            poll={poll}
            created={page === 'created'}
            answer={page === 'answered'}
          />
        )
      })}
      {pagination.next && (
        <div className="loadmore">
          <GrAddCircle />
        </div>
      )}
    </div>
  )
}

export default AllPolls
