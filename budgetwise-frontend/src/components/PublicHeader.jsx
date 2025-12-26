// PublicHeader.jsx - Redesigned to match authenticated AppHeader style
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionButton = motion(Button);

export default function PublicHeader() {
  return (
    <MotionBox
      bg="white"
      px={{ base: 4, md: 8 }}
      py={4}
      borderBottom="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      position="sticky"
      top={0}
      zIndex="banner"
    >
      <Flex align="center" justify="space-between" maxW="1400px" mx="auto">
        {/* Logo - Smaller & matching authenticated header */}
        <MotionBox
          whileHover={{ scale: 1.05 }}
          cursor="pointer"
          as={RouterLink}
          to="/"
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

        {/* Right Side: Login + Sign Up */}
        <Flex align="center" gap={{ base: 4, md: 8 }}>
          {/* Login with hover underline */}
          <MotionText
            fontWeight="medium"
            color="gray.800"
            cursor="pointer"
            fontSize="lg"
            position="relative"
            as={RouterLink}
            to="/login"
            _hover={{ color: "teal.500" }}
            whileHover={{ scale: 1.05 }}
          >
            Login
            <MotionBox
              position="absolute"
              bottom="-4px"
              left="0"
              height="2px"
              bg="teal.500"
              initial={{ width: "0%" }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </MotionText>

          {/* Sign Up Button */}
          <MotionButton
            as={RouterLink}
            to="/register"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            colorScheme="teal"
            variant="solid"
            rounded="full"
            px={6}
            fontWeight="semibold"
            boxShadow="md"
            _hover={{ boxShadow: "lg" }}
          >
            Sign Up
          </MotionButton>
        </Flex>
      </Flex>
    </MotionBox>
  );
}
