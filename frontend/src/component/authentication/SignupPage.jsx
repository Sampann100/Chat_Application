import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Heading,
  VStack,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { URL } from "../../../config";
import { Link, useNavigate } from "react-router-dom";

function SignupPage() {
  const navigate = useNavigate();
  const [picLoading, setPicLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
    pic: "",
  });

  // Upload profile photo to Cloudinary
  const postDetail = async (pic) => {
    setPicLoading(true);
    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dhjcybp9o");
      fetch("https://api.cloudinary.com/v1_1/dhjcybp9o/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            pic: data.url.toString(),
          }));
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Please select image");
      setPicLoading(false);
      return;
    }
  };

  const handleOnChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      setMessage("Please enter username & email first");
      return;
    }
    try {
      await axios
        .post(`${URL}/api/auth/send-otp`, {
          email: formData.email,
        })
        .then((res) => {
          if (res.status === 201) {
            setOtpSent(true);
            setMessage("OTP sent to your email");
          }
        });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.otp) {
      setMessage("Enter OTP first");
      return;
    }
    try {
      await axios.post(`${URL}/api/auth/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });
      setOtpVerified(true);
      setMessage("OTP Verified! Now complete your signup.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid OTP");
    }
  };

  // Final Signup Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      await axios.post(`${URL}/api/auth/signup`, formData, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box
        h="100vh"
        w="100%"
        bgGradient="linear(to-r, gray.900, black)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          bg="gray.800"
          p={7}
          rounded="2xl"
          shadow="2xl"
          w={{ base: "90%", sm: "400px" }}
        >
          <VStack spacing={3} align="stretch">
            <Heading textAlign="center" color="white">
              Create an Account
            </Heading>

            {message && (
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                {message}
              </Alert>
            )}

            {/* Username */}
            <FormControl>
              <FormLabel color="gray.200">Username</FormLabel>
              <Input
                type="text"
                name="username"
                placeholder="Enter your username....."
                bg="gray.700"
                color="gray.200"
                border="none"
                value={formData.username}
                _focus={{ bg: "gray.600" }}
                onChange={handleOnChange}
              />
            </FormControl>

            {/* Email */}
            <FormControl>
              <FormLabel color="gray.200">Email address</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email....."
                bg="gray.700"
                color="gray.200"
                border="none"
                value={formData.email}
                _focus={{ bg: "gray.600" }}
                onChange={handleOnChange}
                isReadOnly={otpVerified || otpSent}
              />
              <FormHelperText color="gray.400">
                We'll never share your email.
              </FormHelperText>
            </FormControl>

            {/* Send OTP */}
            {!otpSent && (
              <Button colorScheme="blue" onClick={handleSendOtp}>
                Send OTP
              </Button>
            )}

            {/* OTP Input */}
            {otpSent && !otpVerified && (
              <>
                <FormControl>
                  <FormLabel color="gray.200">Enter OTP</FormLabel>
                  <Input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP sent to your email"
                    bg="gray.700"
                    color="gray.200"
                    border="none"
                    value={formData.otp}
                    _focus={{ bg: "gray.600" }}
                    onChange={handleOnChange}
                  />
                </FormControl>
                <Button colorScheme="green" onClick={handleVerifyOtp}>
                  Verify OTP
                </Button>
              </>
            )}

            {/* Password fields enabled only after OTP Verified */}
            {otpVerified && (
              <>
                <FormControl>
                  <FormLabel color="gray.200">Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    bg="gray.700"
                    border="none"
                    value={formData.password}
                    color="gray.200"
                    _focus={{ bg: "gray.600" }}
                    onChange={handleOnChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.200">Confirm Password</FormLabel>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    bg="gray.700"
                    border="none"
                    value={formData.confirmPassword}
                    color="gray.200"
                    _focus={{ bg: "gray.600" }}
                    onChange={handleOnChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel color="gray.200">Photo</FormLabel>
                  <Input
                    type="file"
                    name="pic"
                    p={1.5}
                    accept="image/*"
                    bg="gray.700"
                    color={formData.pic ? "gray.200" : "white"}
                    border="none"
                    _focus={{ bg: "gray.600" }}
                    onChange={(e) => postDetail(e.target.files[0])}
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  mt={4}
                  isLoading={picLoading}
                  _hover={{
                    transform: "scale(1.05)",
                    boxShadow: "0 0 20px teal",
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}

            <Text textAlign="center" color="gray.400" fontSize="sm">
              Already have an account?{" "}
              <Link color="blue.400" to="/login">
                Log in
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>
    </form>
  );
}

export default SignupPage;
