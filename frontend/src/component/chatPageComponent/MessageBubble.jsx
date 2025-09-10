import React from "react";
import { Box, Text, Avatar, VStack, Flex } from "@chakra-ui/react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const MotionBox = motion.create(Box);

function MessageBubble({ message, isOwnMessage, sender, showAvatar }) {
  return (
    <Flex
      w="100%"
      justify={isOwnMessage ? "flex-end" : "flex-start"}
      mb={showAvatar ? 3 : 1}
    >
      <Flex
        maxW="80%"
        flexDir={isOwnMessage ? "row-reverse" : "row"}
        align="flex-end"
        gap={2}
      >

        {!isOwnMessage && showAvatar && (
          <Avatar
            size="sm"
            name={sender?.username}
            src={sender?.pic}
            aria-label={sender?.username}
          />
        )}

        <VStack align={isOwnMessage ? "flex-end" : "flex-start"} spacing={1}>
          {/* Show sender name only in group chat (and only once per sequence) */}
          {!isOwnMessage && showAvatar && message.chat?.isGroupChat && (
            <Text fontSize="xs" fontWeight="semibold" color="teal.400">
              {sender?.username}
            </Text>
          )}

          {/* Message bubble */}
          <MotionBox
            bg={isOwnMessage ? "teal.500" : "gray.700"}
            color="white"
            px={4}
            py={2}
            borderRadius="xl"
            boxShadow="md"
            wordBreak="break-word"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Text fontSize="sm" lineHeight="1.5">
              {message.content}
            </Text>
          </MotionBox>

          {/* Timestamp */}
          {showAvatar && (
            <Text
              fontSize="xs"
              opacity={0.6}
              textAlign={isOwnMessage ? "right" : "left"}
            >
              {format(new Date(message.createdAt), "hh:mm a")}
            </Text>
          )}
        </VStack>
      </Flex>
    </Flex>
  );
}

export default React.memo(MessageBubble);
