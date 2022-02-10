import { FaRegUser } from 'react-icons/fa'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { HiOutlineMail } from 'react-icons/hi'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Flash from '../components/Flash'
import { fetchData } from '../helpers/Fetch'
import Loading from '../helpers/Loading'
function Profile() {
  const [username, setUsername] = useState('')
  const [usernameVal, setUsernameVal] = useState(true)
  const [name, setName] = useState('')
  const [nameVal, setNameVal] = useState(true)
  const [email, setEmail] = useState('')
  const [emailVal, setEmailVal] = useState(true)
  const [isGoogleUser, setIsGoogleUser] = useState(false)
  const [loading, setLoading] = useState({ state: false, text: '' })
  const [flashMsg, setFlashMsg] = useState({ content: '', color: '' })
  const originalData = useRef({})
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    let user = {}
    if (originalData.current.name !== name) user.name = name
    if (originalData.current.username !== username) user.username = username
    if (originalData.current.email !== email) user.email = email
    if (user && usernameVal && nameVal && emailVal) {
      setLoading({ text: 'Changing Details', state: true })
      const { data } = await fetchData(
        process.env.REACT_APP_SERVER_URL + '/modifydetails',
        'POST',
        user
      )
      setLoading({ text: '', state: false })
      if (data.status === 200) {
        setFlashMsg({ color: 'green', content: data.message })
      }
    } else {
      setFlashMsg({ color: 'red', content: 'Details not changed' })
    }
  }
  useEffect(() => {
    ;(async () => {
      setLoading({ text: 'Loading Profile', state: true })
      const { data, error } = await fetchData(
        process.env.REACT_APP_SERVER_URL + '/mydetails'
      )
      setLoading({ text: '', state: false })
      if (error) return
      if (data.status === 200) {
        originalData.current = data.user
        setName(data.user.name)
        setUsername(data.user.username)
        setEmail(data.user.email)
        setIsGoogleUser(data.user.isGoogleUser)
      } else {
        setFlashMsg({ color: 'red', content: data.message })
        setTimeout(() => {
          navigate('/signin')
        }, 2000)
      }
    })()
  }, [])
  return (
    <div className="auth-screen">
      <Loading text={loading.text} loading={loading.state}></Loading>
      <Flash color={flashMsg.color}>{flashMsg.content}</Flash>
      <form onSubmit={handleSubmit}>
        <div className="title">Create an New Account</div>
        <div
          className={
            'field ' + (name !== '' ? (nameVal ? ' green ' : ' red ') : '')
          }
        >
          <FaRegUser />
          <input
            type="text"
            value={name}
            onChange={(e) => {
              let regEx = /^.{3,30}$/
              if (regEx.test(e.target.value)) {
                setNameVal(true)
              } else {
                setNameVal(false)
              }
              setName(e.target.value)
            }}
            placeholder="Name"
            pattern="^.{3,30}$"
            title="length must be greater than 2 and less than 30"
            required
          />
        </div>
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
              if (username === originalData.current.username) return
              const { data } = await fetchData(
                process.env.REACT_APP_SERVER_URL + '/userexists/' + username
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
        <div
          className={
            'field ' + (email !== '' ? (emailVal ? ' green ' : ' red ') : '')
          }
        >
          <HiOutlineMail />
          <input
            type="email"
            value={email}
            disabled={isGoogleUser}
            onBlur={async (e) => {
              const regEx =
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
              if (!regEx.test(e.target.value)) return setEmailVal(false)
              setEmailVal(true)
              const { data } = await fetchData(
                'https://open.kickbox.io/v1/disposable/' + e.target.value
              )
              if (data?.disposable) {
                setEmailVal(false)
                setFlashMsg({
                  color: 'red',
                  content: 'Please provide your original Email id',
                })
              }
            }}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            placeholder="Email"
            required
          />
        </div>
        {!isGoogleUser && (
          <Link className="change-pass" to="/changepass">
            Change Password
          </Link>
        )}
        <button
          type="submit"
          disabled={
            originalData.current.name === name &&
            originalData.current.username === username &&
            originalData.current.email === email
          }
        >
          CHANGE
        </button>
      </form>
    </div>
  )
}

export default Profile
