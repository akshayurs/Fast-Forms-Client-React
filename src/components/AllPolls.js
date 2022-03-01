import { useEffect, useState } from 'react'
import { GrAddCircle } from 'react-icons/gr'
import { BsSearch } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import PollItem from './PollItem'
function AllPolls({ page, polls, pagination, setPolls, getPolls }) {
  return (
    <div className="polls">
      {polls.map((poll, index) => {
        return (
          <PollItem
            poll={poll}
            created={page === 'created'}
            answer={page === 'answered'}
            public={page === 'public'}
            index={index}
            setPolls={setPolls}
          />
        )
      })}
      {polls.length === 0 && (
        <div className="empty">
          {page === 'created' &&
            'Create your new poll by clicking above button to conduct Survey / Test / Election or any other Data Collection form'}
          {page === 'answered' && 'You have not answered any poll'}
        </div>
      )}
      {pagination.next && (
        <div
          className="loadmore"
          onClick={() => {
            getPolls(page)
          }}
        >
          <GrAddCircle />
        </div>
      )}
    </div>
  )
}

export default AllPolls
