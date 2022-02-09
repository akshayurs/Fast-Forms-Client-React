import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchData } from '../helpers/Fetch'
import Loading from '../helpers/Loading'
import Flash from '../components/Flash'
import StatsItem from '../components/StatsItem'

function Stats() {
  const { id } = useParams()
  const [answers, setAnswers] = useState([])
  const [poll, setPoll] = useState({})
  const [isOwner, setIsOwner] = useState(false)
  const [loading, setLoading] = useState({ state: false, text: '' })
  const [flashMsg, setFlashMsg] = useState({ content: '', color: '' })
  useEffect(() => {
    ;(async () => {
      setLoading({ text: 'Loading', state: true })
      const { data } = await fetchData(
        `${process.env.REACT_APP_SERVER_URL}/stats/${id}`
      )
      setLoading({ state: false, text: '' })
      if (data.status === 200) {
        setAnswers(data.answers)
        setPoll(data.poll)
        setIsOwner(data.owner)
      } else {
        setFlashMsg({ content: data.message, color: 'red' })
      }
    })()
  }, [])
  return (
    <div className="stats">
      <Flash color={flashMsg.color}>{flashMsg.content}</Flash>
      <Loading text={loading.text} loading={loading.state}></Loading>
      {poll?.questions?.map((que) => {
        return (
          <StatsItem question={que} answers={answers} field={'queFieldsAns'} />
        )
      })}
    </div>
  )
}

export default Stats
