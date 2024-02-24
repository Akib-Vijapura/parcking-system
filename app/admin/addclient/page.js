"use client";
import React, { useState, useEffect } from "react";
import {
  Flex,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Grid,
  Box,
  Text,
  IconButton,
  useToast,
  Spinner,
  Select,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import Sidebar from "@/app/components/Sidebar";
import axios from "axios";

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [windowNo, setWindowNo] = useState("");
  const [users, setUsers] = useState([]);
  const [showEditConfirmation, setShowEditConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedUserIndex, setSelectedUserIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usedWindowNumbers, setUsedWindowNumbers] = useState([]);
  const [availableWindowNumbers, setAvailableWindowNumbers] = useState([]);
  const toast = useToast();

  const getUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/user/getusers");
      setUsers(res.data.users);
    } catch (error) {
      toast({
        title: "Failed to fetch users",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (users.length === 0) {
      getUsers();
    }
  }, [users]);

  useEffect(() => {
    const usedNumbers = users.map((user) => user.windowNo);
    setUsedWindowNumbers(usedNumbers);
  }, [users]);

  useEffect(() => {
    const allWindowNumbers = [1, 2, 3, 4, 5, 6];

    const availableNumbers = allWindowNumbers.filter(
      (number) => !usedWindowNumbers.includes(number)
    );
    setAvailableWindowNumbers(availableNumbers);
  }, [usedWindowNumbers]);
  console.log(usedWindowNumbers);

  const handleSubmit = async () => {
    try {
      if (editingIndex !== null) {
        const updatedUsers = [...users];
        updatedUsers[editingIndex] = { username, password, windowNo };
        setUsers(updatedUsers);
        await axios.put(`/api/user/${users[editingIndex]._id}`, {
          username,
          password,
          windowNo,
        });
        toast({
          title: "User updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
        setEditingIndex(null);
      } else {
        const newUserDetails = { username, password, windowNo };
        const res = await axios.post("/api/signup", newUserDetails);

        if (res.status === 200) {
          const newUser = res.data.savedUser;
          setUsers([...users, newUser]);
          toast({
            title: "User added successfully",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom-right",
          });
        }
      }

      setIsOpen(false);
      setUsername("");
      setPassword("");
      setWindowNo("");
    } catch (error) {
      if (error.response.status === 400) {
        toast({
          title: "User already exists",
          description: "Please try with different username",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      } else {
        toast({
          title: "Operation failed",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-right",
        });
      }
    }
  };

  const handleEdit = (index) => {
    setSelectedUserIndex(index);
    setShowEditConfirmation(true);
  };

  const handleConfirmEdit = () => {
    setShowEditConfirmation(false);
    setIsEditOpen(true);
    setUsername(users[selectedUserIndex].username);
    setPassword(users[selectedUserIndex].password);
    setWindowNo(users[selectedUserIndex].windowNo);
    setEditingIndex(selectedUserIndex);
    setIsOpen(true);
  };

  const handleDelete = async (index) => {
    setSelectedUserIndex(index);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log("selected user = ", users[selectedUserIndex]);
      console.log("id = ", users[selectedUserIndex]._id);
      await axios.delete(`/api/user/${users[selectedUserIndex]._id}`);
      const updatedUsers = [...users];
      updatedUsers.splice(selectedUserIndex, 1);
      setUsers(updatedUsers);
      toast({
        title: "User deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    } catch (error) {
      toast({
        title: "Failed to delete user",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-right",
      });
    }
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      {loading && (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Spinner color="teal" size="xl" />
        </Flex>
      )}
      {!loading && (
        <Flex alignItems="center" p={4}>
          <Sidebar />
          <Flex direction="column" flex="1" ml={20} mr={20}>
            <Button
              onClick={() => setIsOpen(true)}
              leftIcon={<AddIcon />}
              colorScheme="teal"
              mb={4}
            >
              Add User
            </Button>
            <Grid
              templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
              gap={4}
            >
              {users.map((user, index) => (
                <Box
                  key={index}
                  p={4}
                  shadow="md"
                  borderWidth="1px"
                  borderRadius="md"
                  bg="white"
                  _hover={{ boxShadow: "lg" }}
                >
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Text fontSize="xl" fontWeight="bold" color="teal.500">
                      User {index + 1} {user.isAdmin && " (Admin)"}
                    </Text>
                    <Flex>
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        colorScheme="blue"
                        size="sm"
                        onClick={() => handleEdit(index)}
                        mr={2}
                        variant="ghost"
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(index)}
                        variant="ghost"
                      />
                    </Flex>
                  </Flex>
                  <Text>
                    <strong>Username:</strong> {user.username}
                  </Text>
                  <Text>{/*<strong>Password:</strong> {user.password} */}</Text>
                  <Text>
                    <strong>Window Number:</strong> {user.windowNo}
                  </Text>
                </Box>
              ))}
            </Grid>
          </Flex>
        </Flex>
      )}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditOpen ? "Edit Client" : "Add Client"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                // value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Window Number</FormLabel>
              <Select
                placeholder="Select option"
                value={windowNo}
                onChange={(e) => setWindowNo(e.target.value)}
              >
                {availableWindowNumbers.map((number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSubmit}>
              {isEditOpen ? "Update" : "Add"}
            </Button>
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={showEditConfirmation}
        onClose={() => setShowEditConfirmation(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalBody>Are you sure you want to edit this user?</ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleConfirmEdit}>
              Yes
            </Button>
            <Button onClick={() => setShowEditConfirmation(false)}>No</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmation</ModalHeader>
          <ModalBody>Are you sure you want to delete this user?</ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleConfirmDelete}>
              Yes
            </Button>
            <Button onClick={() => setShowDeleteConfirmation(false)}>No</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Page;
