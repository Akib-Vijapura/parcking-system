// Sidebar.jsx
"use client";
import {
  Avatar,
  Divider,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  FiMenu,
  FiHome,
  FiUser,
  FiShoppingCart,
  FiDollarSign,
  FiBriefcase,
  FiSettings,
} from "react-icons/fi";
import { IoCarOutline } from "react-icons/io5";
import NavItem from "./NavItem";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const [navSize, setNavSize] = useState("large");
  const [activeItem, setActiveItem] = useState("Dashboard");
  const router = useRouter();

  useEffect(() => {
    // Get the active tab from localStorage
    const storedActiveItem = localStorage.getItem("activeTab");
    if (storedActiveItem) {
      setActiveItem(storedActiveItem);
      // tabChangeHandler(storedActiveItem);
    }
  }, []);

  const handleItemClick = (title) => {
    console.log("onclick handler = ", title);
    setActiveItem(title);
    // tabChangeHandler(title);
    localStorage.setItem("activeTab", title);

    if (title === "Dashboard") {
      router.push(`/admin`);
    } else if (title === "Vehicles") {
      router.push(`/admin/vehicles`);
    } else if (title === "vehiclepricing") {
      router.push(`/admin/vehiclepricing`);
    }
  };

  return (
    <Flex
      position="sticky"
      left="5"
      h="95vh"
      marginTop="2.5vh"
      boxShadow="0 4px 12px 0 rgba(0,0,0,0.09)"
      w={navSize === "small" ? "75px" : "250px"}
      flexDir="column"
      justifyContent="space-between"
      borderRadius={navSize === "small" ? "15px" : "30px"}
    >
      <Flex
        p="5%"
        flexDir="column"
        alignItems={navSize === "small" ? "center" : "flex-start"}
        as="nav"
      >
        <IconButton
          background="none"
          mt={5}
          _hover={{ background: "none" }}
          icon={<FiMenu />}
          onClick={() => {
            if (navSize === "small") {
              setNavSize("large");
            } else {
              setNavSize("small");
            }
          }}
        />

        <NavItem
          navSize={navSize}
          icon={FiHome}
          title="Dashboard"
          active={activeItem === "Dashboard"}
          onClick={() => handleItemClick("Dashboard")}
        />
        <NavItem
          navSize={navSize}
          icon={FiHome}
          title="Vehicles"
          active={activeItem === "Vehicles"}
          onClick={() => handleItemClick("Vehicles")}
        />
        <NavItem
          navSize={navSize}
          icon={IoCarOutline}
          title="Vehicle Pricing"
          active={activeItem === "vehiclepricing"}
          onClick={() => handleItemClick("vehiclepricing")}
        />
        <NavItem
          navSize={navSize}
          icon={FiUser}
          title="Client"
          active={activeItem === "Client"}
          onClick={() => handleItemClick("Client")}
        />
        <NavItem
          navSize={navSize}
          icon={FiShoppingCart}
          title="Orders"
          active={activeItem === "Orders"}
          onClick={() => handleItemClick("Orders")}
        />
        <NavItem
          navSize={navSize}
          icon={FiDollarSign}
          title="Profit"
          active={activeItem === "Profit"}
          onClick={() => handleItemClick("Profit")}
        />
        <NavItem
          navSize={navSize}
          icon={FiBriefcase}
          title="Reports"
          active={activeItem === "Reports"}
          onClick={() => handleItemClick("Reports")}
        />
        <NavItem
          navSize={navSize}
          icon={FiSettings}
          title="Settings"
          active={activeItem === "Settings"}
          onClick={() => handleItemClick("Settings")}
        />
      </Flex>

      <Flex
        p="5%"
        flexDir="column"
        w="100%"
        alignItems={navSize === "small" ? "center" : "flex-start"}
        mb="4"
      >
        <Divider display={navSize === "small" ? "none" : "flex"} />
        <Flex mt={4} align="center">
          <Avatar size="sm" />
          <Flex
            flexDir="column"
            ml={4}
            display={navSize === "small" ? "none" : "flex"}
          >
            <Heading as="h3" size="sm">
              Demo User
            </Heading>
            <Text color="gray">Admin</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
