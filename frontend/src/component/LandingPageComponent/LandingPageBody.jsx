import {
  Box,
  Button,
  Stack,
  Text,
  VStack,
  Avatar,
  HStack,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import Typewriter from "typewriter-effect";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

function LandingPageBody() {
  const userData = useSelector((state) => state.userData?.user?.userInfo) || {};

  return (
    <Box
      as="section"
      minH="93.2vh"
      bg="black"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
      px={{ base: 4, md: 12 }}
    >
      <Helmet>
        <title>Messenger App - Connect Anytime, Anywhere</title>
        <meta
          name="description"
          content="Messenger App lets you connect, chat, and share instantly. Fast, secure, and easy-to-use platform for seamless communication."
        />
      </Helmet>

      {/* Background glowing circles */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        w={{ base: "700px", md: "1200px" }}
        h={{ base: "500px", md: "800px" }}
        borderRadius="50%"
        transform="translate(-50%, -50%)"
        bg="radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)"
        filter="blur(160px)"
        animation="float1 12s ease-in-out infinite"
        zIndex={0}
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        w={{ base: "400px", md: "600px" }}
        h={{ base: "400px", md: "600px" }}
        borderRadius="50%"
        transform="translate(-50%, -50%)"
        bg="radial-gradient(circle, rgba(0,255,200,0.08) 0%, transparent 70%)"
        filter="blur(140px)"
        animation="float2 15s ease-in-out infinite"
        zIndex={0}
      />

      {/* Main content in left + right layout */}
      <HStack
        spacing={12}
        align="center"
        justify="space-between"
        zIndex={1}
        w="full"
        maxW="7xl"
      >
        {/* Left Side - Text Content */}
        <VStack
          spacing={{ base: 6, md: 8 }}
          align="flex-start"
          color="white"
          textAlign="left"
          flex="1"
        >
          {/* Title */}
          <Text
            as="h1"
            fontSize={{ base: "3xl", sm: "5xl", md: "6xl", lg: "7xl" }}
            fontWeight="extrabold"
            letterSpacing="tight"
            lineHeight="1.1"
            display="flex"
            alignItems="center"
          >
            <Box as="span" mr={3} role="img" aria-label="waving hand">
              👋
            </Box>
            <Box
              as="span"
              bgGradient="linear(to-r, teal.300, cyan.500)"
              bgClip="text"
            >
              Hi {userData.username || "Guest"}
            </Box>
          </Text>

          {/* Typewriter Text */}
          <Text
            as="h2"
            fontSize={{ base: "md", sm: "lg", md: "2xl", lg: "3xl" }}
            color="gray.300"
            fontWeight="medium"
            minH="40px"
          >
            <Typewriter
              options={{
                strings: [
                  "Connect. Chat. Share. Anytime, Anywhere.",
                  "Where Conversations Come Alive.",
                  "Fast. Secure. Limitless Messaging.",
                  "Your words, your way.",
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 20,
              }}
            />
          </Text>

          {/* Button */}
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={6}
            pt={4}
            w="full"
          >
            <Link to="/chat">
              <Button
                rightIcon={<ArrowForwardIcon />}
                size={{ base: "md", md: "lg" }}
                colorScheme="teal"
                variant="solid"
                aria-label="Start a conversation"
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "0 0 20px rgba(0,255,200,0.5)",
                }}
                transition="all 0.3s ease"
              >
                Start Conversation
              </Button>
            </Link>
          </Stack>
        </VStack>

        {/* Right Side - Profile Picture */}
        <Avatar
          size="2xl"
          name={userData.username}
          src={userData.profilePic || ""}
          border="4px solid teal"
        />
      </HStack>

      {/* Floating Animations */}
      <style>
        {`
          @keyframes float1 {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
            50% { transform: translate(-55%, -45%) scale(1.05); opacity: 1; }
          }
          @keyframes float2 {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
            50% { transform: translate(-45%, -55%) scale(1.02); opacity: 1; }
          }
        `}
      </style>
    </Box>
  );
}

export default LandingPageBody;
