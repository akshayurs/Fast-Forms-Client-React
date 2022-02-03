import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchData } from '../helpers/Fetch'
import Loading from '../helpers/Loading'

function PrevPolls() {
  const [loading, setLoading] = useState({ state: false, text: '' })
  const [userPolls, setUserPolls] = useState([])
  const [userPollPage, setUserPollPage] = useState(0)
  const getUserPolls = async () => {
    let pageNumber = userPollPage + 1
    setUserPollPage(pageNumber)
    setLoading({ state: true, text: 'Loading Polls' })
    const { data } = await fetchData(
      `${process.env.REACT_APP_SERVER_URL}/userpolls/?pageNumber=${pageNumber}&numberOfItems=10`
    )
    setLoading({ state: false, text: '' })
    setUserPolls(data.polls)
    console.log(data)
  }
  useEffect(() => {
    getUserPolls()
  }, [])
  return (
    <div className="user-polls">
      <Loading text={loading.text} loading={loading.state}></Loading>
      <Link to="/createpoll">Create New Poll</Link>
      {userPolls.map((poll, index) => (
        <div key={index}>
          <div className="poll">{poll.title}</div>
          <div className="des">{poll.des}</div>
        </div>
      ))}
    </div>
  )
}

export default PrevPolls
