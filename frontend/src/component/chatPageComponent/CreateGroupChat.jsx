import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  VStack,
  Input,
  IconButton,
  InputGroup,
  InputRightElement,
  Tag,
  TagLabel,
  TagCloseButton,
  Box,
  HStack,
  Avatar,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState, useRef, useEffect, useCallback } from "react";
import { FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import axios from "axios";
import { URL } from "../../../config";
import { useDispatch, useSelector } from "react-redux";
import { allUserActions } from "../../../store/allUser";

function CreateGroupChat({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const allUsers = useSelector((state) => state.allUser);

  const [groupName, setGroupName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);

  const pickerRef = useRef(null);

  // Close emoji picker on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch all users once
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${URL}/api/user`, {
          withCredentials: true,
        });
        dispatch(allUserActions.setAllUsers(data));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [dispatch]);

  // Search users (debounced)
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      const filtered = allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, allUsers]);

  const handleAddUser = useCallback(
    (user) => {
      if (!selectedUsers.find((u) => u._id === user._id)) {
        setSelectedUsers((prev) => [...prev, user]);
      }
      setSearchResults([]);
      setSearchTerm("");
    },
    [selectedUsers]
  );

  const handleRemoveUser = useCallback((id) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== id));
  }, []);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length < 2) {
      toast({
        title: "Invalid group",
        description: "Group name and at least 2 members are required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const { data } = await axios.post(
        `${URL}/api/chat/create-group`,
        { groupName, selectedUsers },
        { withCredentials: true }
      );

      toast({
        title: "Group Created",
        description: `Group "${data.chatName}" created successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setGroupName("");
      setSelectedUsers([]);
      setSearchTerm("");
      setSearchResults([]);
      onClose();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to create group",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose} motionPreset="scale">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
      <ModalContent bg="#2D3748" color="white" borderRadius="md" maxW="400px">
        <ModalHeader>Create Group Chat</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <VStack spacing={4} align="stretch" position="relative">
            {/* Group Name Input */}
            <InputGroup>
              <Input
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                bg="rgba(255,255,255,0.1)"
                _placeholder={{ color: "gray.400" }}
                _focus={{ borderColor: "#4A90E2" }}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Emoji"
                  bg="transparent"
                  icon={<FaSmile color="white" />}
                  size="sm"
                  _hover={{ bg: "transparent" }}
                  _active={{ bg: "transparent" }}
                  _focus={{ boxShadow: "none" }}
                  onClick={() => setShowEmoji((prev) => !prev)}
                />
              </InputRightElement>
            </InputGroup>

            {showEmoji && (
              <div
                ref={pickerRef}
                style={{
                  position: "absolute",
                  bottom: "60px",
                  left: "10px",
                  zIndex: 1000,
                }}
              >
                <Picker
                  data={data}
                  onEmojiSelect={(emoji) =>
                    setGroupName((prev) => prev + emoji.native)
                  }
                  theme="dark"
                />
              </div>
            )}

            {/* Search Users */}
            <Input
              placeholder="Search Users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="rgba(255,255,255,0.1)"
              _placeholder={{ color: "gray.400" }}
              _focus={{ borderColor: "#4A90E2" }}
            />

            {/* Selected Users */}
            <Box display="flex" flexWrap="wrap" gap={2}>
              {selectedUsers.map((user) => (
                <Tag
                  key={user._id}
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                >
                  <TagLabel>{user.username}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveUser(user._id)} />
                </Tag>
              ))}
            </Box>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Box
                bg="gray.700"
                p={2}
                borderRadius="md"
                maxH="150px"
                overflowY="auto"
              >
                {searchResults.map((user) => {
                  const alreadySelected = selectedUsers.some(
                    (u) => u._id === user._id
                  );
                  return (
                    <Box
                      key={user._id}
                      p={2}
                      borderRadius="md"
                      _hover={{
                        bg: alreadySelected ? "gray.700" : "gray.600",
                        cursor: alreadySelected ? "not-allowed" : "pointer",
                      }}
                      color={alreadySelected ? "gray.400" : "white"}
                      onClick={() => !alreadySelected && handleAddUser(user)}
                    >
                      <HStack spacing={3}>
                        <Avatar size="sm" name={user.username} src={user.pic} />
                        <Text fontWeight="medium">{user.username}</Text>
                      </HStack>
                    </Box>
                  );
                })}
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            variant="ghost"
            color="white"
            onClick={handleCreateGroup}
            isDisabled={!groupName.trim() || selectedUsers.length < 2}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CreateGroupChat;
