import React from "react";
import { Box, Text, Avatar, HStack } from "@chakra-ui/react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

function MessageBubble({ message, isOwnMessage, sender }) {
  return (
    <HStack
      w="100%"
      justify={isOwnMessage ? "flex-end" : "flex-start"}
      align="flex-end"
      spacing={2}
      mb={2}
    >
      {!isOwnMessage && (
        <Avatar
          size="sm"
          name={sender?.username}
          src={sender?.pic}
          aria-label={sender?.username}
        />
      )}

      <MotionBox
        bg={isOwnMessage ? "teal.500" : "gray.700"}
        color="white"
        px={4}
        py={2}
        borderRadius="2xl"
        maxW={["85%", "70%", "60%"]}
        boxShadow="lg"
        wordBreak="break-word"
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        _hover={{
          boxShadow: "0px 4px 12px rgba(0,0,0,0.25)",
        }}
      >
        {/* Sender name for group chats */}
        {!isOwnMessage && message.chat?.isGroupChat && (
          <Text fontSize="xs" fontWeight="semibold" mb={1} color="teal.200">
            {sender?.username}
          </Text>
        )}

        {/* Message content */}
        <Text fontSize="sm" lineHeight="1.4">
          {message.content}
        </Text>

        {/* Timestamp */}
        <Text fontSize="xs" mt={1} textAlign="right" opacity={0.7}>
          {format(new Date(message.createdAt), "hh:mm a")}
        </Text>
      </MotionBox>
    </HStack>
  );
}

export default React.memo(MessageBubble);
