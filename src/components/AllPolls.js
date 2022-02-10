import { useEffect, useState } from 'react'
import { fetchData } from '../helpers/Fetch'
import Loading from '../helpers/Loading'
import { GrAddCircle } from 'react-icons/gr'
import { BsSearch } from 'react-icons/bs'
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
    const tempPolls = page === 'answered' ? data.answers : data.polls
    setPolls((prev) => {
      return [...prev, ...tempPolls]
    })
  }

  useEffect(() => {
    getPolls()
  }, [])

  return (
    <div className="polls">
      <Loading text={loading.text} loading={loading.state}></Loading>
      {polls.map((poll, index) => {
        return (
          <PollItem
            poll={poll}
            created={page === 'created'}
            answer={page === 'answered'}
            public={page === 'public'}
            index={index}
          />
        )
      })}
      {polls.length === 0 && (
        <div className="empty">
          {page === 'created' &&
            'Create your new poll by clicking above button to conduct Survey / Test / Election or any other Data Collection form'}
          {page === 'answered' && 'You have not answered any poll'}
        </div>
      )}
      {pagination.next && (
        <div className="loadmore">
          <GrAddCircle />
        </div>
      )}
    </div>
  )
}

export default AllPolls
