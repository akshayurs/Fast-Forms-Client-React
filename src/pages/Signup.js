import { FaRegUser } from 'react-icons/fa'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { HiOutlineMail } from 'react-icons/hi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Flash from '../components/Flash'
import { fetchData } from '../helpers/Fetch'
import Loading from '../helpers/Loading'
function Signin() {
  const [username, setUsername] = useState('')
  const [usernameVal, setUsernameVal] = useState(false)
  const [name, setName] = useState('')
  const [nameVal, setNameVal] = useState(false)
  const [email, setEmail] = useState('')
  const [emailVal, setEmailVal] = useState(true)
  const [password, setPassword] = useState('')
  const [passwordVal, setPasswordVal] = useState(false)
  const [password2, setPassword2] = useState('')
  const [password2Val, setPassword2Val] = useState(false)
  const [loading, setLoading] = useState({ state: false, text: '' })
  const [flashMsg, setFlashMsg] = useState({ content: '', color: '' })
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== password2) return
    const user = {
      name,
      username,
      email,
      password,
    }
    if (usernameVal && nameVal && emailVal && passwordVal && password2Val) {
      setLoading({ text: 'Creating a New Account', state: true })
      const { data } = await fetchData(
        process.env.REACT_APP_SERVER_URL + '/signup',
        'POST',
        user
      )
      setLoading({ text: '', state: false })
      if (data.status === 200) {
        setFlashMsg({ color: 'green', content: data.message })
        setTimeout(() => {
          navigate('/verify')
        }, 1000)
      }
    } else {
      setFlashMsg({ color: 'red', content: 'Fill all details' })
    }
  }
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
        <div
          className={
            'field ' + (email !== '' ? (emailVal ? ' green ' : ' red ') : '')
          }
        >
          <HiOutlineMail />
          <input
            type="email"
            value={email}
            onBlur={async (e) => {
              const regEx =
                /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
              if (!regEx.test(e.target.value)) return setEmailVal(false)
              setEmailVal(true)
              const { data } = await fetchData(
                'https://open.kickbox.io/v1/disposable/' + e.target.value,
                null,
                null,
                false
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
        <div
          className={
            'field ' +
            (password !== '' ? (passwordVal ? ' green ' : ' red ') : '')
          }
        >
          <RiLockPasswordLine />
          <input
            type="password"
            value={password}
            onChange={(e) => {
              let regEx = /^.{6,30}$/
              if (regEx.test(e.target.value)) {
                setPasswordVal(true)
              } else {
                setPasswordVal(false)
              }
              setPassword(e.target.value)
            }}
            placeholder="Password"
            pattern="^.{6,30}$"
            title="length must be greater than 5 and less than 30"
            required
          />
        </div>
        <div
          className={
            'field ' +
            (password2 !== '' ? (password2Val ? ' green ' : ' red ') : '')
          }
        >
          <RiLockPasswordLine />
          <input
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value)
              if (password !== e.target.value) setPassword2Val(false)
              if (password === e.target.value && passwordVal)
                setPassword2Val(true)
            }}
            type="text"
            pattern="^.{6,30}$"
            placeholder="Confirm Password"
            required
          />
        </div>
        <div className="switch">
          Already have an account? <Link to="/signin">Sign In</Link>
        </div>
        <button type="submit">SIGN UP</button>
      </form>
    </div>
  )
}

export default Signin
