import { Link } from 'react-router-dom'
import { FiEdit2 } from 'react-icons/fi'
import { MdDelete } from 'react-icons/md'
import { IoMdStats } from 'react-icons/io'
import { fetchData } from '../helpers/Fetch'
import { useState } from 'react'
import Flash from '../components/Flash'
import Loading from '../helpers/Loading'
import { toExactTime } from '../helpers/DateConversion'
import { useSpring, animated } from 'react-spring'
function PollItem({ poll, created, answer, index }) {
  const [flashMsg, setFlash] = useState({ content: '', color: '' })
  const [loading, setLoading] = useState({ text: '', state: false })
  return (
    <animated.div
      className="poll"
      style={useSpring({
        config: { friction: 15 },
        from: {
          opacity: 0,
          x: 100,
          y: 0,
        },
        to: {
          opacity: 1,
          x: 0,
          y: 0,
        },
        delay: index * 100,
      })}
    >
      <Loading loading={loading.state} text={loading.text}></Loading>
      <Flash color={flashMsg.color}>{flashMsg.content}</Flash>
      <div className="title">{answer ? poll?.pollId?.title : poll.title}</div>
      <div className="des">{answer ? poll.pollId.des : poll.des}</div>
      {!created && !answer && (
        <div className="createdBy">
          <div className="name">{poll.createdBy?.name}</div>
          <div className="username">{poll.createdBy?.username}</div>
        </div>
      )}
      <div className="time">
        {!answer ? (
          <>
            <div className="startTime">
              Start : {toExactTime(poll.startTime)}
            </div>
            <div className="endTime">End : {toExactTime(poll.endTime)}</div>
          </>
        ) : (
          <div className="modifiedTime">
            Answered : {toExactTime(poll.modifiedTime)}
          </div>
        )}
      </div>
      <div className="buttons">
        {!created && (
          <div className="view">
            <Link to={`/answer/${answer ? poll.pollId._id : poll._id}`}>
              Open
            </Link>
          </div>
        )}
        {created && (
          <>
            <div className="edit">
              <Link to={`/poll/${poll._id}`}>
                <FiEdit2 /> Edit
              </Link>
            </div>
            <div
              className="delete"
              onClick={async () => {
                if (window.confirm(`Delete ${poll.title}`)) {
                  setLoading({ text: 'Deleting', state: true })
                  const { data } = await fetchData(
                    `${process.env.REACT_APP_SERVER_URL}\\poll\\${poll._id}`,
                    'DELETE'
                  )
                  setLoading({ text: '', state: false })
                  setFlash({
                    content: data.message,
                    color: data.status === 200 ? 'green' : 'red',
                  })
                  if (data.status === 200)
                    setTimeout(() => {
                      window.location.reload()
                    }, 1000)
                }
              }}
            >
              <MdDelete /> Delete
            </div>
            <div className="show">
              <Link to={`/stats/${poll._id}`}>
                <IoMdStats /> View
              </Link>
            </div>
          </>
        )}
      </div>
    </animated.div>
  )
}

export default PollItem
