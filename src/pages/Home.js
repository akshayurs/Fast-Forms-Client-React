import { Link, useNavigate } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import { fetchData } from '../helpers/Fetch'
import { useState } from 'react'
import Loading from '../helpers/Loading'
import Flash from '../components/Flash'

function Home({ loggedin, setLoggedin }) {
  const navigator = useNavigate()

  const [loading, setLoading] = useState({ state: false, text: '' })
  const [flashMsg, setFlashMsg] = useState({ content: '', color: '' })
  async function handleGoogleLogin(googleRes) {
    setLoading({ text: 'Signing in', state: true })
    const { data } = await fetchData(
      `${process.env.REACT_APP_SERVER_URL}/googlesignin`,
      'POST',
      { token: googleRes.tokenId }
    )
    setLoading({ text: '', state: false })
    if (data.status === 200 && data.success === false) {
      return navigator('/getusername/' + data.token)
    }
    if (data.status === 200 && data.success === true) {
      setLoggedin(true)
      return navigator('/dashboard')
    }
    if (data.status !== 200) {
      return setFlashMsg({ content: data.message, color: 'red' })
    }
  }

  return (
    <div className="home-screen">
      <Loading text={loading.text} loading={loading.state}></Loading>
      <Flash color={flashMsg.color}>{flashMsg.content}</Flash>
      <img src="/images/logo-placeholder.png" alt="logo" className="logo" />
      <div className="buttons">
        {loggedin ? (
          <>
            <div className="dashboard">
              <Link to="/dashboard">View Dashboard</Link>
            </div>
          </>
        ) : (
          <>
            <div className="signin">
              <Link to="/signin"> Sign In</Link>
            </div>
            <div className="signup">
              <Link to="/signup"> Create Account</Link>
            </div>

            <div>
              <div>
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
                  onSuccess={handleGoogleLogin}
                  onFailure={() => console.log('failed')}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Home
