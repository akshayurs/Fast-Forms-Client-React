import { useEffect, useState } from 'react'
import Flash from '../components/Flash'
import Loading from '../helpers/Loading'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchData } from '../helpers/Fetch'
function Verify({ email, toVerify }) {
  const navigator = useNavigate()
  const { token } = useParams()
  const [flashMsg, setFlashMsg] = useState({ color: '', content: '' })
  const [loading, setLoading] = useState({ state: false, text: '' })

  useEffect(
    () =>
      (async () => {
        if (toVerify && token) {
          setLoading({ state: true, text: 'Verifying your e-mail' })
          const { data } = await fetchData(
            process.env.REACT_APP_SERVER_URL + '/verify/' + token
          )
          setLoading({ state: false, text: '' })
          if (data.status === 200) {
            setFlashMsg({ color: 'green', content: data.message })
            setTimeout(() => {
              navigator('/signin')
            }, 2000)
          } else {
            setFlashMsg({ color: 'red', content: 'Invalid token' })
          }
          setTimeout(() => {
            navigator('/')
          }, 2000)
        }
      })(),
    [token, toVerify, setLoading, navigator]
  )
  return (
    <div className="verify-screen">
      <Flash color={flashMsg.color}>{flashMsg.content}</Flash>
      <Loading text={loading.text} loading={loading.state} />
      <div className="title">
        Verify your e-mail to finish signing up for Fast forms
      </div>
      <p>
        Please confirm that {email} is your e-mail address by clicking on the
        verify button or opening the link sent
      </p>
    </div>
  )
}

export default Verify
