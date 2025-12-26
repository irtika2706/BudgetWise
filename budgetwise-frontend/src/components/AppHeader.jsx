// AppHeader.jsx - FINAL (DOM nesting fixed)
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionButton = motion(Button);

export default function AppHeader({ isAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isProfile = location.pathname === "/profile";
  const isDashboard = location.pathname === "/dashboard";

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <MotionBox
      bg="white"
      px={{ base: 4, md: 8 }}
      py={4}
      borderBottom="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex="banner"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Flex align="center" justify="space-between" maxW="1400px" mx="auto">
        {/* Logo */}
        <MotionBox
          whileHover={{ scale: 1.05 }}
          cursor="pointer"
          onClick={() => navigate("/dashboard")}
        >
          <Text
            fontSize={{ base: "2xl", md: "2.5xl" }}
            fontWeight="extrabold"
            bgGradient="linear(to-r, teal.500, cyan.500)"
            bgClip="text"
            letterSpacing="tight"
          >
            BudgetWise
          </Text>
        </MotionBox>

        {isAuthenticated && (
          <Flex align="center" gap={{ base: 4, md: 8 }}>
            {/* Toggle: Profile / Dashboard */}
            {(isDashboard || isProfile) && (
              <MotionText
                as="span"               // ✅ FIX: render span, not p
                fontWeight="medium"
                fontSize="lg"
                cursor="pointer"
                position="relative"
                color="gray.800"
                _hover={{ color: "teal.500" }}
                whileHover={{ scale: 1.05 }}
                onClick={() =>
                  navigate(isProfile ? "/dashboard" : "/profile")
                }
              >
                {isProfile ? "Dashboard" : "Profile"}

                {/* Underline */}
                <MotionBox
                  as="span"             // ✅ FIX: span instead of div
                  position="absolute"
                  bottom="-4px"
                  left="0"
                  height="2px"
                  bg="teal.500"
                  display="block"
                  initial={{ width: "0%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </MotionText>
            )}

            {/* Logout */}
            <MotionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              colorScheme="teal"
              rounded="full"
              px={6}
              fontWeight="semibold"
              boxShadow="md"
              onClick={handleLogout}
              _hover={{ boxShadow: "lg" }}
            >
              Logout
            </MotionButton>
          </Flex>
        )}
      </Flex>
    </MotionBox>
  );
}

