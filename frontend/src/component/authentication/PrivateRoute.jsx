import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { Stack, Skeleton, Box, SkeletonCircle, Flex } from "@chakra-ui/react";

function PrivateRoute({ children }) {
  const { user, loading } = useSelector((state) => state.userData);
  const [toastShown, setToastShown] = useState(false);

  useEffect(() => {
    if (!loading && !user && !toastShown) {
      toast.error("Please login to continue 🚀");
      setToastShown(true);
    }
  }, [loading, user, toastShown]);

  if (loading) {
    return (
      <Flex h="100vh" bg="black" color="white">
        <Box w="300px" borderRight="1px solid #333" p={4}>
          <Skeleton
            height="40px"
            mb={4}
            rounded="md"
            startColor="gray.700"
            endColor="gray.500"
          />

          <Stack spacing={4}>
            {[...Array(6)].map((_, i) => (
              <Flex key={i} align="center" gap={3}>
                <SkeletonCircle
                  size="10"
                  startColor="gray.600"
                  endColor="gray.400"
                />
                <Stack flex="1" spacing={2}>
                  <Skeleton
                    height="15px"
                    width="80%"
                    startColor="gray.700"
                    endColor="gray.500"
                  />
                  <Skeleton
                    height="12px"
                    width="60%"
                    startColor="gray.700"
                    endColor="gray.500"
                  />
                </Stack>
              </Flex>
            ))}
          </Stack>
        </Box>

        <Flex direction="column" flex="1" p={4}>
          <Flex align="center" gap={3} mb={4}>
            <SkeletonCircle
              size="12"
              startColor="gray.600"
              endColor="gray.400"
            />
            <Skeleton
              height="20px"
              width="150px"
              startColor="gray.700"
              endColor="gray.500"
            />
          </Flex>

          <Stack spacing={4} flex="1" overflowY="auto">
            <Flex>
              <Skeleton
                height="20px"
                width="200px"
                rounded="lg"
                startColor="gray.700"
                endColor="gray.500"
              />
            </Flex>

            <Flex justify="flex-end">
              <Skeleton
                height="20px"
                width="180px"
                rounded="lg"
                startColor="gray.600"
                endColor="gray.400"
              />
            </Flex>

            <Flex>
              <Skeleton
                height="20px"
                width="250px"
                rounded="lg"
                startColor="gray.700"
                endColor="gray.500"
              />
            </Flex>

            <Flex justify="flex-end">
              <Skeleton
                height="20px"
                width="220px"
                rounded="lg"
                startColor="gray.600"
                endColor="gray.400"
              />
            </Flex>
          </Stack>

          <Box mt={4}>
            <Skeleton
              height="45px"
              rounded="md"
              startColor="gray.700"
              endColor="gray.500"
            />
          </Box>
        </Flex>
      </Flex>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
