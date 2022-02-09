// import { Chart as ChartJS } from 'chart.js/auto'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'

function StatsItem({ question, answers, field }) {
  const [data, setData] = useState([])
  const [labels, setLabels] = useState([])

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: question.title,
      },
    },
    animation: {
      delay: (context) => {
        let delay = 0
        if (context.type === 'data' && context.mode === 'default') {
          delay = context.dataIndex * 300 + context.datasetIndex * 100
        }
        return delay
      },
    },
  }
  useEffect(() => {
    let count = {}
    let data = []
    let labels = []
    if (question.options?.length > 0) {
      question.options.forEach((opt) => (count[opt] = 0))
      labels = question.options

      if (question.fieldType === 'dropdown' || question.fieldType === 'radio') {
        answers.forEach((answer) => {
          count[answer[field].find((x) => x.id === question.id).ans]++
        })
      }
      if (question.fieldType === 'checkbox') {
        answers.forEach((answer) => {
          const ans = answer[field].find((x) => x.id === question.id)?.ans
          question.options.forEach((item) => {
            if (ans[item]) count[item]++
          })
        })
      }
      question.options.forEach((opt) => data.push(count[opt]))
    }
    if (question.fieldType === 'text' || question.fieldType === 'number') {
      answers.forEach((answer) => {
        const ans = answer[field].find((x) => x.id === question.id).ans
        if (count[ans] !== undefined) count[ans]++
        else count[ans] = 1
      })
      Object.entries(count)
        .sort((x, y) => y[1] - x[1])
        .slice(0, 10)
        .forEach((x) => {
          data.push(x[1])
          labels.push(x[0])
        })
    }
    setLabels(labels)
    setData(data)
  }, [question, answers])

  return (
    <div className="chart">
      <Bar
        options={options}
        data={{
          labels,
          datasets: [
            {
              data,
              borderColor: 'rgb(53, 162, 235)',
              backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
          ],
        }}
      />
    </div>
  )
}

export default StatsItem
