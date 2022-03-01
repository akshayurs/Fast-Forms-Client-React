import LoadingScreen from 'react-loading-screen'
function Loading({ text, loading }) {
  return loading ? (
    <div className="loading-popup">
      <LoadingScreen
        loading={loading}
        bgColor="#0000008e"
        spinnerColor="#9ee5f8"
        textColor="#fff"
        text={text || ''}
      ></LoadingScreen>
    </div>
  ) : (
    ''
  )
}

export default Loading
