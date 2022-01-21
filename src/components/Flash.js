import { useEffect, useRef, useState } from 'react'
function Flash({ children, color }) {
  const [visible, setVisible] = useState(false)
  const timeout = useRef(0)
  useEffect(() => {
    if (children) {
      setVisible(true)
      timeout.current = setTimeout(() => {
        setVisible(false)
      }, 3000)
    }
    return () => {
      clearTimeout(timeout.current)
    }
  }, [children, color])
  return (
    <>
      {children && visible && (
        <div className={'flash ' + color}>{children}</div>
      )}
    </>
  )
}

export default Flash
