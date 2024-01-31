"use client";

import React, { useState } from "react";
import {
  Box,
  Grid,
  Text,
  Input,
  Button,
  Card,
  Heading,
  Flex,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import Sidebar from "@/app/components/Sidebar";

const VehiclePriceUpdate = () => {
  const vehicleTypes = ["2-wheeler", "3-wheeler", "4-wheeler", "bus"];
  const defaultPrices = {
    "2-wheeler": 20,
    "3-wheeler": 50,
    "4-wheeler": 80,
    bus: 110,
  };
  const [prices, setPrices] = useState(defaultPrices);
  const [selectedTab, setSelectedTab] = useState();

  const tabChangeHandlerCallback = (currTab) => {
    console.log("Selected tab is =", currTab);
    setSelectedTab(currTab);
  };

  const handlePriceChange = (vehicleType, newValue) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      [vehicleType]: newValue,
    }));
  };

  const handleUpdateAllPrices = () => {
    // Update all prices in backend based on prices object
    console.log("Updating all prices:", prices);
  };

  return (
    <>
      <Flex
        direction="row"
        w="full"
        h="screen"
        // justifyContent="center"
        alignItems="center"
      >
        <Sidebar tabChangeHandler={tabChangeHandlerCallback} />
        <Box
          className="outer-box"
          ml={"200px"}
          mt={"80px"}
          p={4}
          rounded={"10px"}
          shadow="md"
          bg="white"
          w="80%"
          maxW="800px"
        >
          <Heading textAlign={"center"} mb={4} color="teal.500">
            Update Vehicle Prices
          </Heading>
          <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={6}>
            {vehicleTypes.map((type) => (
              <Card key={type} p={4} rounded shadow>
                <Text fontSize="lg" fontWeight="bold" color="teal.500">
                  {type}
                </Text>
                <Box mt={2}>
                  <Text color="gray.500">Current Price:</Text>
                  <InputGroup>
                    <InputLeftAddon children="Rs." />
                    <Input
                      placeholder="Enter Price"
                      type="number"
                      value={prices[type]}
                      onChange={(e) => handlePriceChange(type, e.target.value)}
                    />
                  </InputGroup>
                </Box>
              </Card>
            ))}
          </Grid>
          <Button
            mt={4}
            colorScheme="teal"
            onClick={handleUpdateAllPrices}
            size={"lg"}
            w="100%"
          >
            Update All Prices
          </Button>
        </Box>
      </Flex>
    </>
  );
};

export default VehiclePriceUpdate;
