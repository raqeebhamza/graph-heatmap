
import './App.css';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import moment from 'moment';
import { Options, ResponseDto, ResponseDto2 } from './types';
import { HeatMapGrid } from 'react-grid-heatmap'



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
function App() {
  const hdata = [
    [ 10,  15,  1 ],
    [50,  50,  2],
    [ 30,  70,  3 ],
];
  
  const [selected,setSelected] = useState<Options>()
  const optionList=[{id: "1", name:"X position of human"},{id:"2", name: "Number of humans at that time"}]
  const [data,setData] = useState<ChartData<"line">>()
  const [option,setOption] = useState<ChartOptions<"line">>({
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
  }) 
  return (
    <>
      <div className="App">
        <select
          onChange={(e) => {
            const c = optionList.find((x)=> x.id===e.target.value);
            setSelected(c)
            if (c?.id=="1"){
              axios.get('http://localhost:3005/api/get_pox_x/30').then((response)=>{
                setData({
                  labels: response.data.result.map((e:ResponseDto)=>{//return e.time
                  return moment.unix(e.time).format("MM-DD-HH:mm")
                }),
                  datasets:[
                    {
                      label: 'X positions',
                      data: response.data.result.map((e:ResponseDto)=>{ return e.x}),
                      borderColor: 'rgb(255, 99, 132)',
                      backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                  ]
                })
              })
            }
            else{
              axios.get('http://localhost:3005/api/get_human_count/30').then((response)=>{
                setData({
                  labels: response.data.result.map((e:ResponseDto2)=>{//return e.time
                  return moment.unix(e.time).format("MM-DD-HH:mm")
                }),
                  datasets:[
                    {
                      label: 'Humans Count',
                      data: response.data.result.map((e:ResponseDto2)=>{ return e.hcount}),
                      borderColor: 'rgb(255, 99, 132)',
                      backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    },
                  ]
                })
              })
            }
          }}
          defaultValue="default"
        >
          <option value="default">Choose an option</option>
          {optionList
            ? optionList.map((c) => {
              return (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              );
            })
            : null}
        </select>
      </div>

      {data ?(
        <div style={{width:600}}>
          <Line options={option} data={data}/> 
        </div> 
        ):null}
      <HeatMapGrid
            data={hdata}
            cellHeight='2rem'
            square
            onClick={(x, y) => alert(`Clicked (${x}, ${y})`)}
            xLabelsPos='bottom'
            cellRender={(x, y, value) => (
              <div title={`Pos(${x}, ${y}) = ${value}`}>{value}</div>
            )}
          />
    </>
  );
}

export default App;
