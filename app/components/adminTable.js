"use client";
import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Flex,
} from "@chakra-ui/react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import slice from "lodash/slice";
import format from "date-fns/format";

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

const AdminTable = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

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

  let displayData = slice(data, startIndex, endIndex);

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

  return (
    <TableContainer marginTop="2.5vh" p="5%" w={"100%"}>
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
      <Flex mr="100px" justify="center" alignItems="center" marginTop="30px">
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
  );
};

export default AdminTable;
