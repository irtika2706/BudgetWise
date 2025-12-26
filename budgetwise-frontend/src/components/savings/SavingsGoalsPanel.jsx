// SavingsGoalsPanel.jsx (or SavingsPanel.jsx)
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  useDisclosure,
  IconButton,
  Spinner,
  Center,
  Text,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { AddIcon } from "@chakra-ui/icons";
import SavingsGoalCard from "./SavingsGoalCard";
import AddSavingsGoalModal from "./AddSavingsGoalModal";
import {
  getSavingsGoals,
  createSavingsGoal,
} from "../../api/savingsAPI";

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionButton = motion(Button);
const MotionText = motion(Text);  // ← Added this to fix MotionText error

export default function SavingsGoalsPanel() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await getSavingsGoals();
      setGoals(res.data || []);
    } catch (err) {
      console.error("Failed to load savings goals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      bg="white"
      p={{ base: 4, md: 8 }}
      borderRadius="2xl"
      boxShadow="lg"
      display="flex"
      flexDirection="column"
      h="full"
    >
      <HStack justify="space-between" mb={6}>
        <MotionHeading
          size="lg"
          bgGradient="linear(to-r, teal.500, cyan.500)"
          bgClip="text"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Savings Goals
        </MotionHeading>

        <MotionButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          colorScheme="teal"
          rounded="full"
          size="md"
          leftIcon={<AddIcon />}
          onClick={onOpen}
          boxShadow="lg"
        >
          Add Goal
        </MotionButton>
      </HStack>

      {loading ? (
        <Center flex={1}>
          <Spinner size="xl" color="teal.500" thickness="4px" />
        </Center>
      ) : goals.length === 0 ? (
        <MotionText
          textAlign="center"
          color="gray.500"
          fontStyle="italic"
          mt={10}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No savings goals yet. Create one to start tracking!
        </MotionText>
      ) : (
        <VStack spacing={5} align="stretch" flex={1} overflowY="auto" pr={2}>
          <AnimatePresence>
            {goals.map((goal, index) => (
              <MotionBox
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <SavingsGoalCard goal={goal} onChange={fetchGoals} />
              </MotionBox>
            ))}
          </AnimatePresence>
        </VStack>
      )}

      <AddSavingsGoalModal
        isOpen={isOpen}
        onClose={onClose}
        onSave={(data) =>
          createSavingsGoal(data).then(() => {
            onClose();
            fetchGoals();
          })
        }
      />
    </MotionBox>
  );
}