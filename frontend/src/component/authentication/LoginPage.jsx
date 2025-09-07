import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { URL } from "../../../config";

function LoginPage() {
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(`${URL}/api/auth/login`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.status === 200) {
            setLoginSuccess(res.data.success);
            navigate("/");
          }
        })
        .catch((err) => {
          navigate("/signup");
        });
      setFormData({
        email: "",
        password: "",
      });

      setFormData({ email: "", password: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="gray.900"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        bg="gray.800"
        p={10}
        rounded="xl"
        shadow="xl"
        maxW="md"
        w="full"
        color="white"
      >
        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <Heading textAlign="center" size="2xl">
              Login
            </Heading>
            <Text textAlign="center" color="gray.400">
              Enter your credentials to access your account
            </Text>

            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                bg="gray.700"
                border={0}
                value={formData.email}
                focusBorderColor="teal.400"
                onChange={handleChange}
              />
              <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                bg="gray.700"
                border={0}
                value={formData.password}
                onChange={handleChange}
                focusBorderColor="teal.400"
              />
            </FormControl>

            <Button
              type="submit"
              leftIcon={<EmailIcon />}
              colorScheme="teal"
              size="lg"
              fontWeight="bold"
              _hover={{
                transform: "scale(1.05)",
                boxShadow: "0 0 20px teal",
              }}
            >
              Login
            </Button>

            <Text textAlign="center" color="gray.500" fontSize="sm">
              Don't have an account?{" "}
              <Link to="/signup">
                <Text
                  as="span"
                  color="teal.400"
                  fontWeight="bold"
                  cursor="pointer"
                >
                  Sign Up
                </Text>
              </Link>
            </Text>
          </VStack>
        </form>
      </Box>
    </Box>
  );
}

export default LoginPage;
