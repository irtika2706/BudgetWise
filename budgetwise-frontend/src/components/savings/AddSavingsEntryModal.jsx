// AddSavingsEntryModal.jsx
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
  Heading,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";  // ← Fixed: Added useEffect import
import TypingInput from "../TypingInput";

export default function AddSavingsEntryModal({ isOpen, onClose, onSave = () => {} }) {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  // Auto-set date to today when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
    }
  }, [isOpen]);

  const submit = () => {
    if (!amount || !date) return;

    onSave({
      amount: Number(amount),
      date,
    });

    setAmount("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />

      <ModalContent
        bg="white"
        borderRadius="2xl"
        boxShadow="2xl"
        mx={4}
        maxW="460px"
        as={motion.div}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <ModalHeader pb={4}>
          <Heading size="lg" bgGradient="linear(to-r, teal.500, cyan.500)" bgClip="text">
            Add Savings Entry
          </Heading>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">
                Amount Saved
              </FormLabel>
              <TypingInput
                placeholders={["2000", "5000", "10000"]}
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
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
            onClick={submit}
            isDisabled={!amount || !date}
            boxShadow="lg"
            _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
          >
            Save Entry
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}