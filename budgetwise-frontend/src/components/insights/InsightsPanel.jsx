import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  VStack,
  Spinner,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { getExpenses } from "../../api/expenseAPI";
import {
  groupByMonthIncomeExpense,
  groupExpensesByMonth,
  predictNextMonthSpending,
  generateSpendingAlerts,
  generateSmartSuggestions,
  expenseIncomeInsight,
} from "../../utils/financeUtils";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);

export default function InsightsPanel() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const cardBg = useColorModeValue("white", "gray.800");
  const subtleBg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getExpenses();
        setExpenses(res.data || []);
      } catch (err) {
        console.error("Failed to load expenses for insights", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ---------- Monthly Aggregations ---------- */

  // Income + Expense (for charts & income insight)
  const monthlyIncomeExpense = useMemo(
    () => groupByMonthIncomeExpense(expenses),
    [expenses]
  );

  // Expense-only (for regression, alerts, suggestions)
  const monthlyExpenseOnly = useMemo(
    () => groupExpensesByMonth(expenses),
    [expenses]
  );

  /* ---------- AI-lite Logic ---------- */

  const prediction = useMemo(
    () => predictNextMonthSpending(monthlyExpenseOnly),
    [monthlyExpenseOnly]
  );

  const alerts = useMemo(
    () => generateSpendingAlerts(monthlyExpenseOnly),
    [monthlyExpenseOnly]
  );

  const suggestions = useMemo(
    () => generateSmartSuggestions(monthlyExpenseOnly, prediction),
    [monthlyExpenseOnly, prediction]
  );

  const incomeInsight = useMemo(
    () => expenseIncomeInsight(monthlyIncomeExpense),
    [monthlyIncomeExpense]
  );

  /* ---------- Loading / Empty ---------- */

  if (loading) {
    return (
      <Center py={20}>
        <Spinner size="xl" color="teal.500" thickness="4px" />
      </Center>
    );
  }

  if (monthlyIncomeExpense.length === 0) {
    return (
      <MotionBox
        bg={cardBg}
        p={8}
        borderRadius="2xl"
        boxShadow="lg"
        textAlign="center"
      >
        <MotionText color="gray.500" fontStyle="italic">
          Add transactions to unlock spending insights.
        </MotionText>
      </MotionBox>
    );
  }

  /* ---------- Main Panel ---------- */

  return (
    <MotionBox
      bg={cardBg}
      p={{ base: 4, md: 8 }}
      borderRadius="2xl"
      boxShadow="lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      mt={12}
    >
      <MotionHeading
        size="lg"
        bgGradient="linear(to-r, teal.500, cyan.500)"
        bgClip="text"
        mb={8}
        initial={{ x: -40 }}
        animate={{ x: 0 }}
      >
        Spending Insights
      </MotionHeading>

      <Flex direction={{ base: "column", lg: "row" }} gap={8}>
        {/* LEFT — Income vs Expense Trend */}
        <MotionFlex
          flex={{ base: 1, lg: 4 }}
          bg={subtleBg}
          p={6}
          borderRadius="xl"
          boxShadow="lg"
          direction="column"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ y: -4 }}
        >
          <Heading size="md" mb={4} color="gray.700">
            Income vs Expense Trend
          </Heading>

          <Box flex={1} minH="260px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyIncomeExpense}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Expense"
                />

                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Income"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </MotionFlex>

        {/* RIGHT — Prediction + Insights */}
        <VStack flex={{ base: 1, lg: 6 }} spacing={6} align="stretch">
          {/* Prediction */}
          <MotionBox
            bg={subtleBg}
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -4 }}
          >
            <Heading size="md" mb={2} color="gray.700">
              Next Month Expense Estimate
            </Heading>
            <Text fontSize="sm" color="gray.600" mb={3}>
              Based on historical expense trends
            </Text>

            {prediction ? (
              <Text fontSize="3xl" fontWeight="bold" color="teal.600">
                ₹{prediction.toLocaleString()}
              </Text>
            ) : (
              <Text color="gray.500" fontStyle="italic">
                Not enough data to predict yet.
              </Text>
            )}

            {incomeInsight && (
              <Text
                mt={3}
                fontSize="sm"
                color={
                  incomeInsight.status === "good"
                    ? "green.600"
                    : incomeInsight.status === "warning"
                    ? "orange.600"
                    : "red.600"
                }
              >
                {incomeInsight.text}
              </Text>
            )}
          </MotionBox>

          {/* Alerts & Suggestions */}
          <MotionBox
            bg={subtleBg}
            p={6}
            borderRadius="xl"
            boxShadow="lg"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ y: -4 }}
          >
            <Heading size="md" mb={4} color="gray.700">
              Smart Insights
            </Heading>

            <VStack align="start" spacing={3}>
              {alerts.map((a, i) => (
                <Text key={i} fontSize="sm" color="red.600">
                  • {a}
                </Text>
              ))}

              {suggestions.map((s, i) => (
                <Text key={i} fontSize="sm" color="gray.700">
                  • {s}
                </Text>
              ))}

              {alerts.length === 0 && suggestions.length === 0 && (
                <Text fontSize="sm" color="gray.500" fontStyle="italic">
                  No insights available yet.
                </Text>
              )}
            </VStack>
          </MotionBox>
        </VStack>
      </Flex>
    </MotionBox>
  );
}
