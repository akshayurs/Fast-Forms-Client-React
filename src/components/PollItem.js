import { Link } from 'react-router-dom'
function PollItem({ poll, created, answer }) {
  return (
    <div className="poll">
      <div className="title">{answer ? poll.pollId.title : poll.title}</div>
      <div className="des">{answer ? poll.pollId.des : poll.des}</div>
      {!created && !answer && (
        <div className="createdBy">
          <div className="name">{poll.createdBy.name}</div>
          <div className="username">{poll.createdBy.username}</div>
        </div>
      )}
      <div className="time">
        {!answer ? (
          <>
            <div className="startTime">Start : {poll.startTime}</div>
            <div className="endTime">End : {poll.endTime}</div>
          </>
        ) : (
          <div className="modifiedTime">{poll.modifiedTime}</div>
        )}
      </div>
      {!created && (
        <div className="view">
          <Link to={`/answer/${answer ? poll.pollId._id : poll._id}`}>
            Open
          </Link>
        </div>
      )}
      {created && (
        <div className="edit">
          <Link to={`/poll/${poll._id}`}>Edit</Link>
        </div>
      )}
    </div>
  )
}

export default PollItem
