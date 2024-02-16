"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import {
  Flex,
  useToast,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { DownloadIcon } from "@chakra-ui/icons";
import slice from "lodash/slice";
import axios from "axios";
import { CSVLink } from "react-csv";
import format from "date-fns/format";
import ClipLoader from "react-spinners/ClipLoader";

const ITEMS_PER_PAGE = 10;

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

    const formattedDate = new Intl.DateTimeFormat("en-IN", dateOptions).format(
      dateObj
    );
    return formattedDate;
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid Date";
  }
};

const AdminPage = () => {
  const toast = useToast();
  const [selectedTab, setSelectedTab] = useState();
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllVehicles();
  }, [selectedTab]);

  const getAllVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/getvehicle");

      if (response.status === 200) {
        setTableData(response.data.vehicles);
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
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch vehicle data. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const previousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  let displayData = slice(tableData, startIndex, endIndex);

  if (sortBy) {
    displayData = [...displayData].sort((a, b) => {
      const valueA = sortBy === "dateTime" ? new Date(a[sortBy]) : a[sortBy];
      const valueB = sortBy === "dateTime" ? new Date(b[sortBy]) : b[sortBy];

      if (sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }

  const handleSort = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (criteria) => {
    if (sortBy === criteria) {
      return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
    } else {
      return <FaSort />;
    }
  };

  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);

  const generatePageButtons = () => {
    const pageButtons = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    if (startPage > 1) {
      pageButtons.push(
        <Button
          key="ellipsis-start"
          variant="ghost"
          colorScheme="teal"
          disabled
        >
          ...
        </Button>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <Button
          key={i}
          variant={currentPage === i ? "solid" : "outline"}
          colorScheme="teal"
          onClick={() => goToPage(i)}
          mx="1"
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      pageButtons.push(
        <Button key="ellipsis-end" variant="ghost" colorScheme="teal" disabled>
          ...
        </Button>
      );
    }

    return pageButtons;
  };

  const updatedData = displayData.reverse();

  return (
    <Flex direction="row" w="full" h="screen">
      <Sidebar />
      {isLoading ? (
        <Flex
          justify="center"
          align="center"
          w="full"
          h="full"
          position="fixed"
          top="0"
          left="0"
        >
          <ClipLoader color={"teal"} loading={isLoading} size={50} />
        </Flex>
      ) : (
        <>
          <TableContainer p="2%" w={"100%"}>
            <Flex justify="flex-end">
              <CSVLink
                data={tableData}
                filename={"water-ville-parking.csv"}
                className="btn btn-primary"
                target="_blank"
              >
                <Button mb={5} colorScheme="teal" rightIcon={<DownloadIcon />}>
                  Export Data
                </Button>
              </CSVLink>
            </Flex>
            <Table colorScheme="gray">
              <Thead cursor={"pointer"}>
                <Tr>
                  <Th onClick={() => handleSort("vehicleNumber")}>
                    VEHICLE NUMBER {renderSortIcon("vehicleNumber")}
                  </Th>
                  <Th onClick={() => handleSort("vehicleType")}>
                    VEHICLE TYPE {renderSortIcon("vehicleType")}
                  </Th>
                  <Th onClick={() => handleSort("dateTime")}>
                    Date & Time {renderSortIcon("dateTime")}
                  </Th>
                  <Th onClick={() => handleSort("vehicleCharge")}>
                    VEHICLE CHARGE {renderSortIcon("vehicleCharge")}
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {displayData.map((vehicle, index) => (
                  <Tr key={vehicle._id} _hover={{ bg: "teal.50" }}>
                    <Td>{vehicle.vehicleNumber}</Td>
                    <Td>{vehicle.vehicleType}</Td>
                    <Td>{getDateTimeFormatted(vehicle.dateTime)}</Td>
                    <Td>{vehicle.vehicleCharge}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Flex
              mr="100px"
              justify="center"
              alignItems="center"
              marginTop="30px"
            >
              <Button
                colorScheme="teal"
                disabled={currentPage === 1}
                onClick={goToFirstPage}
                mr="2"
              >
                {"<<"}
              </Button>
              <Button
                colorScheme="teal"
                disabled={currentPage === 1}
                onClick={previousPage}
                mr="2"
              >
                {"<"}
              </Button>
              {generatePageButtons()}
              <Button
                colorScheme="teal"
                disabled={currentPage === totalPages}
                onClick={nextPage}
                ml="2"
              >
                {">"}
              </Button>
              <Button
                colorScheme="teal"
                disabled={currentPage === totalPages}
                onClick={goToLastPage}
                ml="2"
              >
                {">>"}
              </Button>
            </Flex>
          </TableContainer>
        </>
      )}
    </Flex>
  );
};

export default AdminPage;
