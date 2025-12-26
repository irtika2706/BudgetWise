import { Box, Text } from "@chakra-ui/react";

export default function AuthCard({ title, subtitle, children }) {
  return (
    <Box
      minH="100vh"
      bg="#FFFEFC"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Box
        w="full"
        maxW="sm"
        bg="#FFFEFC"
        border="1px solid rgba(0,0,0,0.15)"
        borderRadius="xl"
        boxShadow="0 8px 24px rgba(0,0,0,0.08)"
        p={6}
      >
        <Text fontSize="xl" fontWeight="700" color="#1C1C1C" mb={1}>
          Welcome to  BudgetWise
        </Text>
        <Text color="#8B846D" fontSize="sm" mb={6}>
          {subtitle}
        </Text>

        {children}
      </Box>
    </Box>
  );
}
