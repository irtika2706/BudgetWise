// ForgotPassword.jsx – Redesigned to match Login & Register principles
import {
  Button,
  Text,
  VStack,
  Box,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
import { forgotPassword } from "../api/authApi";
import TypingInput from "../components/TypingInput";
import AuthCard from "../components/AuthCard";

const MotionVStack = motion(VStack);
const MotionButton = motion(Button);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    await forgotPassword(email);
    setMsg("If the email exists, a reset link has been sent.");
  };

  return (
    <AuthCard subtitle="Reset your password">
      <MotionVStack
        as="form"
        spacing={6}
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
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
          Continue
        </MotionButton>
      </MotionVStack>

      {msg && (
        <Box
          mt={4}
          bg="teal.50"
          color="teal.700"
          p={3}
          borderRadius="lg"
          border="1px solid"
          borderColor="teal.200"
          fontSize="sm"
        >
          {msg}
        </Box>
      )}
    </AuthCard>
  );
}

