"use client";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Flex, Input, useToast, FormControl, FormLabel, Button, } from "@chakra-ui/react";
import AdminTable from "../components/adminTable";
import axios from "axios";

const page = () => {

  const toast = useToast();

  const [selectedTab, setSelectedTab] = useState();
  const [tableData, setTableData] = useState([]);

  const [vehicleNumberSearchParam, setVehicleNumberSearchParam] = useState("");

  const onSearchParamSubmit = (event) => {
    event.preventDefault();
    console.log("event=",event)
    const val = event.target.value;
    //setVehicleNumberSearchParam(e.target.vehicleNumberSearchParam)
    console.log("onSearchParamSubmit val=", val)
    var data = tableData.filter((item) => item.vehicleNumber.includes(val) == 1 );
    setTableData(data)
    console.log("FILTERED DATA=",data)
  }

  const tabChangeHandlerCallback = (currTab) => {
    console.log("Selected tab is =", currTab)
    setSelectedTab(currTab);
  }

  const getAllVehicles = async () => {
    const response = await axios.get("/api/getvehicle");

    if (response.status === 200) {
     setTableData(response.data.vehicles)
    } else {
      console.log("FAILED to get VEHICLES")

      toast({
        title: "Failed to get Vehicles details, try again",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }

  }

  useEffect(() => {
    if(tableData.length <= 0){
      getAllVehicles();
    }
    /*setSelectedTab([
      {
"_id": "65b72fe822ae68185b628525",
"dateTime": "2024-01-29T04:56:08.715Z",
"vehicleCharge": 30,
"vehicleNumber": "GJ03AE3478",
"vehicleType": "TWO",
},

​​{
"_id": "65b74c4d3e9b1a850e5efeea",
"dateTime": "2024-01-29T06:57:17.134Z",
"vehicleCharge": 50,
"vehicleNumber": "CSDCSDC",
"vehicleType": "THREE",
}
])*/
  }, [selectedTab])

  return (
    <Flex direction="row" w="full" h="screen">
  <Sidebar tabChangeHandler={tabChangeHandlerCallback}/>

  <Flex>
      <form> 
      <Input
              placeholder="GJ01BT9999"
              type="string"
              variant="filled"
              value={vehicleNumberSearchParam}
              onChange={(event) =>
                setVehicleNumberSearchParam(event.target.value)
                //onSearchParamChange(event.currentTarget.value)
              }
      /> 
      <Button type="submit" onClick={(e) =>onSearchParamSubmit(e)}>Click me</Button>
      </form>
      {tableData.length &&
    <AdminTable data={tableData} />
    }
   </Flex>

  </Flex>
  );
};

export default page;
