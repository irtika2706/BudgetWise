import { Box, Text, Flex, IconButton } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

export default function TransactionCard({ tx, onEdit, onDelete }) {
  const isIncome = tx.type === "INCOME";

  return (
    <Box
      bg={isIncome ? "green.50" : "red.50"}
      borderRadius="xl"
      p={4}
      boxShadow="xs"
      border="1px solid"
      borderColor={isIncome ? "green.200" : "red.200"}
      transition="all 0.2s"
      _hover={{ boxShadow: "md" }}
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontWeight="600">{tx.title}</Text>
          <Text fontSize="sm" color="gray.600">
            {tx.category} · {tx.date}
          </Text>
        </Box>

        <Flex align="center" gap={3}>
          <Text
            fontWeight="600"
            color={isIncome ? "green.600" : "red.600"}
          >
            ₹{tx.amount}
          </Text>

          <IconButton
            size="sm"
            icon={<EditIcon />}
            onClick={() => onEdit(tx)}
            aria-label="Edit"
            variant="ghost"
          />

          <IconButton
            size="sm"
            icon={<DeleteIcon />}
            colorScheme="red"
            onClick={() => onDelete(tx.id)}
            aria-label="Delete"
            variant="ghost"
          />
        </Flex>
      </Flex>
    </Box>
  );
}
