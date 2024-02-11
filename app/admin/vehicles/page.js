"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Flex, useToast } from "@chakra-ui/react";
import AdminTable from "../../components/adminTable";
import axios from "axios";

const page = () => {
  const toast = useToast();

  const [selectedTab, setSelectedTab] = useState();
  const [tableData, setTableData] = useState([]);

  const tabChangeHandlerCallback = (currTab) => {
    console.log("Selected tab is =", currTab);
    setSelectedTab(currTab);
  };

  const getAllVehicles = async () => {
    const response =  await axios.get("/api/getvehicle");

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
  };

  useEffect(() => {
    getAllVehicles();
  }, [selectedTab]);

  return (
    <Flex direction="row" w="full" h="screen">
      <Sidebar />

      {tableData.length && <AdminTable data={tableData} />}
    </Flex>
  );
};

export default page;
