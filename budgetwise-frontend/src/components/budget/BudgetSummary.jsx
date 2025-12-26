import { Box, Text, Progress, VStack } from "@chakra-ui/react";

export default function BudgetSummary({ overall }) {
  return (
    <Box>
      <VStack align="stretch" spacing={2}>
        <Text>
          Spent: ₹{overall.spent} / ₹{overall.budget}
        </Text>
        <Text>Remaining: ₹{overall.remaining}</Text>
        <Progress
          value={overall.percentage}
          colorScheme={overall.percentage > 90 ? "red" : "yellow"}
          borderRadius="full"
        />
      </VStack>
    </Box>
  );
}
