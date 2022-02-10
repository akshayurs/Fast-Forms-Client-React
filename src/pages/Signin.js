import { FaRegUser } from 'react-icons/fa'
import { RiLockPasswordLine } from 'react-icons/ri'
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Flash from '../components/Flash'
import Loading from '../helpers/Loading'
import { fetchData } from '../helpers/Fetch'
function Signin({ setLoggedin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState({ state: false, text: '' })
  const [flashMsg, setFlashMsg] = useState({ content: '', color: '' })
  const [passVisible, setPassVisible] = useState(false)
  const navigator = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username || !password) return
    setLoading({ state: true, text: 'Signing In' })
    const { data } = await fetchData(
      `${process.env.REACT_APP_SERVER_URL}/signin`,
      'POST',
      {
        username,
        password,
      }
    )
    setLoading({ state: false, text: '' })
    if (data.status === 200) {
      setLoggedin(true)
      navigator('/dashboard')
    } else if (data.status === 400) {
      navigator('/verify')
    } else if (data.status === 401 || data.status === 500) {
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
        <div className="title">SIGN IN</div>
        <div className="field">
          <FaRegUser />
          <input
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username/email"
            pattern=".{3,}"
            title="Enter username or email"
            required
          />
        </div>
        <div className="field">
          <RiLockPasswordLine />
          <input
            type={passVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {passVisible ? (
            <AiOutlineEyeInvisible onClick={() => setPassVisible(false)} />
          ) : (
            <AiOutlineEye onClick={() => setPassVisible(true)} />
          )}
        </div>
        <div className="switch">
          Don't have an account? <Link to="/signup">Register Here</Link>
        </div>
        <button type="submit">LOGIN</button>
      </form>
    </div>
  )
}

export default Signin
