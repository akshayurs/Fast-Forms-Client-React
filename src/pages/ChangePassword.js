import { RiLockPasswordLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Flash from '../components/Flash'
import Loading from '../helpers/Loading'
import { fetchData } from '../helpers/Fetch'
function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('')
  const [password, setPassword] = useState('')
  const [passwordVal, setPasswordVal] = useState(true)
  const [password2, setPassword2] = useState('')
  const [password2Val, setPassword2Val] = useState('')
  const [loading, setLoading] = useState({ state: false, text: '' })
  const [flashMsg, setFlashMsg] = useState({ content: '', color: '' })
  const navigator = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      !password2 ||
      !password ||
      !oldPassword ||
      password !== password2 ||
      !passwordVal
    )
      return

    setLoading({ state: true, text: 'Signing In' })
    const { data } = await fetchData(
    process.env.REACT_APP_SERVER_URL + '/changepassword',
      'POST',
      {
        newPassword: password,
        oldPassword,
      }
    )
    setLoading({ state: false, text: '' })
    if (data.status === 200) {
      setFlashMsg({ color: 'green', content: 'Password Changed' })
      setTimeout(() => {
        navigator('/dashboard')
      }, 1500)
    } else if (data.status === 401) {
      if (flashMsg.content === data.message)
        setFlashMsg({ color: '', content: '' })
      setFlashMsg({ color: 'red', content: data.message })
    } else if (data.status === 500) {
      if (flashMsg.content === data.message)
        setFlashMsg({ color: '', content: '' })
      setFlashMsg({ color: 'red', content: data.message })
    }
  }

  return (
    <div className="auth-screen">
      <Loading loading={loading.state} text={loading.text}></Loading>
      <Flash color={flashMsg.color}>{flashMsg.content}</Flash>
      <form onSubmit={handleSubmit}>
        <div className="title">Change Password</div>
        <div className="field">
          <RiLockPasswordLine />
          <input
            type="text"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Old Password"
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
            placeholder="New Password"
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
        <button type="submit">SUBMIT</button>
      </form>
    </div>
  )
}

export default ChangePassword
