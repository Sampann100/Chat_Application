import { useEffect, useRef, useState } from "react";
import {
  Flex,
  Text,
  VStack,
  HStack,
  Avatar,
  Spacer,
  Heading,
  IconButton,
  Input,
  Box,
} from "@chakra-ui/react";
import { messengerActions } from "../../../store/messager";
import { ArrowLeftIcon, SearchIcon, AttachmentIcon } from "@chakra-ui/icons";
import { FaPhone, FaVideo, FaPaperPlane, FaSmile } from "react-icons/fa";
import axios from "axios";
import { URL } from "../../../config";
import MessageBubble from "./MessageBubble";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../socket";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

function ChatWindow({ isMobile, onBack, selectedChat, currentUser }) {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.messenger);
  const currentUserId = currentUser?._id || currentUser?.id;

  const [sendMessage, setSendMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const scrollRef = useRef();

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

  // --- Connect to Socket.IO and join room ---
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server with id:", socket.id);
    });

    if (selectedChat) {
      socket.emit("join-room", selectedChat._id);
    }

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [selectedChat]);

  //Listen for incoming message
  useEffect(() => {
    socket.on("receive-message", (data) => {
      dispatch(messengerActions.addNewMessage(data.message));
    });

    return () => {
      socket.off("receive-message");
    };
  }, [dispatch]);

  // Fetch old messages on chat change
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      try {
        const res = await axios.get(`${URL}/api/message/${selectedChat._id}`, {
          withCredentials: true,
        });
        if (res.status === 200) {
          dispatch(messengerActions.setMessages(res.data));
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [selectedChat, dispatch]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [message.messages]);

  if (!selectedChat) {
    return (
      <Flex flex="1" align="center" justify="center" bg="#1A202C">
        <Text color="gray.500">Select a chat to start messaging</Text>
      </Flex>
    );
  }

  const otherUser = selectedChat.users.find((u) => u._id !== currentUserId);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!sendMessage.trim()) return;

    try {
      const messageData = {
        senderMessage: sendMessage,
        selectedChatRoom: selectedChat._id,
      };

      socket.emit("send-message", messageData);
      setSendMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <Flex flex="1" direction="column" bg="#1A202C">
      {/* Header */}
      <Flex
        p={4}
        bg="#2D3748"
        borderBottom="1px solid #3C3C3C"
        align="center"
        position="sticky"
        top={0}
        zIndex={10}
        shadow="sm"
      >
        {isMobile && (
          <IconButton
            icon={<ArrowLeftIcon />}
            size="sm"
            mr={3}
            aria-label="Back"
            variant="ghost"
            color="white"
            _hover={{ bg: "#4A5568" }}
            onClick={onBack}
          />
        )}

        <Avatar
          mr={3}
          size="md"
          src={selectedChat.isGroupChat ? "" : otherUser?.pic}
          name={
            selectedChat.isGroupChat
              ? selectedChat.chatName
              : otherUser?.username
          }
        />

        <VStack align="flex-start" spacing={0}>
          <Heading size="sm" color="white">
            {selectedChat.isGroupChat
              ? selectedChat.chatName
              : otherUser?.username}
          </Heading>
          <Text fontSize="xs" color="green.400">
            {selectedChat.isGroupChat
              ? `${selectedChat.users.length} members`
              : "Online"}
          </Text>
        </VStack>

        <Spacer />

        <HStack spacing={2}>
          <IconButton
            icon={<FaPhone />}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: "#4A5568" }}
          />
          <IconButton
            icon={<FaVideo />}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: "#4A5568" }}
          />
          <IconButton
            icon={<SearchIcon />}
            size="sm"
            variant="ghost"
            color="white"
            _hover={{ bg: "#4A5568" }}
          />
        </HStack>
      </Flex>

      {/* Messages */}
      <VStack
        flex="1"
        p={4}
        spacing={3}
        align="stretch"
        overflowY="auto"
        ref={scrollRef}
        css={{
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": {
            background: "#4A5568",
            borderRadius: "8px",
          },
        }}
      >
        {message.messages && message.messages.length > 0 ? (
          message.messages.map((msg, index) => {
            const senderId =
              typeof msg.sender === "string" ? msg.sender : msg.sender?._id;
            const senderObj =
              typeof msg.sender === "string" ? null : msg.sender;

            const nextMsg = message.messages[index + 1];
            const showAvatar =
              !nextMsg || (nextMsg.sender?._id || nextMsg.sender) !== senderId;

            return (
              <MessageBubble
                key={msg._id}
                message={msg}
                sender={senderObj}
                isOwnMessage={senderId === currentUserId}
                showAvatar={showAvatar}
              />
            );
          })
        ) : (
          <Text color="gray.400" align="center" fontSize="sm">
            No messages yet. Start the conversation!
          </Text>
        )}
      </VStack>

      {/* Input */}
      <Box
        p={3}
        bg="#2D3748"
        borderTop="1px solid #3C3C3C"
        position="sticky"
        bottom={0}
        zIndex={10}
      >
        <HStack spacing={3}>
          <IconButton
            icon={<AttachmentIcon />}
            aria-label="Attach File"
            variant="ghost"
            color="white"
            _hover={{ bg: "#4A5568" }}
          />
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
          <Input
            placeholder="Type a message..."
            bg="#2D3748"
            color="white"
            border="1px solid #4F4F4F"
            icon={<FaSmile color="white" />}
            borderRadius="full"
            value={sendMessage}
            onChange={(e) => setSendMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && sendMessage.trim() !== "")
                handleSendMessage(e);
            }}
            px={4}
            size="sm"
            _placeholder={{ color: "gray.400" }}
            _focus={{ borderColor: "#2B6CB0" }}
          />
          <IconButton
            colorScheme="blue"
            borderRadius="full"
            aria-label="Send message"
            icon={<FaPaperPlane />}
            size="md"
            onClick={(e) => handleSendMessage(e)}
          />

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
                  setSendMessage((prev) => prev + emoji.native)
                }
                theme="dark"
              />
            </div>
          )}
        </HStack>
      </Box>
    </Flex>
  );
}

export default ChatWindow;
