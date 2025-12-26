// SetBudgetModal.jsx
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
  Switch,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Tag,
  TagLabel,
  Heading,
  Box
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import TypingInput from "../TypingInput";
import { saveBudget } from "../../api/budgetAPI";
import { CATEGORIES } from "../../constants/categories";

const MotionVStack = motion(VStack);
const MotionHStack = motion(HStack);

const DEFAULT_SPLIT = {
  Food: 0.3,
  Groceries: 0.2,
  Transport: 0.15,
  Shopping: 0.15,
  Bills: 0.1,
  Entertainment: 0.1,
};

export default function SetBudgetModal({ isOpen, onClose, month, onSaved }) {
  const [total, setTotal] = useState("");
  const [useCategories, setUseCategories] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!useCategories || !total) {
      setCategories([]);
      return;
    }
    const t = Number(total) || 0;
    const prefilled = CATEGORIES.map((c) => ({
      category: c,
      amount: Math.round(t * (DEFAULT_SPLIT[c] || 0.1)),
    }));
    setCategories(prefilled);
  }, [useCategories, total]);

  const submit = async () => {
    if (!total) return;
    await saveBudget({
      month,
      totalBudget: Number(total),
      categories: useCategories ? categories.filter((c) => c.amount > 0) : [],
    });
    onClose();
    onSaved();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />

      <ModalContent
        bg="white"
        borderRadius="2xl"
        boxShadow="2xl"
        mx={4}
        maxW="560px"
        as={motion.div}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <ModalHeader pb={3}>
          <Heading
            size="lg"
            bgGradient="linear(to-r, teal.500, cyan.500)"
            bgClip="text"
            fontSize="2xl"          // Smaller than before
          >
            Set Budget for {month}
          </Heading>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Total Budget */}
            <FormControl>
              <FormLabel fontWeight="semibold" fontSize="md" color="gray.700">
                Total Monthly Budget
              </FormLabel>
              <TypingInput
                placeholders={["30000", "45000", "60000"]}
                value={total}
                onChange={(e) => setTotal(e.target.value.replace(/[^0-9]/g, ""))}
                fontSize="3xl"
                fontWeight="bold"
                textAlign="center"
                bg="gray.50"
                borderRadius="xl"
                py={4}
                _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 3px rgba(56,178,172,0.2)" }}
              />
            </FormControl>

            {/* Category Toggle */}
            <HStack justify="space-between" p={4} bg="gray.50" borderRadius="xl">
              <VStack align="start" spacing={0}>
                <Text fontWeight="semibold" fontSize="md" color="gray.800">
                  Category-wise budget
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Auto-split your total budget
                </Text>
              </VStack>
              <Switch
                size="lg"
                colorScheme="teal"
                isChecked={useCategories}
                onChange={(e) => setUseCategories(e.target.checked)}
              />
            </HStack>

            {/* Category Inputs */}
            <AnimatePresence>
              {useCategories && (
                <MotionVStack
                  spacing={4}
                  align="stretch"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Text fontWeight="medium" fontSize="md" color="gray.700">
                    Category Breakdown
                  </Text>

                  {CATEGORIES.map((cat, idx) => {
                    const catData = categories.find((c) => c.category === cat);
                    const value = catData?.amount || "";

                    return (
                      <MotionHStack
                        key={cat}
                        spacing={4}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Tag
                          size="lg"
                          variant="subtle"
                          colorScheme="teal"
                          borderRadius="full"
                          minW="120px"
                          justifyContent="center"
                        >
                          <TagLabel fontSize="sm" fontWeight="medium">
                            {cat}
                          </TagLabel>
                        </Tag>

                        <TypingInput
                          placeholders={["0", "5000", "10000"]}
                          value={value}
                          onChange={(e) => {
                            const num = e.target.value.replace(/[^0-9]/g, "");
                            setCategories((prev) => {
                              const copy = [...prev];
                              const idx = copy.findIndex((c) => c.category === cat);
                              if (!num) {
                                return copy.filter((c) => c.category !== cat);
                              }
                              if (idx >= 0) {
                                copy[idx].amount = Number(num);
                              } else {
                                copy.push({ category: cat, amount: Number(num) });
                              }
                              return copy;
                            });
                          }}
                          fontSize="lg"
                          textAlign="center"
                          bg="white"
                          borderRadius="lg"
                          _focus={{
                            borderColor: "teal.500",
                            boxShadow: "0 0 0 3px rgba(56,178,172,0.2)",
                          }}
                        />
                      </MotionHStack>
                    );
                  })}
                </MotionVStack>
              )}
            </AnimatePresence>
          </VStack>
        </ModalBody>

        <ModalFooter pt={6}>
          <Button variant="ghost" size="lg" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            rounded="full"
            size="lg"
            px={8}
            onClick={submit}
            isDisabled={!total}
            boxShadow="lg"
            _hover={{ transform: "translateY(-2px)", boxShadow: "xl" }}
          >
            Save Budget
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}