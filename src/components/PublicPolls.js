import { useEffect, useState } from 'react'
import { fetchData } from '../helpers/Fetch'
import Loading from '../helpers/Loading'

function PublicPolls() {
  const [loading, setLoading] = useState({ state: false, text: '' })
  const [userPolls, setPublicPolls] = useState([])
  const [publicPollPage, setPublicPollPage] = useState(0)
  const getPolls = async () => {
    let pageNumber = publicPollPage + 1
    setPublicPollPage(pageNumber)
    setLoading({ state: true, text: 'Loading Polls' })
    const { data } = await fetchData(
      `${process.env.REACT_APP_SERVER_URL}/publicpolls/?pageNumber=${pageNumber}&numberOfItems=10`
    )
    setLoading({ state: false, text: '' })
    setPublicPolls(data.polls)
    console.log(data)
  }
  useEffect(() => {
    getPolls()
  }, [])
  return (
    <div className="public-polls">
      <Loading text={loading.text} loading={loading.state}></Loading>public
      polls
    </div>
  )
}

export default PublicPolls
