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
import { Radio, RadioGroup, Stack } from '@chakra-ui/react'
import {useRouter} from "next/navigation";
import { Image } from '@chakra-ui/react'
import NavBar from "../components/clientNavBar";

const Home = () => {
  const router = useRouter();
  const formBackground = useColorModeValue("gray.170", "gray.700");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState("");

  const toast = useToast();
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulating login validation
    // Replace with your actual login logic
    if (email === "admin@gmail.com" && password === "admin1234") {
      toast({
        title: "Login Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
      // Redirect to /admin after successful login
      router.push("/admin");
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please login with true credentials",
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
      <Flex h="100vh" alignItems="center" justifyContent="center" bg={"whit"} flexDirection="column">
        <Flex
          flexDirection="column"
          bg={"white"}
          p={12}
          borderRadius={8}
          //boxShadow="lg"
        >
          <Heading mb={6} textAlign="center">
            Parking Entry
          </Heading>
          <Input
            placeholder="GJ01BT9999"
            type="string"
            variant="filled"
            mb={3}
            isRequired
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <InputGroup mb={6}>
          <RadioGroup onChange={setValue} value={value}>
      <Stack direction='row'>
        <Radio value='1'>Four Wheeler</Radio>
        <Radio value='2'>Three Wheeler</Radio>
        <Radio value='3'>Two Wheeler</Radio>
        <Radio value='4'>Bus</Radio>
      </Stack>
    </RadioGroup>
          </InputGroup>
          <Button type="submit" colorScheme="teal" mb={8} disabled={isLoading}>
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
