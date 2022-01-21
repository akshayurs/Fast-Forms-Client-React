import LoadingScreen from 'react-loading-screen'
function Loading({ text, loading }) {
  return (
    <LoadingScreen
      loading={loading}
      bgColor="#0000008e"
      spinnerColor="#9ee5f8"
      textColor="#fff"
      text={text || ''}
    ></LoadingScreen>
  )
}

export default Loading
