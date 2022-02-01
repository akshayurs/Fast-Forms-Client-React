function Question({ question, index, total, isInfo }) {
  let ansEle = <></>
  switch (question.fieldType) {
    case 'text':
    case 'number':
    case 'date':
    case 'datetime-local':
      ansEle = <input type={question.fieldType}></input>
      break
    case 'textarea':
      ansEle = <textarea />
      break
    case 'dropdown':
      ansEle = (
        <select>
          {question.options.map((option) => (
            <option value={option}>{option}</option>
          ))}
        </select>
      )
      break
    case 'radio':
    case 'checkbox':
      ansEle = question.options.map((option, no) => (
        <div className="radiobuttons">
          <label htmlFor={`q-${index}-${no}`}>{option}</label>
          <input
            type={question.fieldType}
            name={`q-${index}`}
            id={`q-${index}-${no}`}
          />
        </div>
      ))
      break
    default:
      break
  }
  return (
    <div className="question">
      <div className="top">
        <div className="q-num">
          {isInfo
            ? 'Before Answering Fill this'
            : `Question ${index + 1}/${total}`}
        </div>
        <div className="title">{question.title}</div>
        <div className="des">{question.des}</div>
      </div>
      <div className="answer">{ansEle}</div>
      <div className="bottom">
        <div className="buttons">
          <p className="back">Back</p>
          <p
            className="next"
            onClick={() => {
              // questionsEle.current
            }}
          >
            Next
          </p>
        </div>
      </div>
    </div>
  )
}

export default Question
