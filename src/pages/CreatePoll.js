import { useEffect, useRef, useState } from 'react'
import { GrAdd } from 'react-icons/gr'
import { MdOutlineDelete } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import CreatedQuestion from '../components/CreatedQuestion'
import CreateQuestion from '../components/CreateQuestion'
import Flash from '../components/Flash'
import Loading from '../helpers/Loading'
import { fetchData } from '../helpers/Fetch'
import { toCorrectUTC } from '../helpers/DateConversion'
function CreatePoll({ view }) {
  const navigator = useNavigate()
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [des, setDes] = useState('')
  const [authReq, setAuthReq] = useState(false)
  const [sendEmails, setSendEmails] = useState(true)
  const [emails, setEmails] = useState([])
  const [askFeedback, setAskFeedback] = useState(false)
  const [queEditable, setQueEditable] = useState(true)
  const [ansEditable, setAnsEditable] = useState(false)
  const [publicPoll, setPublicPoll] = useState(false)
  const [showStats, setShowStats] = useState(true)
  const [shuffle, setShuffle] = useState(false)
  const [startTime, setStartTime] = useState(
    new Date().toLocaleString().slice(0, 16)
  )
  const [endTime, setEndTime] = useState('')
  const [viewAns, setViewAns] = useState(false)
  const [reqFieldsToAns, setReqFieldsToAns] = useState([])
  const [questions, setQuestions] = useState([])

  const [emailTemp, setEmailTemp] = useState('')

  const [flashMsg, setFlash] = useState({ content: '', color: '' })
  const [loading, setLoading] = useState({ text: '', state: false })
  const [notAdded1, setNotAdded1] = useState(false)
  const [notAdded2, setNotAdded2] = useState(false)
  const originalPoll = useRef({})
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

        originalPoll.current = data.poll
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
        setShuffle(data.poll.shuffle)
        setStartTime(toCorrectUTC(data.poll.startTime))
        setEndTime(toCorrectUTC(data.poll.endTime))
        setViewAns(data.poll.viewAns)
        setReqFieldsToAns(data.poll.reqFieldsToAns)
        setQuestions(data.poll.questions)
      })()
  }, [])
  async function handleSubmit(e) {
    e.preventDefault()
    if (notAdded1 || notAdded2) {
      if (
        !window.confirm(
          'Still some questions are not added. Do You still want to submit?'
        )
      ) {
        return
      }
    }
    if (questions.length === 0) {
      return setFlash({ content: 'Add Questions', color: 'red' })
    }
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
      shuffle,
      startTime: new Date(startTime).toJSON(),
      endTime: new Date(endTime).toJSON(),
      viewAns,
      reqFieldsToAns,
      questions,
    }
    let addToBody = {}
    let method
    if (id) {
      const modify = {}
      Object.keys(poll).forEach((key) => {
        if (poll[key] !== originalPoll.current[key]) {
          modify[key] = poll[key]
        }
      })
      addToBody.modify = modify
      addToBody.pollId = id
      method = 'PUT'
      if (Object.keys(modify).length === 0) {
        return setFlash({
          content: 'No Changes Found',
          color: 'red',
        })
      }
    } else {
      addToBody = poll
      method = 'POST'
    }

    setLoading({ text: 'Saving', state: true })
    const { data } = await fetchData(
      process.env.REACT_APP_SERVER_URL + '/poll',
      method,
      { ...addToBody }
    )
    setLoading({ text: '', state: false })
    setFlash({
      content: data.message,
      color: data.status === 200 ? 'green' : 'red',
    })
    if (data.status === 200) {
      setTimeout(() => {
        navigator('/dashboard')
      }, 1000)
    }
  }
  return (
    <div className="createpoll-screen">
      <Loading loading={loading.state} text={loading.text}></Loading>
      <Flash color={flashMsg.color}>{flashMsg.content}</Flash>
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
            <div>
              <div className="title">Public Poll</div>
              <div className="info">
                poll will be listed on public polls and anyone can answer
              </div>
            </div>
            <input
              type="checkbox"
              checked={publicPoll}
              onChange={(e) => setPublicPoll((prev) => !prev)}
            />
          </div>
          {!publicPoll && (
            <>
              <div className="field">
                <div>
                  <div className="title">Require authentication to answer</div>
                  <div className="info">
                    Only added users can view and answer the poll
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={authReq}
                  onChange={(e) => setAuthReq((prev) => !prev)}
                />
              </div>
              {authReq && (
                <>
                  <div className="field">
                    <div>
                      <div className="title">Send Email about poll</div>
                      <div className="info">
                        Invite link will be sent to emails
                      </div>
                    </div>
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
            <div>
              <div className="title">Question editable by you</div>
              <div className="info">
                if not poll cannot be modified in future
              </div>
            </div>

            <input
              type="checkbox"
              checked={queEditable}
              onChange={(e) => setQueEditable((prev) => !prev)}
            />
          </div>
          <div className="field">
            <div>
              <div className="title">Answer editable by users</div>
              <div className="info">
                Allow users to modify and delete their answer
              </div>
            </div>
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
            <div>
              <div className="title">
                Show Poll Statistics to user after answering
              </div>
              <div className="info">
                show the number of votes or same text answers
              </div>
            </div>
            <input
              type="checkbox"
              checked={showStats}
              onChange={(e) => setShowStats((prev) => !prev)}
            />
          </div>
          <div className="field">
            <div>
              <div className="title">Shuffle Questions</div>
              <div className="info">
                order of questions will be shuffled for users
              </div>
            </div>
            <input
              type="checkbox"
              checked={shuffle}
              onChange={(e) => setShuffle((prev) => !prev)}
            />
          </div>
        </div>
        <div className="container">
          <div className="field">
            <div className="title">Start time:</div>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value)
              }}
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
          <div>
            <div className="title">Required fields before start answering</div>
            <div className="info">
              These questions will not be visible in poll Statistics for other
              users if it is enabled
            </div>
          </div>
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
            setNotAdded={setNotAdded1}
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
            setNotAdded={setNotAdded2}
            setFlash={setFlash}
          />
        </div>
        <input type="submit" value="CREATE" />
      </form>
    </div>
  )
}

export default CreatePoll
