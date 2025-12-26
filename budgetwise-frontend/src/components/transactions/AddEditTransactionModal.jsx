// AddEditTransactionModal.jsx
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Select,
  Heading,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import TypingInput from "../TypingInput";
import { CATEGORIES } from "../../constants/categories";

// NEW — income categories (minimal, extendable)
const INCOME_CATEGORIES = ["Salary", "Freelance", "Interest", "Business", "Other"];

export default function AddEditTransactionModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}) {
  const [type, setType] = useState("EXPENSE");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  /* Populate fields */
  useEffect(() => {
    if (initialData) {
      setType(initialData.type); // type locked
      setTitle(initialData.title || "");
      setAmount(initialData.amount?.toString() || "");
      setCategory(initialData.category || "");
      setDate(initialData.date || "");
    } else {
      setType("EXPENSE");
      setTitle("");
      setAmount("");
      setCategory("");
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!title.trim() || !amount || !category || !date || !type) return;

    const payload = {
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
      type,
    };

    // ❗ DO NOT send type on update (backend enforces immutability)
    if (initialData) {
      delete payload.type;
    }

    onSave(payload);
    onClose();
  };

  const categories =
    type === "INCOME" ? INCOME_CATEGORIES : CATEGORIES;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />

      <ModalContent
        bg="white"
        borderRadius="2xl"
        boxShadow="2xl"
        mx={4}
        maxW="540px"
        as={motion.div}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <ModalHeader pb={4}>
          <Heading
            size="lg"
            bgGradient="linear(to-r, teal.500, cyan.500)"
            bgClip="text"
          >
            {initialData ? "Edit Transaction" : "Add Transaction"}
          </Heading>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Type */}
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">
                Type
              </FormLabel>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value)}
                isDisabled={!!initialData}
                bg="gray.50"
                borderRadius="xl"
                fontSize="lg"
                py={6}
                _focus={{
                  borderColor: "teal.500",
                  boxShadow: "0 0 0 3px rgba(56,178,172,0.2)",
                }}
              >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </Select>
            </FormControl>

            {/* Title */}
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">
                Title
              </FormLabel>
              <TypingInput
                placeholders={
                  type === "INCOME"
                    ? ["Salary", "Freelance Payment"]
                    : ["Lunch", "Groceries", "Fuel"]
                }
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fontSize="xl"
                bg="gray.50"
                borderRadius="xl"
                py={4}
                _focus={{
                  borderColor: "teal.500",
                  boxShadow: "0 0 0 3px rgba(56,178,172,0.2)",
                }}
              />
            </FormControl>

            {/* Amount */}
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">
                Amount
              </FormLabel>
              <TypingInput
                placeholders={["250", "1200", "50000"]}
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value.replace(/[^0-9]/g, ""))
                }
                fontSize="xl"
                bg="gray.50"
                borderRadius="xl"
                py={4}
                textAlign="center"
                fontWeight="bold"
                _focus={{
                  borderColor: "teal.500",
                  boxShadow: "0 0 0 3px rgba(56,178,172,0.2)",
                }}
              />
            </FormControl>

            {/* Category */}
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">
                Category
              </FormLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Select category"
                bg="gray.50"
                borderRadius="xl"
                fontSize="lg"
                py={6}
                _focus={{
                  borderColor: "teal.500",
                  boxShadow: "0 0 0 3px rgba(56,178,172,0.2)",
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Date */}
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">
                Date
              </FormLabel>
              <TypingInput
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                bg="gray.50"
                borderRadius="xl"
                py={4}
                fontSize="lg"
                _focus={{
                  borderColor: "teal.500",
                  boxShadow: "0 0 0 3px rgba(56,178,172,0.2)",
                }}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter pt={6}>
          <Button variant="ghost" size="lg" mr={4} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            rounded="full"
            size="lg"
            px={8}
            onClick={handleSubmit}
            isDisabled={!title || !amount || !category || !date}
            boxShadow="lg"
            _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
          >
            {initialData ? "Update" : "Save"} Transaction
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
