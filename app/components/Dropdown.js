"use client";  // Add this directive at the top of the file

import React from 'react';

const Dropdown = ({ vehicles, setYear, setChartType }) => {
  const years = [...new Set(vehicles.map(vehicle => new Date(vehicle.dateTime).getFullYear()))];

  return (
    <div className="mb-4">
      <div className="mb-2">
        <label htmlFor="year-select" className="mr-2 text-lg font-medium">Select Year:</label>
        <select
          id="year-select"
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
          onChange={(e) => setYear(parseInt(e.target.value))}
        >
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="chart-type-select" className="mr-2 text-lg font-medium">Select Chart Type:</label>
        <select
          id="chart-type-select"
          className="p-2 border rounded bg-gray-100 hover:bg-gray-200"
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
          <option value="doughnut">Doughnut</option>
          <option value="polarArea">Polar Area</option>
        </select>
      </div>
    </div>
  );
};

export default Dropdown;