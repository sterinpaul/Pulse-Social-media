import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

interface AdminChartInterface{
  data:{month:string,count:number}[],
  chartType: string,
  title:string
}

const AdminChart:React.FC<AdminChartInterface> = ({data,chartType,title}) => {

  // Prepare data for Highcharts
  const chartData = data.map((item: { month: string, count: number }) => ({
    name: item.month,
    y: item.count
  }))

  // Highcharts configuration options
  const options: Highcharts.Options = {
    chart: {
      type: chartType,
    },
    title: {
      text: `Monthly ${title}`,
    },
    xAxis: {
      categories: data.map((item: { month: string }) => item.month),
    },
    series: [
      {
        type: chartType as 'line' | 'column' | 'bar' | 'scatter' | 'spline' | 'areaspline' | 'area' | 'pie',
        name: 'Values',
        data: chartData
      }
    ]
  }

  return (
    <>
      <div className="App mt-4">
        <HighchartsReact highcharts={Highcharts} options={options} />
      </div>
    </>
  )
}

export default AdminChart