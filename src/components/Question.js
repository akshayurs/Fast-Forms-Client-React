import { useState, useEffect } from 'react'
function Question({
  question,
  index,
  total,
  isInfo,
  questionsEle,
  end,
  start,
  setAnswersToInfo,
  setAnswersToQue,
  handleSubmit,
  answer,
  disableField,
  disableBack,
}) {
  const [textVal, setTextVal] = useState(
    typeof answer === 'string' ? answer : ''
  )
  const [checkboxVal, setCheckboxVal] = useState(
    typeof answer === 'object' ? answer : {}
  )
  const [ansEle, setAnsEle] = useState(<></>)

  function handleChange(val) {
    let change
    if (isInfo) change = setAnswersToInfo
    else change = setAnswersToQue
    change((prev) => {
      return { ...prev, [question.id]: val }
    })
  }

  useEffect(() => {
    if (question.fieldType !== 'radio' && question.fieldType !== 'checkbox') {
      handleChange(textVal)
    }
  }, [textVal])
  useEffect(() => {
    if (question.fieldType === 'radio' || question.fieldType === 'checkbox') {
      handleChange(checkboxVal)
    }
  }, [checkboxVal])

  useEffect(() => {
    switch (question.fieldType) {
      case 'text':
      case 'number':
      case 'date':
      case 'datetime-local':
        setAnsEle(
          <input
            type={question.fieldType}
            onChange={(e) => {
              setTextVal(e.target.value)
            }}
            value={textVal}
            disabled={disableField}
          ></input>
        )
        break
      case 'textarea':
        setAnsEle(
          <textarea
            onChange={(e) => {
              setTextVal(e.target.value)
            }}
            value={textVal}
            disabled={disableField}
          />
        )
        break
      case 'dropdown':
        if (textVal === '') {
          setTextVal(question.options[0])
        }
        setAnsEle(
          <select
            onChange={(e) =>
              setTextVal(() => {
                return e.target.value
              })
            }
            disabled={disableField}
            value={textVal}
          >
            {question.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
        break
      case 'radio':
      case 'checkbox':
        setAnsEle(
          question.options.map((option, no) => {
            if (checkboxVal[option] === undefined)
              setCheckboxVal((prev) => {
                return { ...prev, [option]: false }
              })
            return (
              <div key={no} className="checkboxbuttons">
                <label htmlFor={`q-${index}-${no}-${isInfo ? 'info' : ''}`}>
                  {option}
                </label>
                <input
                  type={question.fieldType}
                  name={`q-${index}`}
                  id={`q-${index}-${no}-${isInfo ? 'info' : ''}`}
                  checked={checkboxVal[option] ?? false}
                  disabled={disableField}
                  onChange={(e) => {
                    setCheckboxVal((prev) => {
                      const newObj = {}
                      const oldVal = prev[option]
                      if (question.fieldType === 'radio') {
                        Object.keys(prev).forEach((item) => {
                          newObj[item] = false
                        })
                        return { ...newObj, [option]: !oldVal }
                      } else {
                        return { ...prev, [option]: !prev[option] }
                      }
                    })
                  }}
                />
              </div>
            )
          })
        )
        break
      default:
        break
    }
  }, [checkboxVal, textVal, question])
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
          {(!start || index !== 0) && !disableBack ? (
            <p
              className="back"
              onClick={() => {
                questionsEle.current.scrollBy(-window.innerWidth, 0)
              }}
            >
              Back
            </p>
          ) : (
            ''
          )}
          {end && index === total - 1 ? (
            <p
              className="submit"
              onClick={() => {
                if (!disableField) handleSubmit()
              }}
            >
              Submit
            </p>
          ) : (
            <p
              className="next"
              onClick={() =>
                questionsEle.current.scrollBy(window.innerWidth, 0)
              }
            >
              Next
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Question
