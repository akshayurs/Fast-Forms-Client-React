import { MdOutlineDelete } from 'react-icons/md'
import { ImArrowDown2, ImArrowUp2 } from 'react-icons/im'
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
          {question.options.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      )
    }
    return ansField
  }

  function swap(arr, x, y) {
    let newArr = [...arr]
    let X = newArr[x]
    let Y = newArr[y]
    newArr[x] = Y
    newArr[y] = X
    return newArr
  }
  return (
    <div className="created">
      {questions.length > 0 ? (
        <>
          {questions.map((question, index) => {
            const ansField = getAns(question)
            return (
              <div key={question.id}>
                <p>
                  <div className="title">{question.title}</div>
                  {question.des?.length > 0 && (
                    <div className="des">{question.des}</div>
                  )}
                  <div className="answer-fields">{ansField}</div>
                  {question.ans?.length > 0 && (
                    <div className="answer">{question.ans}</div>
                  )}
                </p>
                <div className="buttons">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuestions((prev) => swap(prev, index, index - 1))
                      }}
                    >
                      <ImArrowUp2 />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setQuestions((prev) =>
                        prev.filter((q) => q.id !== question.id)
                      )
                    }}
                  >
                    <MdOutlineDelete />
                  </button>
                  {index !== questions.length - 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuestions((prev) => swap(prev, index, index + 1))
                      }}
                    >
                      <ImArrowDown2 />
                    </button>
                  )}
                </div>
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
