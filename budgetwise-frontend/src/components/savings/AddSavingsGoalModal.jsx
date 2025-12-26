// AddSavingsGoalModal.jsx
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
import { useState } from "react";
import TypingInput from "../TypingInput";

export default function AddSavingsGoalModal({ isOpen, onClose, onSave = () => {} }) {
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const submit = () => {
    if (!name.trim() || !targetAmount) return;

    onSave({
      name: name.trim(),
      targetAmount: Number(targetAmount),
    });

    setName("");
    setTargetAmount("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />

      <ModalContent
        bg="white"
        borderRadius="2xl"
        boxShadow="2xl"
        mx={4}
        maxW="500px"
        as={motion.div}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <ModalHeader pb={4}>
          <Heading size="lg" bgGradient="linear(to-r, teal.500, cyan.500)" bgClip="text">
            Add New Savings Goal
          </Heading>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">
                Goal Name
              </FormLabel>
              <TypingInput
                placeholders={["Emergency Fund", "Vacation", "New Laptop"]}
                value={name}
                onChange={(e) => setName(e.target.value)}
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

            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">
                Target Amount
              </FormLabel>
              <TypingInput
                placeholders={["50000", "100000", "20000"]}
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value.replace(/[^0-9]/g, ""))}
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
            isDisabled={!name.trim() || !targetAmount}
            boxShadow="lg"
            _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
          >
            Save Goal
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}