"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Input } from '@chakra-ui/react'


const page = () => {
  const [serverTime, setServerTime] = useState('');

  useEffect(() => {
    // Fetch server time on the server
    const fetchServerTime = async () => {
      const response = await fetch('/api/time'); // Assuming you have an API route for time
      const data = await response.json();
      setServerTime(data.time);
    };

    const intervalId = setInterval(fetchServerTime, 1000); // Fetch every second

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [serverTime]);

  

  return (
    <div>
      <h1>Server Time: {serverTime}</h1>
    </div>
  );

};

export default page;
