import {
  Box,
  Heading,
  Text,
  Progress,
  Button,
  HStack,
  VStack,
  Flex,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { EditIcon, RepeatIcon, DeleteIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { getBudgetSummary, deleteBudget } from "../../api/budgetAPI";
import SetBudgetModal from "./SetBudgetModal";

/* ---------- Custom Tooltip ---------- */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <VStack
        align="start"
        bg="white"
        p={3}
        borderRadius="md"
        boxShadow="lg"
        spacing={1}
      >
        {payload.map((entry, index) => (
          <Text key={index} fontWeight="bold" fontSize="sm" color="gray.800">
            {entry.name}: ₹{entry.value}
          </Text>
        ))}
      </VStack>
    );
  }
  return null;
};

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);
const MotionHeading = motion(Heading);

export default function BudgetPanel() {
  const month = new Date().toISOString().slice(0, 7);
  const [data, setData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const load = async () => {
    try {
      const res = await getBudgetSummary(month);
      setData(res.data);
    } catch (err) {
      console.error("Failed to load budget:", err);
      setData(null);
    }
  };

  useEffect(() => {
    load();
    window.addEventListener("focus", load);
    return () => window.removeEventListener("focus", load);
  }, [month]);

  const handleDelete = async () => {
    if (!confirm("Delete this budget?")) return;
    await deleteBudget(month);
    setData(null);
  };

  /* ---------- Empty State ---------- */
  if (!data) {
    return (
      <MotionBox
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        bg={cardBg}
        p={8}
        borderRadius="2xl"
        boxShadow="lg"
        textAlign="center"
      >
        <MotionHeading
          size="lg"
          bgGradient="linear(to-r, teal.500, blue.500)"
          bgClip="text"
        >
          Budget
        </MotionHeading>

        <MotionText mt={4} fontSize="lg" color="gray.600">
          No budget set for this month yet.
        </MotionText>

        <Button
          mt={6}
          colorScheme="teal"
          size="lg"
          rounded="full"
          onClick={onOpen}
          leftIcon={<EditIcon />}
          boxShadow="lg"
          _hover={{ transform: "scale(1.05)" }}
        >
          + Set Budget
        </Button>

        <SetBudgetModal
          isOpen={isOpen}
          onClose={onClose}
          month={month}
          onSaved={load}
        />
      </MotionBox>
    );
  }

  const isOverallOverspent = data.overall.remaining < 0;
  const overallRemaining = Math.max(data.overall.remaining, 0);

  const filteredCategories = data.categories
    .map((cat) => ({
      category: cat.category,
      spent: Math.min(cat.spent || 0, cat.budget),
      remaining: Math.max(cat.remaining ?? cat.budget - cat.spent, 0),
      overspend: cat.spent > cat.budget ? cat.spent - cat.budget : 0,
      budget: cat.budget,
    }))
    .filter((cat) => cat.spent > 0 || cat.overspend > 0);

  const barSize =
    filteredCategories.length > 0
      ? Math.max(60, 400 / filteredCategories.length)
      : 60;

  const hasOverspend = filteredCategories.some((c) => c.overspend > 0);

  /* ---------- Main Panel ---------- */
  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      bg={cardBg}
      p={{ base: 4, md: 8 }}
      borderRadius="2xl"
      boxShadow="lg"
    >
      {/* Header */}
      <HStack justify="space-between" mb={6}>
        <MotionHeading
          size="lg"
          bgGradient="linear(to-r, teal.500, cyan.500)"
          bgClip="text"
        >
          Budget Overview
        </MotionHeading>

        <HStack spacing={3}>
          <IconButton
            icon={<EditIcon />}
            aria-label="Edit"
            size="sm"
            variant="outline"
            onClick={onOpen}
            _hover={{ transform: "scale(1.1)" }}
          />
          <IconButton
            icon={<RepeatIcon />}
            aria-label="Refresh"
            size="sm"
            variant="outline"
            onClick={load}
            _hover={{ transform: "rotate(180deg)" }}
          />
          <IconButton
            icon={<DeleteIcon />}
            aria-label="Delete"
            size="sm"
            variant="outline"
            colorScheme="red"
            onClick={handleDelete}
            _hover={{ transform: "scale(1.1)" }}
          />
        </HStack>
      </HStack>

      {/* Overall */}
      <VStack align="start" spacing={4} mb={8}>
        <Text color="gray.600">Overall Budget</Text>
        <Text fontSize="3xl" fontWeight="bold" color={textColor}>
          ₹{data.overall.budget.toLocaleString()}
        </Text>

        <Progress
          value={Math.min(data.overall.percentage, 100)}
          colorScheme={isOverallOverspent ? "red" : "teal"}
          size="lg"
          borderRadius="full"
          w="full"
        />

        <HStack spacing={6} color="gray.600">
          <Text>
            Spent:{" "}
            <Text as="span" fontWeight="bold" color="red.500">
              ₹{data.overall.spent}
            </Text>
          </Text>
          <Text>
            Remaining:{" "}
            <Text as="span" fontWeight="bold" color="green.500">
              ₹{data.overall.remaining}
            </Text>
          </Text>
        </HStack>
      </VStack>

      {/* Charts */}
      <Flex direction={{ base: "column", lg: "row" }} gap={8}>
        {/* Pie */}
        <MotionFlex
          flex={1}
          bg="gray.50"
          p={6}
          borderRadius="xl"
          boxShadow="lg"
          whileHover={{ y: -5 }}
        >
          <Heading size="md" mb={6}>
            Overall Spending Breakdown
          </Heading>
          <Box h="300px" w="full">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: "Remaining", value: overallRemaining },
                    { name: "Spent", value: data.overall.spent },
                  ]}
                  dataKey="value"
                  outerRadius="80%"
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#EF4444" />
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </MotionFlex>

        {/* Bars */}
        <AnimatePresence>
          {filteredCategories.length > 0 && (
            <MotionFlex
              flex={1}
              bg="gray.50"
              p={6}
              borderRadius="xl"
              boxShadow="lg"
              whileHover={{ y: -5 }}
            >
              <Heading size="md" mb={6}>
                Category-wise Breakdown
              </Heading>
              <Box h="300px" w="full">
                <ResponsiveContainer>
                  <BarChart data={filteredCategories}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="remaining" stackId="a" fill="#10B981" />
                    <Bar dataKey="spent" stackId="a" fill="#EF4444" />
                    {hasOverspend && (
                      <Bar
                        dataKey="overspend"
                        stackId="a"
                        fill="#B91C1C"
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </MotionFlex>
          )}
        </AnimatePresence>
      </Flex>

      <SetBudgetModal
        isOpen={isOpen}
        onClose={onClose}
        month={month}
        onSaved={load}
      />
    </MotionBox>
  );
}
