import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import Flash from '../components/Flash'
import Question from '../components/Question'
import { fetchData } from '../helpers/Fetch'
import Loading from '../helpers/Loading'
function AnswerPoll() {
  const questionsEle = useRef(null)
  const [flashMsg, setFlashMsg] = useState({ content: '', color: '' })
  const [loading, setLoading] = useState({ state: false, text: '' })
  const [pollNotStarted, setPollNotStarted] = useState({ started: true })
  const [notAuth, setNotAuth] = useState()
  const { id } = useParams()

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [des, setDes] = useState('')
  const [questions, setQuestions] = useState([])
  const [reqFieldsToAns, setReqFieldsToAns] = useState([])
  useEffect(() => {
    ;(async () => {
      setLoading({ state: true, text: 'Loading Poll' })
      const { data } = await fetchData(
        `${process.env.REACT_APP_SERVER_URL}/poll/${id}`
      )
      setLoading({ state: false, text: '' })
      if (data.status === 500) {
        setFlashMsg({ color: 'red', content: 'Error' })
      } else if (data.time) {
        let now = new Date()
        let end = new Date(data.time.endTime)
        let start = new Date(data.time.startTime)
        if (end < now) {
          setPollNotStarted({
            ended: true,
            endTime: end.toLocaleString(),
            startTime: start.toLocaleString(),
          })
        } else {
          setPollNotStarted({
            ended: false,
            endTime: end.toLocaleString(),
            startTime: start.toLocaleString(),
          })
        }
      }
      if (data.status === 200) {
        setUsername(data.poll.createdBy.username)
        setName(data.poll.createdBy.name)
        setTitle(data.poll.title)
        setDes(data.poll.des)
        if (data.poll.questions) {
          setQuestions(data.poll.questions)
          setReqFieldsToAns(data.poll.reqFieldsToAns)
        }
      }
      console.log(data)
    })()
  }, [id])
  if (!pollNotStarted.started) {
    console.log(pollNotStarted)
    return (
      <div className="answer-poll">
        <div className="top">
          {pollNotStarted.ended ? 'Poll Ended' : 'Poll Not yet Started'}
        </div>
        <div className="bottom">
          <div className="info">
            <div className="title">{title}</div>
            <div className="des">{des}</div>
          </div>
          <div className="createdby">
            <div className="name">{name}</div>
            <div className="username">{username}</div>
          </div>
          {!pollNotStarted.ended && (
            <p>Start Time : {pollNotStarted.startTime}</p>
          )}
          <p>End Time : {pollNotStarted.endTime}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="answer-poll">
      <Flash color={flashMsg.color}>{flashMsg.content}</Flash>
      <Loading text={loading.text} loading={loading.state}></Loading>

      <div className="questions" ref={questionsEle}>
        {reqFieldsToAns.map((question) => {
          return <Question question={question} isInfo={true} />
        })}
        {questions.map((question, index) => {
          return (
            <Question
              question={question}
              index={index}
              total={questions.length}
            />
          )
        })}
      </div>
    </div>
  )
}

export default AnswerPoll
