import { useState } from 'react'
import Loading from '../helpers/Loading'
import Flash from './Flash'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { fetchData } from '../helpers/Fetch'
import { useNavigate, useParams } from 'react-router-dom'

function GetUserName({ setLoggedin }) {
  const { token } = useParams()
  const [username, setUsername] = useState('')
  const navigator = useNavigate()
  const [usernameVal, setUsernameVal] = useState(false)
  const [loading, setLoading] = useState({ state: false, text: '' })
  const [flashMsg, setFlashMsg] = useState({ content: '', color: '' })
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username) return
    setLoading({ state: true, text: 'Signing In' })
    const { data } = await fetchData(
      `${process.env.REACT_APP_SERVER_URL}/googlesignin`,
      'POST',
      { token, username }
    )
    setLoading({ state: false, text: '' })
    if (data.status === 200) {
      setLoggedin(true)
      navigator('/dashboard')
    } else if (data.status === 401 || data.status === 500) {
      if (flashMsg.content === data.message)
        setFlashMsg({ color: '', content: '' })
      setFlashMsg({ color: 'red', content: data.message })
    }
  }
  return (
    <div className="auth-screen">
      <Loading text={loading.text} loading={loading.state}></Loading>
      <Flash color={flashMsg.color}>{flashMsg.content}</Flash>
      <form onSubmit={handleSubmit}>
        <div
          className={
            'field ' +
            (username !== '' ? (usernameVal ? ' green ' : ' red ') : '')
          }
        >
          <MdDriveFileRenameOutline />
          <input
            type="text"
            value={username}
            onBlur={async () => {
              if (!usernameVal) return
              const { data, error } = await fetchData(
                `${process.env.REACT_APP_SERVER_URL}/userexists/${username}`
              )
              if (data.status === 200) {
                setFlashMsg({
                  color: 'red',
                  content: 'Username not available',
                })
                setUsernameVal(false)
              } else if (data.status === 404) setUsernameVal(true)
            }}
            onChange={(e) => {
              let regEx = /^[a-zA-Z0-9_\-]{3,30}$/
              if (regEx.test(e.target.value)) {
                setUsernameVal(true)
              } else {
                setUsernameVal(false)
              }
              setUsername(e.target.value)
            }}
            placeholder="Username"
            required
            pattern="^[a-zA-Z0-9_\-]{3,30}$"
            title="Only a-z,A-Z,0-9,-,_ are valid"
          />
        </div>
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  )
}

export default GetUserName
