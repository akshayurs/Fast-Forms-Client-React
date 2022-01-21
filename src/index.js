import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useTransition, animated } from 'react-spring'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import './scss/main.scss'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Verify from './pages/Verify'
import ChangePassword from './pages/ChangePassword'
import Profile from './pages/Profile'
import About from './pages/About'
import { fetchData } from './helpers/Fetch'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import CreatePoll from './pages/CreatePoll'
function App() {
  const { pathname } = useLocation()
  let headerColor = ''
  switch (pathname) {
    case '/signin':
    case '/signup':
    case '/profile':
    case '/verify':
    case '/about':
    case '/dashboard':
    case '/changepass':
    case '/verify/:token':
      headerColor = 'black'
      break
    case '/createpoll':
      headerColor = 'violet'
      break
    default:
      headerColor = 'white'
  }
  // const transitions = useTransition(item, {
  //   from: { x: 100, y: -10, opacity: 0 },
  //   enter: { x: 0, y: 0, opacity: 1 },
  //   leave: { x: -100, y: -10, opacity: 0 },
  //   exitBeforeEnter: true,
  // })
  const [loggedin, setLoggedin] = useState(false)
  useEffect(() => {
    let loggedin = localStorage.getItem('loggedin')
    if (loggedin === 'true') setLoggedin(true)
    else setLoggedin(false)
    ;(async () => {
      const { data } = await fetchData(
        process.env.REACT_APP_SERVER_URL + '/checktoken'
      )
      if (data.status === 200) {
        localStorage.setItem('loggedin', 'true')
        setLoggedin(true)
      } else {
        localStorage.setItem('loggedin', 'false')
        setLoggedin(false)
      }
    })()
  }, [setLoggedin, loggedin])
  return (
    <div className="App">
      {/* {transitions((style, item) => {
        console.log(style, item)
        return <animated.div style={style}></animated.div>
      })} */}
      <Header
        loggedin={loggedin}
        setLoggedin={setLoggedin}
        headerColor={headerColor}
      />
      <Routes>
        <Route path="/" exact element={<Home loggedin={loggedin} />} />
        <Route
          path="/signin"
          exact
          element={<Signin setLoggedin={setLoggedin} />}
        />
        <Route path="/signup" exact element={<Signup />} />
        <Route path="/verify" exact element={<Verify />} />
        <Route path="/profile" exact element={<Profile />} />
        <Route path="/about" exact element={<About />} />
        <Route path="/createpoll" exact element={<CreatePoll />} />
        <Route
          path="/dashboard"
          exact
          element={<Dashboard loggedin={loggedin} />}
        />
        <Route path="/changepass" exact element={<ChangePassword />} />
        <Route path="/verify/:token" element={<Verify toVerify={true} />} />
      </Routes>
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
