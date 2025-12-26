import { Button, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { resetPassword } from "../api/authApi";
import TypingInput from "../components/TypingInput";
import AuthCard from "../components/AuthCard";

export default function ResetPassword() {
  const token = new URLSearchParams(window.location.search).get("token");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    await resetPassword({ token, newPassword: password });
    setMsg("Password reset successful. You may now sign in.");
  };

  return (
    <AuthCard subtitle="Set a new password">
      <VStack as="form" spacing={5} onSubmit={submit}>
        <TypingInput
          type="password"
          placeholders={["New Password"]}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          bg="#EAC36A"
          rounded="9999px"
          py={6}
          w="full"
          fontWeight="500"
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
          }}
        >
          Reset Password
        </Button>
      </VStack>

      {msg && (
        <Text mt={4} fontSize="sm" color="#8B846D">
          {msg}
        </Text>
      )}
    </AuthCard>
  );
}

