// SavingsGoalCard.jsx - Fixed entry delete + improved logging
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Progress,
  Collapse,
  IconButton,
  useDisclosure,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { DeleteIcon, ChevronDownIcon, ChevronUpIcon, CalendarIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  deleteSavingsGoal,
  addSavingsEntry,
  deleteSavingsEntry,
} from "../../api/savingsAPI";
import AddSavingsEntryModal from "./AddSavingsEntryModal";

const MotionBox = motion(Box);
const MotionProgress = motion(Progress);

export default function SavingsGoalCard({ goal, onChange }) {
  const { isOpen, onToggle } = useDisclosure();
  const [entryOpen, setEntryOpen] = useState(false);

  const totalSaved = goal.entries?.reduce((s, e) => s + e.amount, 0) || 0;
  const percent = goal.targetAmount === 0 ? 0 : Math.min((totalSaved / goal.targetAmount) * 100, 100);
  const isComplete = percent >= 100;

  return (
    <MotionBox
      bg="white"
      p={6}
      borderRadius="2xl"
      boxShadow="lg"
      whileHover={{ y: -6, boxShadow: "xl" }}
      transition={{ duration: 0.3 }}
      cursor="pointer"
      onClick={onToggle}
      border="1px solid"
      borderColor="gray.100"
    >
      <HStack justify="space-between">
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold" fontSize="xl" color="gray.800">
            {goal.name}
          </Text>
          <Text fontSize="lg" color="gray.600">
            ₹{totalSaved.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
          </Text>
          {isComplete && (
            <Tag colorScheme="teal" variant="subtle" borderRadius="full">
              <TagLabel>Goal Achieved!</TagLabel>
            </Tag>
          )}
        </VStack>

        <HStack spacing={3}>
          <IconButton
            icon={<DeleteIcon />}
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={async (e) => {
              e.stopPropagation();
              if (window.confirm("Delete this goal and all entries?")) {
                try {
                  console.log("Deleting goal ID:", goal.id);
                  await deleteSavingsGoal(goal.id);
                  onChange();
                } catch (err) {
                  console.error("Delete goal failed:", err);
                }
              }
            }}
            _hover={{ bg: "red.100" }}
          />
          <IconButton
            icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            size="md"
            variant="ghost"
            colorScheme="teal"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            aria-label="Toggle details"
          />
        </HStack>
      </HStack>

      <MotionProgress
        value={percent}
        mt={5}
        borderRadius="full"
        size="lg"
        colorScheme={isComplete ? "teal" : "green"}
        bg="gray.200"
        hasStripe={isComplete}
        isAnimated={isComplete}
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      />

      <Collapse in={isOpen}>
        <VStack align="stretch" spacing={5} mt={7}>
          <Button
            colorScheme="teal"
            variant="solid"
            size="md"
            rounded="full"
            onClick={(e) => {
              e.stopPropagation();
              setEntryOpen(true);
            }}
            boxShadow="md"
            _hover={{ transform: "translateY(-2px)" }}
          >
            + Add Entry
          </Button>

          <VStack spacing={4} align="stretch">
            {goal.entries?.length > 0 ? (
              goal.entries.map((e, idx) => (
                <MotionBox
                  key={e.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  bg="white"
                  p={4}
                  borderRadius="xl"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor="gray.100"
                  whileHover={{ x: 4, boxShadow: "md" }}
                >
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="semibold" color="teal.700">
                        ₹{e.amount.toLocaleString()}
                      </Text>
                      <HStack spacing={2} color="gray.600">
                        <CalendarIcon />
                        <Text fontSize="sm">
                          {new Date(e.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </Text>
                      </HStack>
                    </VStack>

                    <IconButton
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={async (ev) => {
                        ev.stopPropagation();
                        try {
                          await deleteSavingsEntry(e.id);  // Pass only entry ID
                          onChange();
                        } catch (err) {
                          console.error("Delete entry failed:", err);
                        }
                      }}
                      _hover={{ bg: "red.100" }}
                    />
                  </HStack>
                </MotionBox>
              ))
            ) : (
              <Text fontSize="md" color="gray.500" textAlign="center" fontStyle="italic">
                No contributions yet — start saving today!
              </Text>
            )}
          </VStack>
        </VStack>
      </Collapse>

      <AddSavingsEntryModal
        isOpen={entryOpen}
        onClose={() => setEntryOpen(false)}
        onSave={(data) =>
          addSavingsEntry(goal.id, data).then(() => {
            setEntryOpen(false);
            onChange();
          })
        }
      />
    </MotionBox>
  );
}