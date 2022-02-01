import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSpring, animated } from 'react-spring'
import { Spin as Hamburger } from 'hamburger-react'
import { fetchData } from '../helpers/Fetch'
import Loading from '../helpers/Loading'
function Header({ loggedin, setLoggedin, headerColor }) {
  const [open, toggle] = useState(false)
  const navigator = useNavigate()
  const menuEle = useRef()
  const [loading, setloading] = useState({ text: '', state: false })
  const expand = useSpring({
    config: { friction: 15 },
    height: open ? `${menuEle.current.scrollHeight + 5}px` : '0px',
  })
  useEffect(() => {
    const theme = document.querySelector('meta[name="theme-color"]')
    if (headerColor === 'black') {
      theme.content = '#222831'
    } else if (headerColor === 'violet') {
      theme.content = '#32325d'
    }
  }, [headerColor])
  return (
    <div className={'header ' + headerColor}>
      <Loading text={loading.text} loading={loading.state} />
      <div className="top">
        <Link to="/" className="logo">
          FAST FORMS
        </Link>
        <div className="menu">
          <Hamburger
            size={30}
            toggled={open}
            toggle={toggle}
            direction="right"
          />
        </div>
      </div>
      <animated.div className="submenu" style={expand} ref={menuEle}>
        <div
          onClick={() => {
            toggle(false)
            navigator('/')
          }}
        >
          Home
        </div>
        <div
          onClick={() => {
            toggle(false)
            navigator('/about')
          }}
        >
          About
        </div>
        {loggedin ? (
          <>
            <div
              onClick={() => {
                toggle(false)
                navigator('/profile')
              }}
            >
              View Profile
            </div>
            <div
              onClick={async () => {
                toggle(false)
                setloading({ text: 'Signout', state: true })
                const { data } = await fetchData(
                  process.env.REACT_APP_SERVER_URL + '/signout'
                )
                setloading({ text: '', state: false })
                if (data.status === 200) {
                  setLoggedin(false)
                  localStorage.setItem('loggedin', 'false')
                  navigator('/')
                }
              }}
            >
              Sign Out
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => {
                toggle(false)
                navigator('/signin')
              }}
            >
              Sign In
            </div>
            <div
              onClick={() => {
                toggle(false)
                navigator('/signup')
              }}
            >
              Create Account
            </div>
          </>
        )}
      </animated.div>
    </div>
  )
}

export default Header
