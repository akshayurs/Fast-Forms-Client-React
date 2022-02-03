import { MdOutlineDelete } from 'react-icons/md'
function CreatedQuestion({ questions, setQuestions }) {
  function getAns(question) {
    let ansField
    let field = question.fieldType

    if (
      field === 'text' ||
      field === 'textarea' ||
      field === 'number' ||
      field === 'date' ||
      field === 'datetime-local'
    ) {
      if (field === 'textarea') {
        ansField = <textarea></textarea>
      } else {
        ansField = <input type={field} />
      }
    } else if (field === 'checkbox' || field === 'radio') {
      ansField = question.options.map((item, index) => {
        return (
          <div key={index}>
            <label htmlFor={`q-${question.id}-o-${index}`} className="text">
              {item}
            </label>
            <input
              id={`q-${question.id}-o-${index}`}
              name={question.id}
              type={field}
            />
          </div>
        )
      })
    } else if (field === 'dropdown') {
      ansField = (
        <select>
          {question.options.map((item,index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>
      )
    }
    return ansField
  }

  return (
    <div className="created">
      {questions.length > 0 ? (
        <>
          {questions.map((question) => {
            const ansField = getAns(question)
            return (
              <div key={question.id}>
                <p>
                  <div className="title">{question.title}</div>
                  {question.des.length > 0 && (
                    <div className="des">{question.des}</div>
                  )}
                  <div className="answer-fields">{ansField}</div>
                  {question.ans?.length > 0 && (
                    <div className="answer">{question.ans}</div>
                  )}
                </p>
                <button
                  onClick={() => {
                    setQuestions((prev) =>
                      prev.filter((q) => q.id !== question.id)
                    )
                  }}
                >
                  <MdOutlineDelete />
                </button>
              </div>
            )
          })}
        </>
      ) : (
        <div className="empty">Question List is Empty</div>
      )}
    </div>
  )
}

export default CreatedQuestion
