import React, { useContext, useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { useTransition, animated, config } from 'react-spring'
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
import AnswerPoll from './pages/AnswerPoll'
import Search from './pages/Search'
import Stats from './pages/Stats'

function App() {
  const location = useLocation()

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
  }, [setLoggedin])
  // const transitions = useTransition(location, {
  //   from: { opacity: 0 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  //   config: {
  //     delay: 0,
  //   },
  //   exitBeforeEnter: true,
  // })
  let headerColor = ''
  switch (location?.pathname.split('/')[1]) {
    case 'signin':
    case 'signup':
    case 'profile':
    case 'verify':
    case 'about':
    case 'dashboard':
    case 'changepass':
    case 'search':
      headerColor = 'black'
      break
    case 'poll':
    case 'answer':
      headerColor = 'violet'
      break
    default:
      headerColor = 'white'
  }

  return (
    <div className="App">
      <Header
        loggedin={loggedin}
        setLoggedin={setLoggedin}
        headerColor={headerColor}
      />
      {/* {transitions((style, item) => {(
      return
       <animated.div style={style}>  */}
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
        <Route path="/search" exact element={<Search />} />
        <Route path="/poll" exact element={<CreatePoll />} />
        <Route path="/poll/:id" exact element={<CreatePoll view={true} />} />
        <Route
          path="/dashboard"
          exact
          element={<Dashboard loggedin={loggedin} />}
        />
        <Route path="/answer/:id" exact element={<AnswerPoll />} />
        <Route path="/stats/:id" exact element={<Stats />} />
        <Route path="/changepass" exact element={<ChangePassword />} />
        <Route path="/verify/:token" element={<Verify toVerify={true} />} />
      </Routes>
      {/* </animated.div> */}){/* })} */}
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
