"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  Flex,
  Heading,
  SimpleGrid,
  useToast,
  Text,
  Box,
  IconButton,
  Grid,
} from "@chakra-ui/react";
import axios from "axios";
import CountUp from "react-countup";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaCar } from "react-icons/fa";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FiGrid, FiList } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";

const Page = () => {
  const toast = useToast();

  const [selectedTab, setSelectedTab] = useState();
  const [todaysData, setTodaysData] = useState({});
  const [lastMonthsData, setLastMonthsData] = useState({});
  const [lastQuaterData, setLastQuaterData] = useState({});
  const [lastYearsData, setLastYearsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  const dateOptions = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Kolkata",
  };

  const getDateTimeFormatted = (dateTime) => {
    try {
      const dateObj = new Date(dateTime);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date format");
      }

      const formattedDate = new Intl.DateTimeFormat(
        "en-IN",
        dateOptions
      ).format(dateObj);
      return formattedDate;
    } catch (error) {
      console.error("Error parsing date:", error);
      return "Invalid Date";
    }
  };

  const getDashboardData = async () => {
    setLoading(true);
    try{
    const response = await axios.get("/api/dashboard");

      if (response.status === 200) {
        setTodaysData(response.data.todaysData[0]);
        setLastMonthsData(response.data.lastMonthData[0]);
        setLastQuaterData(response.data.lastQuarterData[0]);
        setLastYearsData(response.data.lastYearData[0]);
      }
    } catch (err) {
      console.log("FAILED to get VEHICLES err=", err);

      toast({
        title: "Failed to get Vehicles details, try again",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (JSON.stringify(todaysData) === "{}") {
      getDashboardData();
    }
  }, [selectedTab, todaysData, lastMonthsData, lastQuaterData, lastYearsData]);

  return (
    <Flex direction="row" w="full" h="screen" alignItems="flex-start">
      <Sidebar />

      {loading ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100vh"
        >
          <ClipLoader
            color="teal"
            loading={loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </Flex>
      ) : (
        <Flex justifyContent="center" width="100%" mt={20} position="relative">
          <IconButton
            aria-label="Toggle View"
            icon={viewMode === "grid" ? <FiList /> : <FiGrid />}
            colorScheme="teal"
            size="lg"
            position="absolute"
            top={4}
            right={4}
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          />
          {viewMode === "grid" ? (
            <SimpleGrid columns={[1, 2]} spacingX={10} spacingY={10}>
              {[
                {
                  data: todaysData,
                  title: "Today's Total Data",
                  bg: "#2D9596",
                },
                {
                  data: lastMonthsData,
                  title: "Last Month's Total Data",
                  bg: "#59B4C3",
                },
                {
                  data: lastQuaterData,
                  title: "Last Quarter's Total Data",
                  bg: "blue.500",
                },
                {
                  data: lastYearsData,
                  title: "Last Year's Total Data",
                  bg: "#836FFF",
                },
              ].map(({ data, title, bg }, index) => (
                <Box
                  key={index}
                  maxW="lg"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  borderColor="gray.300"
                  _hover={{
                    transform: "scale(1.05)",
                    transition: "transform 0.3s ease",
                    shadow: "lg",
                  }}
                >
                  <Box bg={bg} color="white" p={10} borderRadius="lg">
                    <Heading size="lg" mb={4}>
                      {title}
                    </Heading>
                    <Flex direction="column">
                      <Flex alignItems="center" mb={2}>
                        <MdOutlineCalendarMonth />
                        <Text as="span" ml={2} fontWeight="bold">
                          From :
                        </Text>
                        {getDateTimeFormatted(data.startDate)}
                      </Flex>
                      <Flex alignItems="center" mb={2}>
                        <MdOutlineCalendarMonth />
                        <Text as="span" ml={2} fontWeight="bold">
                          To :
                        </Text>{" "}
                        {getDateTimeFormatted(data.endDate)}
                      </Flex>
                      <Flex alignItems="center" mb={1}>
                        <FaCar size={40} />
                        <Text fontSize="3xl" ml={2} fontWeight="bold">
                          <CountUp
                            end={data.totalVehiclesParked}
                            duration={5}
                          />
                        </Text>
                      </Flex>
                      <Flex alignItems="center">
                        <FaIndianRupeeSign size={40} />
                        <Text fontSize="4xl" ml={2} fontWeight="bold">
                          <CountUp end={data.totalRevenue} duration={5} />
                        </Text>
                      </Flex>
                    </Flex>
                  </Box>
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <SimpleGrid columns={[1, 2]} spacingX={10} spacingY={10}>
              {[
                {
                  data: todaysData,
                  title: "Window 1",
                  bg: "#2D9596",
                },
                {
                  data: lastMonthsData,
                  title: "Window 2",
                  bg: "#59B4C3",
                },
                {
                  data: lastQuaterData,
                  title: "Window 3",
                  bg: "blue.500",
                },
                {
                  data: lastYearsData,
                  title: "Window 4",
                  bg: "#836FFF",
                },
                {
                  data: lastYearsData,
                  title: "Window 5",
                  bg: "#836FFF",
                },
                {
                  data: lastYearsData,
                  title: "Window 6",
                  bg: "#836FFF",
                },
              ].map(({ data, title, bg }, index) => (
                <Box
                  key={index}
                  p={6}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="md"
                  bg="white"
                  _hover={{ boxShadow: "lg" }}
                  width={"100%"}
                  mb={4}
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Text fontSize="xl" fontWeight="bold" color="teal.500">
                      {title}
                    </Text>
                  </Flex>
                  <Text>
                    <Text as="span" fontWeight="bold">
                      From:{" "}
                    </Text>
                    {getDateTimeFormatted(data.startDate)}
                  </Text>
                  <Text>
                    <Text as="span" fontWeight="bold">
                      To:{" "}
                    </Text>
                    {getDateTimeFormatted(data.endDate)}
                  </Text>
                  <Text>
                    <Text as="span" fontWeight="bold">
                      Total Vehicles Parked:{" "}
                    </Text>
                    <CountUp end={data.totalVehiclesParked} duration={5} />
                  </Text>
                  <Text>
                    <Text as="span" fontWeight="bold">
                      Total Revenue:{" "}
                    </Text>
                    <CountUp end={data.totalRevenue} duration={5} />
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default Page;
