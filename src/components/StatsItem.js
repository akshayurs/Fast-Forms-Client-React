import { Chart as ChartJS } from 'chart.js/auto'
import { Chart, Bar, Line } from 'react-chartjs-2'
function StatsItem({ question, answers }) {
  let draw = false
  let data = []
  let labels = []

  if (question.options?.length > 0) {
    let count = {}
    question.options.forEach((opt) => (count[opt] = 0))
    labels = question.options

    if (question.fieldType === 'dropdown' || question.fieldType === 'radio') {
      answers.forEach((answer) => {
        count[answer.queFieldsAns.find((x) => x.id === question.id).ans]++
      })
    }
    if (question.fieldType === 'checkbox') {
      answers.forEach((answer) => {
        const ans = answer.queFieldsAns.find((x) => x.id === question.id)?.ans
        question.options.forEach((item) => {
          if (ans[item]) count[item]++
        })
      })
    }
    question.options.forEach((opt) => data.push(count[opt]))
  }
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
          delay = context.dataIndex * 500 + context.datasetIndex * 100
        }
        return delay
      },
    },
  }
  console.log({ labels })
  return (
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
  )
}

export default StatsItem
