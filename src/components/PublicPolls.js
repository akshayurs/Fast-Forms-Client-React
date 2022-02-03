import { useEffect, useState } from 'react'
import { fetchData } from '../helpers/Fetch'
import Loading from '../helpers/Loading'
import { GrAddCircle } from 'react-icons/gr'
import { Link } from 'react-router-dom'
function PublicPolls() {
  const [loading, setLoading] = useState({ state: false, text: '' })
  const [publicPolls, setPublicPolls] = useState([])
  const [publicPollsPage, setPublicPollsPage] = useState(0)
  const [pagination, setPagination] = useState({ prev: false, next: false })
  const getPolls = async () => {
    let pageNumber = publicPollsPage + 1
    setPublicPollsPage(pageNumber)
    setLoading({ state: true, text: 'Loading Polls' })
    const { data } = await fetchData(
      `${process.env.REACT_APP_SERVER_URL}/publicpolls/?pageNumber=${pageNumber}&numberOfItems=10`
    )
    setPagination({ prev: data.prev, next: data.next })
    setLoading({ state: false, text: '' })
    setPublicPolls(data.polls)
    console.log(data)
  }
  useEffect(() => {
    getPolls()
  }, [])
  return (
    <div className="public-polls">
      <Loading text={loading.text} loading={loading.state}></Loading>
      {publicPolls.map((poll) => {
        return (
          <div className="poll">
            <div className="title">{poll.title}</div>
            <div className="des">{poll.des}</div>
            <div className="createdBy">
              <div className="name">{poll.createdBy.name}</div>
              <div className="username">{poll.createdBy.username}</div>
            </div>
            <div className="time">
              <div className="startTime">{poll.startTime}</div>
              <div className="endTime">{poll.endTime}</div>
            </div>
            <div className="view">
              <Link to={`/answer/${poll._id}`}>Open</Link>
            </div>
          </div>
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

export default PublicPolls
