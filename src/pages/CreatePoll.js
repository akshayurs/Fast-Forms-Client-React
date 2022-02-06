import { useEffect, useState } from 'react'
import { GrAdd } from 'react-icons/gr'
import { MdOutlineDelete } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import CreatedQuestion from '../components/CreatedQuestion'
import CreateQuestion from '../components/CreateQuestion'
import { fetchData } from '../helpers/Fetch'
function CreatePoll({ view }) {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [des, setDes] = useState('')
  const [authReq, setAuthReq] = useState(false)
  const [sendEmails, setSendEmails] = useState(true)
  const [emails, setEmails] = useState([])
  const [askFeedback, setAskFeedback] = useState(false)
  const [queEditable, setQueEditable] = useState(false)
  const [ansEditable, setAnsEditable] = useState(false)
  const [publicPoll, setPublicPoll] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [startTime, setStartTime] = useState(
    new Date().toISOString().slice(0, 16)
  )
  const [endTime, setEndTime] = useState('')
  const [viewAns, setViewAns] = useState(false)
  const [reqFieldsToAns, setReqFieldsToAns] = useState([])
  const [questions, setQuestions] = useState([])

  const [emailTemp, setEmailTemp] = useState('')

  const [flashMsg, setFlash] = useState({ content: '', color: '' })
  const [loading, setLoading] = useState({ text: '', state: false })
  function removeItem(array, item) {
    return array.filter((ele) => ele !== item)
  }
  useEffect(() => {
    if (publicPoll) {
      setAuthReq(false)
    }
  }, [publicPoll])
  useEffect(() => {
    if (!authReq) {
      setEmails([])
      setSendEmails(false)
    }
  }, [authReq])
  useEffect(() => {
    if (view)
      (async function () {
        const { data } = await fetchData(
          `${process.env.REACT_APP_SERVER_URL}\\poll\\${id}`
        )
        console.log(data)
        setTitle(data.poll.title)
        setDes(data.poll.des || '')
        setAuthReq(data.poll.authReq)
        setSendEmails(data.poll.sendEmails)
        setEmails(data.poll.emails)
        setAskFeedback(data.poll.askFeedback)
        setQueEditable(data.poll.queEditable)
        setAnsEditable(data.poll.ansEditable)
        setPublicPoll(data.poll.publicPoll)
        setShowStats(data.poll.showStats)
        setStartTime(new Date(data.poll.startTime).toISOString().slice(0, 16))
        setEndTime(new Date(data.poll.endTime).toISOString().slice(0, 16))
        setViewAns(data.poll.viewAns)
        setReqFieldsToAns(data.poll.reqFieldsToAns)
        setQuestions(data.poll.questions)
      })()
  }, [])
  async function handleSubmit(e) {
    e.preventDefault()
    const poll = {
      title,
      des,
      authReq,
      sendEmails,
      emails,
      publicPoll,
      askFeedback,
      queEditable,
      ansEditable,
      showStats,
      startTime,
      endTime,
      viewAns,
      reqFieldsToAns,
      questions,
    }
    const { data } = await fetchData(
      process.env.REACT_APP_SERVER_URL + '/poll',
      'POST',
      poll
    )
  }
  return (
    <div className="createpoll-screen">
      <form onSubmit={handleSubmit}>
        <div className="title">Create New Poll</div>
        <div className="container">
          <div className="field">
            <input
              type="text"
              placeholder="Poll Title (required)"
              value={title}
              required
              onChange={(e) => {
                setTitle(e.target.value)
              }}
            />
          </div>
          <div className="field">
            <textarea
              placeholder="Description"
              value={des}
              onChange={(e) => {
                setDes(e.target.value)
              }}
            />
          </div>
        </div>
        <div className="container">
          <div className="field">
            <div className="title">Public Poll</div>
            <input
              type="checkbox"
              checked={publicPoll}
              onChange={(e) => setPublicPoll((prev) => !prev)}
            />
          </div>
          {!publicPoll && (
            <>
              <div className="field">
                <div className="title">Require authentication to answer</div>
                <input
                  type="checkbox"
                  checked={authReq}
                  onChange={(e) => setAuthReq((prev) => !prev)}
                />
              </div>
              {authReq && (
                <>
                  <div className="field">
                    <div className="title">Send Email about poll</div>
                    <input
                      type="checkbox"
                      checked={sendEmails}
                      onChange={(e) => setSendEmails((prev) => !prev)}
                    />
                  </div>
                  <div className="field">
                    <input
                      type="text"
                      value={emailTemp}
                      onChange={(e) => setEmailTemp(e.target.value)}
                      placeholder="Add Email (comma or space separated for multiple)"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const oldSet = new Set(emails)
                        const newSet = new Set(
                          emailTemp
                            .replaceAll(',', ' ')
                            .split(' ')
                            .filter((email) => email.trim().length > 0)
                        )
                        const emailList = [...new Set([...oldSet, ...newSet])]
                        setEmails((prev) => emailList)
                        setEmailTemp('')
                      }}
                    >
                      <GrAdd />
                    </button>
                  </div>
                  <div className="emails">
                    {emails.length > 0 && (
                      <div className="list">
                        {emails.map((email, index) => {
                          return (
                            <div key={index}>
                              <p>{email}</p>
                              <button
                                type="button"
                                onClick={() => {
                                  setEmails(removeItem(emails, email))
                                }}
                              >
                                <MdOutlineDelete />
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        <div className="container">
          <div className="field">
            <div className="title">Ask Feedback after finishing answer</div>
            <input
              type="checkbox"
              checked={askFeedback}
              onChange={(e) => setAskFeedback((prev) => !prev)}
            />
          </div>
          <div className="field">
            <div className="title">Question editable by you</div>
            <input
              type="checkbox"
              checked={queEditable}
              onChange={(e) => setQueEditable((prev) => !prev)}
            />
          </div>
          <div className="field">
            <div className="title">Answer editable by users</div>
            <input
              type="checkbox"
              checked={ansEditable}
              onChange={(e) => setAnsEditable((prev) => !prev)}
            />
          </div>
          <div className="field">
            <div className="title">Show Answers to user after answering</div>
            <input
              type="checkbox"
              checked={viewAns}
              onChange={(e) => setViewAns((prev) => !prev)}
            />
          </div>
          <div className="field">
            <div className="title">
              Show Poll Statistics to user after answering
            </div>
            <input
              type="checkbox"
              checked={showStats}
              onChange={(e) => setShowStats((prev) => !prev)}
            />
          </div>
        </div>
        <div className="container">
          <div className="field">
            <div className="title">Start time:</div>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="field">
            <div className="title">End time:</div>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <div className="container">
          <div className="title">Required fields before answering</div>
          <div className="polls">
            <CreatedQuestion
              removeItem={removeItem}
              questions={reqFieldsToAns}
              setQuestions={setReqFieldsToAns}
            />
          </div>
          <CreateQuestion
            removeItem={removeItem}
            setQuestions={setReqFieldsToAns}
          />
        </div>
        <div className="container">
          <div className="title">Questions</div>
          <div className="polls">
            <CreatedQuestion
              removeItem={removeItem}
              questions={questions}
              setQuestions={setQuestions}
            />
          </div>
          <CreateQuestion
            removeItem={removeItem}
            setQuestions={setQuestions}
            askAnswer={true}
          />
        </div>
        <input type="submit" value="CREATE" />
      </form>
    </div>
  )
}

export default CreatePoll
