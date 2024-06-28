"use client";  // Ensure this file is treated as a Client Component

import { useEffect, useState, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Flex } from '@chakra-ui/react';
import Dropdown from '../../components/Dropdown';
import Sidebar from '@/app/components/Sidebar';

export default function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartType, setChartType] = useState('bar');
  const [filteredData, setFilteredData] = useState({});
  const chartRef = useRef(null);
  let chartInstance = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:3000/api/getvehicle');
      const data = await response.json();
      setVehicles(data.vehicles);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      const filtered = vehicles.filter(vehicle => new Date(vehicle.dateTime).getFullYear() === year);
      const stateCounts = filtered.reduce((acc, vehicle) => {
        const stateCode = vehicle.vehicleNumber.slice(0, 2);
        if (stateCode === 'MH' || stateCode === 'GJ' || stateCode === 'RJ') {
          acc[stateCode] = (acc[stateCode] || 0) + 1;
        } else {
          acc['Others'] = (acc['Others'] || 0) + 1;
        }
        return acc;
      }, {});
      setFilteredData(stateCounts);
    };
    filterData();
  }, [vehicles, year]);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: chartType,
      data: {
        labels: Object.keys(filteredData),
        datasets: [{
          label: 'Vehicle Count',
          data: Object.values(filteredData),
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          // borderWidth: 5,
          hoverBackgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
          ],
          hoverBorderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
          ],
          hoverOffset: 20
        }]
      },
      options: {
        scales: chartType === 'polarArea' || chartType === 'doughnut' ? {} : {
          y: {
            beginAtZero: true
          }
        },
       animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
        from: 1,
        to: 0,
        loop: false
      }
    },
        plugins: {
          legend: {
            labels: {
              color: 'rgb(0, 0, 0)',
              font: {
                size: 14
              }
            }
          }
        }
      }
    });

    return () => {
      chartInstance.current.destroy();
    };
  }, [filteredData, chartType]);

  return (
     <Flex
        direction="row"
        w="full"
        h="screen"
        alignItems="center"
        // justifyContent="center"
      >
       <Sidebar />
    <div className="container ml-16 mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 ">Vehicle Analytics</h1>
      <Dropdown vehicles={vehicles} setYear={setYear} setChartType={setChartType} />
      {
        chartType === 'polarArea' || chartType === 'doughnut' ?  
      <div className="ml-52 mt-6 overflow-auto" style={{width : "50%"}}>
        <canvas ref={chartRef}></canvas>
      </div> :   
      <div className="mt-4 overflow-auto max-h-fit">
        <canvas ref={chartRef}></canvas>
      </div>
      }
    </div>
    </Flex>
  );
}