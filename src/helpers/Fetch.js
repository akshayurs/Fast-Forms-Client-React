import { useEffect, useState } from 'react'
import axios from 'axios'
function useFetch(url, method, body) {
  const [isLoading, setIsLoading] = useState(false)
  const [apiData, setApiData] = useState(null)
  const [serverError, setServerError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        const resp = await axios({
          method: method,
          url: url,
          data: body,
        })
        const data = await resp?.data

        setApiData(data)
        setIsLoading(false)
      } catch (error) {
        setServerError(error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [url, method, body])

  return { isLoading, apiData, serverError }
}
const fetchData = async (url, method, body, credential) => {
  try {
    let res
    if (method) {
      res = await fetch(url, {
        method,
        credentials: credential === false ? '' : 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
    } else {
      res = await fetch(url, {
        credentials: credential === false ? '' : 'include',
      })
    }

    const data = await res.json()
    return { data }
  } catch (error) {
    return { error }
  }
}
export { useFetch, fetchData }
