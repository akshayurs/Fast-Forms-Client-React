import { Link } from 'react-router-dom'
function Home({ loggedin }) {
  console.log(loggedin)
  return (
    <div className="home-screen">
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
          </>
        )}
      </div>
    </div>
  )
}

export default Home
