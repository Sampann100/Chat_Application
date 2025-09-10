import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  Text,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Collapse,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, EmailIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { URL } from "../../../config";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userDataActions } from "../../../store/userDataSlice";

const Links = ["Home", "About", "Services", "Contact", "Portfolio"];

const NavLink = ({ children, asLink, to, onClick }) => (
  <Button
    as={asLink || "a"}
    to={to}
    onClick={onClick}
    variant="ghost"
    size="sm"
    cursor="pointer"
    px={4}
    fontWeight="semibold"
    color="whiteAlpha.900"
    _hover={{
      bg: "whiteAlpha.200",
      transform: "scale(1.05)",
      transition: "all 0.2s",
    }}
  >
    {children}
  </Button>
);

export default function Navbar() {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user, success } = useSelector((state) => state.userData);
  const isLoggedIn = success;

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(userDataActions.removeUserData());
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box bg="black" px={6} shadow="md" position="sticky" top={0} zIndex={50}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo */}
        <Text
          fontSize="2xl"
          fontWeight="bold"
          letterSpacing="wider"
          color="white"
        >
          <i>Messenger</i>
        </Text>

        {/* Desktop Nav Links */}
        <HStack
          spacing={6}
          alignItems="center"
          display={{ base: "none", md: "flex" }}
        >
          {Links.map((link) => (
            <NavLink key={link}>{link}</NavLink>
          ))}
        </HStack>

        {/* Right Side - Auth */}
        {!isLoggedIn ? (
          <Stack
            direction="row"
            spacing={4}
            display={{ base: "none", md: "flex" }}
          >
            <Link to="/login">
              <Button
                leftIcon={<EmailIcon />}
                colorScheme="teal"
                size="sm"
                fontWeight="semibold"
              >
                Login with Email
              </Button>
            </Link>
          </Stack>
        ) : (
          <Menu>
            <MenuButton
              as={Button}
              p={0}
              bg="transparent"
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
            >
              <Avatar size="md" src={user?.pic} />
            </MenuButton>
            <MenuList bg="black" borderColor="gray.700" rounded="lg" py={2}>
              <MenuItem
                fontSize="sm"
                bg="transparent"
                color="whiteAlpha.900"
                _hover={{ bg: "gray.800" }}
              >
                Profile
              </MenuItem>
              <MenuItem
                fontSize="sm"
                bg="transparent"
                color="whiteAlpha.900"
                _hover={{ bg: "gray.800" }}
              >
                Settings
              </MenuItem>
              <MenuDivider borderColor="gray.600" />
              <MenuItem
                onClick={handleLogout}
                fontSize="sm"
                bg="transparent"
                color="red.300"
                _hover={{ bg: "gray.800" }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        )}

        {/* Mobile Hamburger */}
        <IconButton
          size="md"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label="Toggle Menu"
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
          color="white"
          bg="blackAlpha.700"
          _hover={{ bg: "blackAlpha.600" }}
        />
      </Flex>

      {/* Mobile Menu */}
      <Collapse in={isOpen} animateOpacity>
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" spacing={3} textAlign="center">
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
            {!isLoggedIn ? (
              <NavLink asLink={Link} to="/login">
                Login
              </NavLink>
            ) : (
              <>
                <NavLink>Profile</NavLink>
                <NavLink>Settings</NavLink>
                <NavLink onClick={handleLogout}>Logout</NavLink>
              </>
            )}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}
