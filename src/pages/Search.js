import { useState } from 'react'
import { fetchData } from '../helpers/Fetch'
import Loading from '../helpers/Loading'
import { BsSearch } from 'react-icons/bs'
import PollItem from '../components/PollItem'
import Flash from '../components/Flash'
function Search() {
  const [loading, setLoading] = useState({ state: false, text: '' })
  const [flashMsg, setFlashMsg] = useState({ content: '', color: '' })
  const [polls, setPolls] = useState([])
  const [value, setValue] = useState('')
  const getPolls = async () => {
    if (!value) return
    setLoading({ state: true, text: 'Loading Polls' })
    const { data } = await fetchData(
      `${process.env.REACT_APP_SERVER_URL}/publicpolls/${value}`
    )
    setLoading({ state: false, text: '' })
    if (data.status !== 200 || data.polls.length <= 0) {
      setFlashMsg({ content: 'No Polls Found', color: 'red' })
      setTimeout(() => {
        setFlashMsg({ content: '', color: '' })
      }, 1000)
    }
    setPolls(data.polls)
  }

  return (
    <div className="search-screen">
      <Flash color={flashMsg.color}>{flashMsg.content}</Flash>
      <Loading text={loading.text} loading={loading.state}></Loading>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          getPolls()
        }}
      >
        <div className="search">
          <input
            type="text"
            placeholder="Enter text to search for title"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
          />
          <button
            type="submit"
            className="search-btn"
            onClick={() => {
              getPolls()
            }}
          >
            <BsSearch />
          </button>
        </div>
      </form>
      {polls.map((poll) => {
        return <PollItem poll={poll} />
      })}
    </div>
  )
}

export default Search
