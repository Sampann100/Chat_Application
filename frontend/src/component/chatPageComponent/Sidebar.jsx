import {
  VStack,
  Flex,
  Text,
  Input,
  HStack,
  Avatar,
  Heading,
  IconButton,
  SkeletonCircle,
  SkeletonText,
  Box,
  Divider,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { SettingsIcon, AddIcon } from "@chakra-ui/icons";
import { URL } from "../../../config";
import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import CreateGroupChat from "./CreateGroupChat";
import { Link } from "react-router-dom";

function Sidebar({
  onSelectChat,
  chatList,
  setChatList,
  selectedChat,
  currentUser,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${URL}/api/user`, {
          withCredentials: true,
        });
        if (res.status === 200)
          setAllUsers(res.data.filter((u) => u._id !== currentUser._id));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
      setLoading(false);
    };
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (!searchQuery) return setSearching(false);
    setSearching(true);

    const handler = setTimeout(() => {
      setSearching(false);
    }, 200);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSearchUser = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelectUser = async (user) => {
    try {
      const { data: chat } = await axios.post(
        `${URL}/api/chat`,
        { otherUserId: user._id },
        { withCredentials: true }
      );

      if (!chatList.find((c) => c._id === chat._id)) {
        setChatList([chat, ...chatList]);
      }
      onSelectChat(chat);
    } catch (err) {
      console.error("Error selecting user:", err);
    }
  };

  const getOtherUser = (chat) => {
    if (!chat || !chat.users || !currentUser) return null;
    if (!chat.isGroupChat)
      return chat.users.find((u) => u._id !== currentUser._id);
    return null;
  };

  const displayedUsers = useMemo(() => {
    if (!searchQuery) return chatList;
    return allUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allUsers, chatList]);

  return (
    <VStack
      w={{ base: "100%", md: "350px" }}
      h="100vh"
      bg="#2D3748"
      borderRight="1px solid"
      borderColor="#3C3C3C"
      p={4}
      spacing={4}
      flexShrink={0}
      overflow="hidden"
    >
      {/* Header */}
      <Flex w="100%" justify="space-between" align="center" mb={2}>
        <Link to="/">
          <Heading size="md" color="white">
            My Chats
          </Heading>
        </Link>
        <HStack>
          <Tooltip label="Create Group Chat" placement="bottom-end" hasArrow>
            <IconButton
              icon={<AddIcon />}
              onClick={onOpen}
              aria-label="Create Group Chat"
              variant="ghost"
              color="white"
              _hover={{ bg: "#4A5568" }}
              transition="all 0.2s ease"
            />
          </Tooltip>
          <CreateGroupChat
            currentUser={currentUser}
            isOpen={isOpen}
            onClose={onClose}
          />
          <Tooltip label="Settings" placement="bottom" hasArrow>
            <IconButton
              icon={<SettingsIcon />}
              aria-label="Settings"
              variant="ghost"
              color="white"
              _hover={{ bg: "#4A5568" }}
            />
          </Tooltip>
        </HStack>
      </Flex>

      {/* Search */}
      <Input
        placeholder="Search users..."
        bg="rgba(255,255,255,0.05)"
        color="white"
        border="1px solid #4F4F4F"
        value={searchQuery}
        onChange={handleSearchUser}
        _placeholder={{ color: "gray.400" }}
        _focus={{ borderColor: "#2B6CB0" }}
      />

      <Divider borderColor="#3C3C3C" />

      {/* Chats / Search Results */}
      <Box w="100%" flex="1" overflowY="auto" css={{ scrollbarWidth: "thin" }}>
        {searching ? (
          <VStack w="100%" spacing={4} align="stretch">
            {Array(5)
              .fill("")
              .map((_, idx) => (
                <Flex key={idx} align="center" p={3}>
                  <SkeletonCircle size="10" mr={3} />
                  <SkeletonText noOfLines={2} spacing="2" flex="1" />
                </Flex>
              ))}
          </VStack>
        ) : (
          displayedUsers.map((item) => {
            const chat = item.users ? item : null;
            const user = chat ? getOtherUser(chat) : item;
            const isActive = chat && selectedChat?._id === chat._id;

            return (
              <Flex
                key={item._id}
                align="center"
                p={3}
                borderRadius="lg"
                cursor="pointer"
                bg={isActive ? "#4A5568" : "transparent"}
                _hover={{ bg: "#3A3F4B" }}
                onClick={() =>
                  chat ? onSelectChat(chat) : handleSelectUser(user)
                }
              >
                <Avatar
                  size="md"
                  src={chat ? (chat.isGroupChat ? "" : user?.pic) : user?.pic}
                  mr={3}
                  border={isActive ? "2px solid #4A90E2" : "none"}
                />
                <VStack spacing={0} align="flex-start" flex="1">
                  <Text fontWeight="semibold" color="white" noOfLines={1}>
                    {chat
                      ? chat.isGroupChat
                        ? chat.chatName
                        : user?.username
                      : user?.username}
                  </Text>
                  <Text fontSize="sm" color="gray.400" noOfLines={1}>
                    {chat ? "Last message preview..." : user?.email}
                  </Text>
                </VStack>
                {chat && (
                  <Text fontSize="xs" color="gray.500">
                    {chat.updatedAt
                      ? new Date(chat.updatedAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : ""}
                  </Text>
                )}
              </Flex>
            );
          })
        )}
      </Box>
    </VStack>
  );
}

export default Sidebar;
