"use client";

import { useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  useColorModeValue,
  CircularProgress,
  useToast,
  InputGroup,
} from "@chakra-ui/react";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Image } from "@chakra-ui/react";
import NavBar from "../components/clientNavBar";
import axios from "axios";

const Home = () => {
  // const router = useRouter();
  // const formBackground = useColorModeValue("gray.170", "gray.700");
  const [isLoading, setIsLoading] = useState(false);

  const [vehicle, setVehicle] = useState({
    vehicleNumber: "",
    vehicleType: "",
  });

  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Check if vehicleNumber and vehicleType are present
      if (vehicle.vehicleNumber && vehicle.vehicleType) {
        const response = await axios.post("/api/addvehicle", {
          vehicleNumber: vehicle.vehicleNumber,
          vehicleType: vehicle.vehicleType,
        });

        console.log("API Response:", response.data);

        toast({
          title: "Vehicle Added Successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      } else {
        throw new Error("Please fill in all fields");
      }
    } catch (error) {
      console.error("API Error:", error);

      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <form onSubmit={handleSubmit}>
        <Flex
          h="80vh"
          alignItems="center"
          justifyContent="center"
          bg={"whit"}
          flexDirection="column"
        >
          <Flex
            flexDirection="column"
            bg={"white"}
            p={12}
            borderRadius={8}
            boxShadow="lg"
          >
            <Heading mb={10} textAlign="center">
              Parking Entry
            </Heading>
            <Input
              placeholder="GJ01BT9999"
              type="string"
              variant="filled"
              mb={12}
              isRequired
              style={{ textTransform: "uppercase" }}
              value={vehicle.vehicleNumber}
              onChange={(event) =>
                setVehicle({
                  ...vehicle,
                  vehicleNumber: event.currentTarget.value,
                })
              }
            />
            <InputGroup mb={6}>
              <RadioGroup
                onChange={(value) =>
                  setVehicle({ ...vehicle, vehicleType: value })
                }
                value={vehicle.vehicleType}
              >
                <Stack direction="row">
                  <Radio value="TWO">2 Wheeler</Radio>
                  <Radio value="THREE">3 Wheeler</Radio>
                  <Radio value="FOUR">4 Wheeler</Radio>
                  <Radio value="BUS">Bus</Radio>
                </Stack>
              </RadioGroup>
            </InputGroup>
            <Button
              type="submit"
              colorScheme="teal"
              mb={8}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress isIndeterminate size="24px" color="teal" />
              ) : (
                "Add Vehicle"
              )}
            </Button>
          </Flex>
        </Flex>
      </form>
    </>
  );
};

export default Home;
