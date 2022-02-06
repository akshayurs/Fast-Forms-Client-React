function AnswerStart({
  title,
  username,
  name,
  des,
  endTime,
  startTime,
  setStartAnswering,
  notAuth,
  alreadyAnswered,
}) {
  let pollNotStarted = false
  let now = new Date()
  let end = new Date(endTime)
  let start = new Date(startTime)
  if (end > now && start < now) {
    pollNotStarted = false
  } else {
    pollNotStarted = true
  }
  return (
    <div className="answer-start">
      <div className="info">
        <div className="title">{title}</div>
        <div className="des">{des}</div>
      </div>
      <div className="createdby">
        <p>Created By : </p>
        <div>
          <div className="name"> {name}</div>
          <div className="username"> {username}</div>
        </div>
      </div>
      <div className="time">
        <p>Start Time : {start.toLocaleString()}</p>
        <p>End Time : {end.toLocaleString()}</p>
      </div>
      {!pollNotStarted && !notAuth && (
        <div className="start" onClick={() => setStartAnswering(true)}>
          {alreadyAnswered ? 'View Your submission' : 'Start'}
        </div>
      )}
    </div>
  )
}

export default AnswerStart
