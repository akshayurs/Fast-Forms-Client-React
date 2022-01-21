function CreatedQuestion({ questions, setQuestions }) {
  return (
    <div className="created">
      {questions.length > 0 ? (
        <>
          <div className="title">What is your name</div>
        </>
      ) : (
        <div className="empty">Question List is Empty</div>
      )}
    </div>
  )
}

export default CreatedQuestion
