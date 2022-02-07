import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import AnswerStart from '../components/AnswerStart'
import { Link, useNavigate } from 'react-router-dom'
import Flash from '../components/Flash'
import Question from '../components/Question'
import { fetchData } from '../helpers/Fetch'
import Loading from '../helpers/Loading'
function AnswerPoll() {
  const questionsEle = useRef(null)
  const navigate = useNavigate()
  const [flashMsg, setFlashMsg] = useState({ content: '', color: '' })
  const [loading, setLoading] = useState({ state: false, text: '' })
  const [notAuth, setNotAuth] = useState(false)
  const { id } = useParams()

  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [title, setTitle] = useState('')
  const [des, setDes] = useState('')
  const [questions, setQuestions] = useState([])
  const [reqFieldsToAns, setReqFieldsToAns] = useState([])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const [answersToInfo, setAnswersToInfo] = useState({})
  const [answersToQue, setAnswersToQue] = useState({})

  const [alreadyAnswered, setAlreadyAnswered] = useState(false)
  const [ansEditable, setAnsEditable] = useState(false)

  const [startAnswering, setStartAnswering] = useState(false)

  async function handleSubmit() {
    setLoading({ state: true, text: 'Saving' })
    const reqFieldsAns = Object.entries(answersToInfo).map(([id, val]) => {
      return { id, ans: val }
    })
    const queFieldsAns = Object.entries(answersToQue).map(([id, val]) => {
      return { id, ans: val }
    })

    const { data } = await fetchData(
      `${process.env.REACT_APP_SERVER_URL}/answer`,
      'POST',
      {
        pollId: id,
        ans: {
          reqFieldsAns,
          queFieldsAns,
        },
      }
    )
    setLoading({ state: false, text: '' })
    if (data.status === 200) {
      setFlashMsg({ content: data.message, color: 'green' })
      setTimeout(() => {
        navigate('/dashboard')
      }, 1000)
    }
  }

  useEffect(() => {
    ;(async () => {
      setLoading({ state: true, text: 'Loading Poll' })
      const { data } = await fetchData(
        `${process.env.REACT_APP_SERVER_URL}/poll/${id}`
      )
      setLoading({ state: false, text: '' })
      if (data.status === 500) {
        setFlashMsg({ color: 'red', content: 'Error' })
      } else if (data.status === 401) {
        setNotAuth(true)
        setFlashMsg({
          color: 'red',
          content:
            'Your are not authorized to view the poll, Please Sign in with the different account or contact the poll creator',
        })
      }
      if (data.status === 200 || data.status === 401) {
        setUsername(data.poll.createdBy.username)
        setName(data.poll.createdBy.name)
        setTitle(data.poll.title)
        setDes(data.poll.des)
        setStartTime(data.poll.startTime)
        setEndTime(data.poll.endTime)
        setAnsEditable(data.poll.ansEditable)
        if (data.poll.questions) {
          setQuestions(data.poll.questions)
          setReqFieldsToAns(data.poll.reqFieldsToAns)
        }
      }
    })()
  }, [id])
  useEffect(() => {
    ;(async () => {
      const { data } = await fetchData(
        `${process.env.REACT_APP_SERVER_URL}\\myanswer\\${id}`
      )
      if (data.status === 200) {
        let reqFieldsAns = {}
        data.answer.reqFieldsAns.forEach((item) => {
          reqFieldsAns[item.id] = item.ans
        })
        let queFieldsAns = {}
        data.answer.queFieldsAns.forEach((item) => {
          queFieldsAns[item.id] = item.ans
        })

        setAlreadyAnswered(true)
        setAnswersToInfo(reqFieldsAns)
        setAnswersToQue(queFieldsAns)
      }
    })()
  }, [id])
  return (
    <div className="answer-poll">
      <Flash color={flashMsg.color}>{flashMsg.content}</Flash>
      <Loading text={loading.text} loading={loading.state}></Loading>
      {!startAnswering ? (
        <AnswerStart
          title={title}
          username={username}
          name={name}
          des={des}
          startTime={startTime}
          endTime={endTime}
          setStartAnswering={setStartAnswering}
          notAuth={notAuth}
          alreadyAnswered={alreadyAnswered}
        />
      ) : (
        <div className="questions" ref={questionsEle}>
          {reqFieldsToAns.map((question, index) => {
            return (
              <Question
                question={question}
                index={index}
                isInfo={true}
                questionsEle={questionsEle}
                start={true}
                setAnswersToInfo={setAnswersToInfo}
                answer={answersToInfo[question.id]}
                disableField={alreadyAnswered && !ansEditable}
              />
            )
          })}
          {questions.map((question, index) => {
            return (
              <Question
                question={question}
                index={index}
                total={questions.length}
                questionsEle={questionsEle}
                end={true}
                setAnswersToQue={setAnswersToQue}
                handleSubmit={handleSubmit}
                answer={answersToQue[question.id]}
                disableField={alreadyAnswered && !ansEditable}
                disableBack={index === 0 && reqFieldsToAns.length === 0}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AnswerPoll
