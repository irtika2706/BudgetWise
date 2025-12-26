// Login.jsx - Redesigned with consistent modern style (teal theme, animations, typing input preserved)
import {
  Button,
  Text,
  VStack,
  Link,
  FormControl,
  FormLabel,
  Heading,
  Box,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { loginUser } from "../api/authAPI";
import TypingInput from "../components/TypingInput";
import AuthCard from "../components/AuthCard";
import { Link as RouterLink, useNavigate } from "react-router-dom";

const MotionVStack = motion(VStack);
const MotionButton = motion(Button);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ email, password });
      sessionStorage.setItem("token", res.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <AuthCard subtitle="Welcome back! Sign in to manage your budget">
      <MotionVStack
        as="form"
        spacing={6}
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {error && (
          <Box
            bg="red.50"
            color="red.600"
            p={3}
            borderRadius="lg"
            border="1px solid"
            borderColor="red.200"
            textAlign="center"
            fontSize="sm"
          >
            {error}
          </Box>
        )}

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
          Sign In
        </MotionButton>
      </MotionVStack>

      <VStack mt={6} spacing={2} fontSize="sm" color="gray.600">
        <Link as={RouterLink} to="/forgot-password" color="teal.500" _hover={{ textDecoration: "underline" }}>
          Forgot password?
        </Link>
        <Text>
          Don't have an account?{" "}
          <Link as={RouterLink} to="/register" fontWeight="semibold" color="teal.500" _hover={{ textDecoration: "underline" }}>
            Sign Up
          </Link>
        </Text>
      </VStack>
    </AuthCard>
  );
}