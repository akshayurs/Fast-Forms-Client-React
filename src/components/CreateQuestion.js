import { useEffect, useState } from 'react'
import { GrAdd } from 'react-icons/gr'
import { MdOutlineDelete } from 'react-icons/md'

function CreateQuestion({ setQuestions, removeItem, askAnswer, setNotAdded , setFlash}) {
  const [title, setTitle] = useState('')
  const [des, setDes] = useState('')
  const [fieldType, setFieldType] = useState('text')
  const [options, setOptions] = useState([])
  const [ans, setAns] = useState('')
  const [id, setId] = useState(0)
  const [optionTemp, setOptionTemp] = useState('')
  useEffect(() => {
    if (
      fieldType === 'text' ||
      fieldType === 'textarea' ||
      fieldType === 'number' ||
      fieldType === 'date' ||
      fieldType === 'datetime-local'
    ) {
      setOptions([])
      setOptionTemp('')
    }
  }, [fieldType])
  return (
    <div className="new">

      <div className="field">
        <div className="title main">Add New Question</div>
      </div>
      <div className="field">
        <input
          type="text"
          value={title}
          placeholder="Title*"
          onChange={(e) => {
            setNotAdded(true)
            setTitle(e.target.value.trim())
          }}
        />
      </div>
      <div className="field">
        <textarea
          placeholder="Description"
          value={des}
          onChange={(e) => {
            setNotAdded(true)
            setDes(e.target.value.trim())
          }}
        />
      </div>

      <div className="field">
        <div className="title">Select Answer Type:</div>
        <select
          value={fieldType}
          onChange={(e) => setFieldType(e.target.value)}
        >
          <option value="text">Text (single line)</option>
          <option value="textarea">Text (multi line)</option>
          <option value="number">Number</option>
          <option value="radio">Radio button</option>
          <option value="checkbox">Checkbox</option>
          <option value="dropdown">Dropdown menu</option>
          <option value="date">Date</option>
          <option value="datetime-local">Date and Time</option>
        </select>
      </div>
      {!(
        fieldType === 'text' ||
        fieldType === 'textarea' ||
        fieldType === 'number' ||
        fieldType === 'date' ||
        fieldType === 'datetime-local'
      ) && (
        <div className="field">
          <input
            type="text"
            placeholder="Add option"
            value={optionTemp}
            onChange={(e) => setOptionTemp(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              setNotAdded(true)
              const set = new Set(options)
              set.add(optionTemp.trim())
              setOptions((prev) => Array.from(set))
              setOptionTemp('')
            }}
          >
            <GrAdd />
          </button>
        </div>
      )}
      {options.length > 0 && (
        <div className="list">
          {options.map((option, index) => {
            return (
              <div key={index}>
                <p>{option}</p>
                <button
                  type="button"
                  onClick={() => {
                    setOptions(removeItem(options, option))
                  }}
                >
                  <MdOutlineDelete />
                </button>
              </div>
            )
          })}
        </div>
      )}
      {askAnswer && (
        <div className="field">
          <input
            type="text"
            placeholder="Answer for the question if exist"
            value={ans}
            onChange={(e) => setAns(e.target.value)}
          />
        </div>
      )}
      <button
        type="button"
        className="add-new"
        onClick={() => {
          if (
            !(
              fieldType === 'text' ||
              fieldType === 'textarea' ||
              fieldType === 'number' ||
              fieldType === 'date' ||
              fieldType === 'datetime-local'
            ) &&
            options.length <= 0
          ) {
            setFlash({ content: '', color: '' })
            setFlash({ content: 'Add options', color: 'red' })
            return
          }
          if (title === '') {
            setFlash({ content: '', color: '' })
            setFlash({ content: 'Add Title', color: 'red' })
            return
          }
          const newQuestion = {
            id,
            title,
            des,
            options,
            fieldType,
            ans,
          }
          setNotAdded(false)
          setId((prev) => prev + 1)
          setTitle('')
          setDes('')
          setFieldType('text')
          setOptions([])
          setOptionTemp('')
          setAns('')
          setQuestions((prev) => [...prev, newQuestion])
        }}
      >
        ADD
      </button>
    </div>
  )
}

export default CreateQuestion
