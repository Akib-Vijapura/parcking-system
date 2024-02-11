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

const page = () => {
  const toast = useToast();

  const [selectedTab, setSelectedTab] = useState();
  const [tableData, setTableData] = useState([]);

  const tabChangeHandlerCallback = (currTab) => {
    console.log("Selected tab is =", currTab);
    setSelectedTab(currTab);
  };

  const getAllVehicles = async () => {
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
  };

  useEffect(() => {
    getAllVehicles();
  }, [selectedTab]);

  return (
    <Flex direction="row" w="full" h="screen">
      <Sidebar />

      <Flex justifyContent={"center"} width={"100%"} ml={5} mt={50}>
        <SimpleGrid columns={2} spacing={10} spacingX={40}>
          <Card maxW="sm" maxH="sm">
            <CardHeader>
              <Heading size="sm">Today's Total vehicles</Heading>
            </CardHeader>
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
            <CardFooter>
              <Button>View here</Button>
            </CardFooter>
          </Card>
          <Card maxW="sm" maxH="sm">
            <CardHeader>
              <Heading size="sm">Last months vehicle</Heading>
            </CardHeader>
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
            <CardFooter>
              <Button>View here</Button>
            </CardFooter>
          </Card>
          <Card maxW="sm" maxH="sm">
            <CardHeader>
              <Heading size="md">Last year Vehicle</Heading>
            </CardHeader>
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
            <CardFooter>
              <Button>View here</Button>
            </CardFooter>
          </Card>
          <Card maxW="sm" maxH="sm">
            <CardHeader>
              <Heading size="sm">Total Vehicle</Heading>
            </CardHeader>
            <CardBody>
              <Text>
                View a summary of all your customers over the last month.
              </Text>
            </CardBody>
            <CardFooter>
              <Button>View here</Button>
            </CardFooter>
          </Card>
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};

export default page;
