"use client";
import React, { useState, useEffect } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
  useToast,
  Image,
} from "@chakra-ui/react";
import Sidebar from "@/app/components/Sidebar";
import axios from "axios";

const VehiclePriceUpdate = () => {
  const vehicleTypes = ["twoWheeler", "threeWheeler", "fourWheeler", "bus"];
  const [prices, setPrices] = useState({}); // Initialize empty prices object
  const [selectedTab, setSelectedTab] = useState();
  const [isLoading, setIsLoading] = useState(false); // Track loading state
  const [errorMessage, setErrorMessage] = useState(null); // Handle errors
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const toast = useToast();
  // Fetch vehicle prices from API on component mount
  useEffect(() => {
    setIsLoading(true);
    setErrorMessage(null);
    getAllVehicles()
      .then(() => {
        setIsLoading(false);
        // toast({
        //   title: "Vehicle Prices Loaded!",
        //   description: "Data ready for editing.",
        //   status: "info",
        //   duration: 5000, // Adjust duration as needed
        //   isClosable: true,
        //   position: "bottom-right",
        // });
      })
      .catch((error) => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Failed to fetch vehicle prices. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      });
  }, []);

  const tabChangeHandlerCallback = (currTab) => {
    console.log("Selected tab is =", currTab);
    setSelectedTab(currTab);
  };

  const getAllVehicles = async () => {
    try {
      const response = await axios.get("/api/vehiclecharges");

      if (response.status === 200) {
        const data = response.data.res[0];
        setPrices({
          ...data, // Use data directly to set prices
        });
      } else {
        setErrorMessage("Failed to fetch vehicle prices");
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      setErrorMessage("An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (vehicleType, newValue) => {
    setPrices((prevPrices) => ({
      ...prevPrices,
      [vehicleType]: newValue,
    }));
  };

  const handleUpdateAllPrices = async () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setIsConfirmModalOpen(false);

    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await axios.put("/api/vehiclecharges", prices);

      if (response.status === 200) {
        toast({
          title: "Success!",
          description: "Vehicle prices updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      } else {
        setErrorMessage("Failed to update vehicle prices");
      }
    } catch (error) {
      console.error("Error updating prices:", error);
      setErrorMessage("An error occurred while updating data");
    } finally {
      setIsLoading(false);
    }
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
        <Sidebar  />
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

          {/* {isLoading && <Text>Loading vehicle prices...</Text>}
          {errorMessage && <Text color="red">{errorMessage}</Text>} */}

          <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={6}>
            {vehicleTypes.map((type) => (
              <Card key={type} p={4} rounded shadow>
                {/* <Text fontSize="lg" fontWeight="bold" color="teal.500"> */}
                {/* {type} */}
                <Image width={"70px"} src={`/${type}.png`} />
                {/* </Text> */}
                <Box mt={1}>
                  <Text color="gray.500">Current Price:</Text>
                  <InputGroup>
                    <InputLeftAddon children="Rs." />
                    <Input
                      placeholder="Enter Price"
                      type="number"
                      value={prices[type]}
                      onChange={(e) => handlePriceChange(type, e.target.value)}
                      disabled={isLoading} // Disable input during loading
                    />
                  </InputGroup>
                </Box>
              </Card>
            ))}
          </Grid>
          <Modal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirm Price Updates</ModalHeader>
              <ModalBody>
                <Text>Are you sure you want to update vehicle charges?</Text>
              </ModalBody>
              <ModalFooter>
                <ButtonGroup justifyContent="center">
                  <Button
                    colorScheme="teal"
                    mr={3}
                    onClick={handleConfirmUpdate}
                  >
                    Yes
                  </Button>
                  <Button onClick={() => setIsConfirmModalOpen(false)}>
                    No
                  </Button>
                </ButtonGroup>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Button
            mt={4}
            colorScheme="teal"
            onClick={handleUpdateAllPrices}
            size={"lg"}
            w="100%"
            disabled={isLoading}
          >
            Update All Prices
          </Button>
        </Box>
      </Flex>
    </>
  );
};

export default VehiclePriceUpdate;
