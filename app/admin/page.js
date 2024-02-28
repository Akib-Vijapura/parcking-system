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
  Image,
  Button
} from "@chakra-ui/react";
import axios from "axios";
import CountUp from "react-countup";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { FaCar } from "react-icons/fa";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { FiGrid, FiList } from "react-icons/fi";
import ClipLoader from "react-spinners/ClipLoader";
import { CSVLink } from "react-csv";
import { DownloadIcon } from "@chakra-ui/icons";

const Page = () => {
  const toast = useToast();

  const [selectedTab, setSelectedTab] = useState();
  const [todaysData, setTodaysData] = useState({});
  const [lastMonthsData, setLastMonthsData] = useState({});
  const [lastQuaterData, setLastQuaterData] = useState({});
  const [lastYearsData, setLastYearsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [countersData, setCountersData] = useState([]);
  const [counterDataForDownload, setCounterDataForDownload] = useState();

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

  const getCounterData = (counterNo) => {
    const counterData = countersData.find((window) => window.windowNo === counterNo);
  
    if (!counterData) {
      console.log(`Counter ${counterNo} not found.`);
      return null;
    }
  
    // Calculate total amount and count for each vehicle type
    const result = {
      totalAmount: counterData.entries.reduce((total, entry) => total + entry.vehicleCharge, 0),
      vehicleTypeCounts: {},
      totalVehicles: 0
    };
  
    counterData.entries.forEach((entry) => {
      const vehicleType = entry.vehicleType;
      if (!result.vehicleTypeCounts[vehicleType]) {
        result.vehicleTypeCounts[vehicleType] = 1;
      } else {
        result.vehicleTypeCounts[vehicleType]++;
      }
      result.totalVehicles++;
    });
  
    return result;
  };

  const getCountersData = async () => {
    try{
    const response = await axios.get("/api/today");

      if (response.status === 200) {
        setCountersData(response.data.groupedEntries)
       // console.log("data=",response.data.groupedEntries)
        setCounterDataForDownload(response.data.todaysEntries)
        //console.log("data=",response.data.todaysEntries)
      }
    } catch (err) {
      console.log("FAILED to get TODAY's COUNTER DATA err=", err);

      toast({
        title: "Failed to counters data, try again",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }

  };

  const getDashboardData = async () => {
    
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

    
  };

  useEffect(() => {
    setLoading(true);
    if (JSON.stringify(todaysData) === "{}") {
      getDashboardData();
    }
    
    if(countersData.length <= 0) {
      getCountersData();
    }

    setLoading(false);
  }, [loading]);

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
            <Box>
              <Text fontSize={50} fontWeight="bold" color="teal.500">
                Today's Counter Data
              </Text>
              <CSVLink
                data={counterDataForDownload}
                filename={"water-ville-parking-today-counter-data.csv"}
                className="btn btn-primary"
                target="_blank"
              >
                <Button mb={5} colorScheme="teal" rightIcon={<DownloadIcon />}>
                  Export Today's Counter Data
                </Button>
              </CSVLink>
              <SimpleGrid
                columns={[1, 2, 3]}
                mt={15}
                spacingX={10}
                spacingY={10}
              >
                {[
                  {
                    data: getCounterData("1"),
                    title: "Window 1",
                    bg: "#2D9596",
                  },
                  {
                    data: getCounterData("2"),
                    title: "Window 2",
                    bg: "#59B4C3",
                  },
                  {
                    data: getCounterData("3"),
                    title: "Window 3",
                    bg: "blue.500",
                  },
                  {
                    data: getCounterData("4"),
                    title: "Window 4",
                    bg: "#836FFF",
                  },
                  {
                    data: getCounterData("5"),
                    title: "Window 5",
                    bg: "#836FFF",
                  },
                  {
                    data: getCounterData("6"),
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
                    {/*<Text>
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
              </Text>*/}
                    <Flex direction={"row"}>
                      <div>
                        <Image src="/twoWheeler.png" width={10} />
                        <CountUp
                          end={
                            data?.vehicleTypeCounts.TWO
                              ? data.vehicleTypeCounts.TWO
                              : 0
                          }
                          duration={5}
                        />
                      </div>

                      <div style={{ marginLeft: 30 }}>
                        <Image src="/threeWheeler.png" width={10} />
                        <CountUp
                          end={
                            data?.vehicleTypeCounts.THREE
                              ? data.vehicleTypeCounts.THREE
                              : 0
                          }
                          duration={5}
                        />
                      </div>

                      <div style={{ marginLeft: 30 }}>
                        <Image src="/fourWheeler.png" width={10} />
                        <CountUp
                          end={
                            data?.vehicleTypeCounts.FOUR
                              ? data.vehicleTypeCounts.FOUR
                              : 0
                          }
                          duration={5}
                        />
                      </div>

                      <div style={{ marginLeft: 30 }}>
                        <Image src="/bus.png" width={10} />
                        <CountUp
                          end={
                            data?.vehicleTypeCounts.BUS
                              ? data.vehicleTypeCounts.BUS
                              : 0
                          }
                          duration={5}
                        />
                      </div>
                    </Flex>

                    <Text>
                      <Text as="span" fontWeight="bold">
                        Total Vehicles:{" "}
                      </Text>
                      <CountUp end={data?.totalVehicles} duration={5} />
                    </Text>

                    <Text>
                      <Text as="span" fontWeight="bold">
                        Total Cash:{" "}
                      </Text>
                      <CountUp end={data?.totalAmount} duration={5} />
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default Page;
