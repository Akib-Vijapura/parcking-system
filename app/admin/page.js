"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  SimpleGrid,
  useToast,
  Text,
} from "@chakra-ui/react";
import AdminTable from "../components/adminTable";
import axios from "axios";
import CountUp from 'react-countup';
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaCar } from "react-icons/fa";
import { MdOutlineCalendarMonth } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";

const page = () => {
  const toast = useToast();

  const [selectedTab, setSelectedTab] = useState();
  const [todaysData, setTodaysData] = useState({})
  const [lastMonthsData, setLastMonthsData] = useState({})
  const [lastQuaterData, setLastQuaterData] = useState({})
  const [lastYearsData, setLastYearsData] = useState({})
  const [loading, setLoading] = useState(true)

  const dateOptions = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Kolkata",
    //timeZoneName: 'short',
  };
  
  const getDateTimeFormatted = (dateTime) => {
    try {
      const dateObj = new Date(dateTime);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date format");
      }
  
      const formattedDate = new Intl.DateTimeFormat("en-IN", dateOptions).format(
        dateObj
      );
      return formattedDate;
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid Date";
    }
  };


  const getDashboardData = async () => {
    setLoading(true)
    const response = await axios.get("/api/dashboard");

    if (response.status === 200) {
      setTodaysData(response.data.todaysData[0])
      setLastMonthsData(response.data.lastMonthData[0])
      setLastQuaterData(response.data.lastQuarterData[0])
      setLastYearsData(response.data.lastYearData[0])
    } else {
      console.log("FAILED to get VEHICLES");

      toast({
        title: "Failed to get Vehicles details, try again",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }

    setLoading(false)
  };

  useEffect(() => {
    if(JSON.stringify(todaysData) === '{}') {
      getDashboardData();
    }
  }, [selectedTab, todaysData, lastMonthsData, lastQuaterData, lastYearsData]);

  return (
    <Flex direction="row" w="full" h="screen">
      <Sidebar />

      {loading ? ( <ClipLoader
        color={"teal"}
        loading={loading}
        cssOverride={""}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />) : 

      (<Flex justifyContent={"center"} width={"100%"} ml={5} mt={50}>
        <SimpleGrid columns={2} spacing={10} spacingX={40}>
          <Card maxW="sm" maxH="sm">
            <CardHeader>
              <Heading size="sm">Today's Total data</Heading>
            </CardHeader>
            <CardBody>
            
              <div>
              <MdOutlineCalendarMonth />
                <Text>
                  Start: {getDateTimeFormatted(todaysData.startDate)}
                </Text>
                <Text>
                  End: {getDateTimeFormatted(todaysData.endDate)}
                </Text>

                <FaCar />
                <Text>
                 <CountUp end={todaysData.totalVehiclesParked} duration={5}/>
                </Text>

                <FaIndianRupeeSign /> 
                <Text>
                <CountUp end={todaysData.totalRevenue} duration={5}/>
                </Text>
              </div>
            </CardBody>
            <CardFooter>
              <Button>View here</Button>
            </CardFooter>
          </Card>
          <Card maxW="sm" maxH="sm">
            <CardHeader>
              <Heading size="sm">Last months data</Heading>
            </CardHeader>
            <CardBody>
              <div>
              <MdOutlineCalendarMonth />
              <Text>
                  Start: {getDateTimeFormatted(lastMonthsData.startDate)}
                  </Text>
                  <Text>
                  End: {getDateTimeFormatted(lastMonthsData.endDate)}
                </Text>

                <FaCar />
                <Text>
                  <CountUp end={lastMonthsData.totalVehiclesParked} duration={5}/>
                </Text>
                
                <FaIndianRupeeSign /> 
                <Text>
                  <CountUp end={lastMonthsData.totalRevenue} duration={5}/>
                </Text>
              </div>
            </CardBody>
            <CardFooter>
              <Button>View here</Button>
            </CardFooter>
          </Card>
          <Card maxW="sm" maxH="sm">
            <CardHeader>
              <Heading size="sm">Last quater data</Heading>
            </CardHeader>
            <CardBody>
              <div>
              <MdOutlineCalendarMonth />
              <Text>
                  Start: {getDateTimeFormatted(lastQuaterData.startDate)}
                  </Text>
                  <Text>
                  End: {getDateTimeFormatted(lastQuaterData.endDate)}
                </Text>

                <FaCar />
                <Text>
                 <CountUp end={lastQuaterData.totalVehiclesParked} duration={5}/>
                </Text>

                <FaIndianRupeeSign /> 
                <Text>
                  <CountUp end={lastQuaterData.totalRevenue} duration={5}/>
                </Text>
              </div>
            </CardBody>
            <CardFooter>
              <Button>View here</Button>
            </CardFooter>
          </Card>
          <Card maxW="sm" maxH="sm">
            <CardHeader>
              <Heading size="sm">Last years data</Heading>
            </CardHeader>
            <CardBody>
            <div>
            <MdOutlineCalendarMonth />
              <Text>
                  Start: {getDateTimeFormatted(lastYearsData.startDate)}
                </Text>
                <Text>
                  End: {getDateTimeFormatted(lastYearsData.endDate)}
                </Text>

                <FaCar />
                <Text>
                  <CountUp end={lastYearsData.totalVehiclesParked} duration={5}/>
                </Text>

                <FaIndianRupeeSign />
                <Text>
                  <CountUp end={lastYearsData.totalRevenue} duration={5}/>
                </Text>
              </div>
            </CardBody>
            <CardFooter>
              <Button>View here</Button>
            </CardFooter>
          </Card>
        </SimpleGrid>
      </Flex>)

  }
    </Flex>
  );
};

export default page;
