// Register.jsx - Redesigned with consistent teal theme & typing animation
import {
  Box,
  Button,
  Text,
  VStack,
  Link,
  FormControl,
  FormLabel,
  Heading,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { registerUser } from "../api/authAPI";
import TypingInput from "../components/TypingInput";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionButton = motion(Button);

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerUser({
        email,
        password,
        name: "User", // Can be enhanced later
      });
      navigate("/login", { replace: true });
    } catch (err) {
      setError("Registration failed — email may already exist");
    }
  };

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <MotionBox
        bg="white"
        w="full"
        maxW="md"
        borderRadius="2xl"
        boxShadow="2xl"
        p={{ base: 6, md: 10 }}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack spacing={1} mb={6} align="start">
          <Heading
            size="md"
            fontWeight="bold"
            color="gray.800"
          >
            Welcome to BudgetWise
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Create your account and start managing money smarter
          </Text>
        </VStack>



        {error && (
          <Box
            bg="red.50"
            color="red.600"
            p={4}
            borderRadius="lg"
            border="1px solid"
            borderColor="red.200"
            textAlign="center"
            mb={6}
          >
            {error}
          </Box>
        )}

        <MotionVStack
          as="form"
          spacing={6}
          onSubmit={submit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FormControl>
            <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">
              Email Address
            </FormLabel>
            <TypingInput
              placeholders={["you@example.com", "john.doe@gmail.com"]}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fontSize="lg"
              bg="gray.50"
              borderRadius="xl"
              py={4}
              _focus={{
                borderColor: "teal.500",
                boxShadow: "0 0 0 3px rgba(56,178,172,0.2)",
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">
              Password
            </FormLabel>
            <TypingInput
              type="password"
              placeholders={["••••••••"]}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fontSize="lg"
              bg="gray.50"
              borderRadius="xl"
              py={4}
              _focus={{
                borderColor: "teal.500",
                boxShadow: "0 0 0 3px rgba(56,178,172,0.2)",
              }}
            />
          </FormControl>

          <FormControl>
            <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">
              Confirm Password
            </FormLabel>
            <TypingInput
              type="password"
              placeholders={["••••••••"]}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              fontSize="lg"
              bg="gray.50"
              borderRadius="xl"
              py={4}
              _focus={{
                borderColor: "teal.500",
                boxShadow: "0 0 0 3px rgba(56,178,172,0.2)",
              }}
            />
          </FormControl>

          <MotionButton
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            colorScheme="teal"
            rounded="full"
            size="lg"
            py={7}
            w="full"
            fontWeight="semibold"
            boxShadow="lg"
            _hover={{ boxShadow: "xl", transform: "translateY(-2px)" }}
          >
            Create Account
          </MotionButton>
        </MotionVStack>

        <VStack mt={8} spacing={2} fontSize="sm" color="gray.600" textAlign="center">
          <Text>
            Already have an account?{" "}
            <Link as={RouterLink} to="/login" fontWeight="semibold" color="teal.500" _hover={{ textDecoration: "underline" }}>
              Sign In
            </Link>
          </Text>
        </VStack>
      </MotionBox>
    </Box>
  );
}