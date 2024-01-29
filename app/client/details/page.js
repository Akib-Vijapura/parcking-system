// Import necessary modules
"use client";
import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import NavBar from "@/app/components/clientNavBar";
import {
  Box,
  Button,
  Center,
  Heading,
  HStack,
  Image,
  Tag,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

// Define the component to be printed
const PrintComponent = React.forwardRef((props, ref) => {
  return (
    <>
      <Box
        ref={ref}
        id="printMe"
        maxW="420px"
        bg="white"
        p="6"
        boxShadow="lg"
        borderRadius={6}
      >
        <Image src="/logo.png" width={100} />
        <HStack mt="5" spacing="3">
          {["Car", "Nature"].map((item) => (
            <Tag key={item} variant="outline">
              {item}
            </Tag>
          ))}
        </HStack>
        <Heading my="4" size="lg">
          Svartifoss Waterfall
        </Heading>
        <Text>
          Svartifoss is a waterfall in Skaftafell in Vatnajökull National Park
          in Iceland, and is one of the most popular sights in the park. It is
          surrounded by dark lava columns, which gave rise to its name. The base
          of this waterfall is noteworthy for its sharp rocks.
        </Text>
      </Box>
    </>
  );
});

// Define the main Details component
const Details = () => {
  const router = useRouter();
  const componentRef = useRef();

  const addVehicleHandler = () => {
    router.push("/client");
  };

  return (
    <>
      <NavBar />
      <Center as="section" h="70vh">
        {/* PrintComponent instance with ref to get the component reference */}
        <PrintComponent ref={componentRef} />
      </Center>
      <Center>
        {/* Centered buttons */}
        <Button onClick={addVehicleHandler} mr={4} mb={10} colorScheme="teal">
          Add new vehicle
        </Button>
        {/* ReactToPrint component for handling printing */}
        <ReactToPrint
          trigger={() => (
            <Button mb={10} colorScheme="green">
              Print Ticket
            </Button>
          )}
          content={() => componentRef.current}
        />
      </Center>
    </>
  );
};

export default Details;
