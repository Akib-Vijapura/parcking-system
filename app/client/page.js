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
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Image } from "@chakra-ui/react";
import NavBar from "../components/clientNavBar";

const Home = () => {
  const router = useRouter();
  const formBackground = useColorModeValue("gray.170", "gray.700");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState("");
   const [vehicleType, setVehicleType] = useState("");

  const toast = useToast();
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulating login validation
    // Replace with your actual login logic
    if (vehicleNumber && vehicleType) {
      // Perform the action with vehicleNumber and vehicleType
      toast({
        title: "Vehicle Added Successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } else {
      toast({
        title: "Invalid input",
        description: "Please fill in all fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }

    setIsLoading(false);
  };


  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
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
              value={vehicleNumber}
              onChange={(event) => setVehicleNumber(event.currentTarget.value)}
            />
            <InputGroup mb={6}>
              <RadioGroup onChange={setVehicleType} value={vehicleType}>
                <Stack direction="row">
                  <Radio value="1">2 Wheeler</Radio>
                  <Radio value="2">3 Wheeler</Radio>
                  <Radio value="3">4 Wheeler</Radio>
                  <Radio value="4">Bus</Radio>
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
