"use client";
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Flex, useToast, Button } from "@chakra-ui/react";
import AdminTable from "../../components/adminTable";
import axios from "axios";
import { CSVLink } from "react-csv";
import ClipLoader from "react-spinners/ClipLoader";

const page = () => {
  const toast = useToast();

  const [selectedTab, setSelectedTab] = useState();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabChangeHandlerCallback = (currTab) => {
    console.log("Selected tab is =", currTab);
    setSelectedTab(currTab);
  };

  const getAllVehicles = async () => {
    setLoading(true)
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

    setLoading(false)
  };

  useEffect(() => {
    if(tableData.length <= 0) {
      getAllVehicles();
    }
  }, [selectedTab, tableData]);

  return (
    <Flex direction="row" w="full" h="screen">
      <Sidebar />

     {loading ? 
     (<ClipLoader
        color={"teal"}
        loading={loading}
        cssOverride={""}
        size={50}
        aria-label="Loading Spinner"
        data-testid="loader"
      />) : ( 
      tableData.length &&
      <>
        <CSVLink
          data={tableData}
          filename={"water-ville-parking.csv"}
          className="btn btn-primary"
          target="_blank"
        >
          <Button colorScheme="teal">Export Data</Button>
        </CSVLink>;
     
       <AdminTable data={tableData} />
       </>
       )}
    </Flex>
  );
};

export default page;
