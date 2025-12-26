import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  Button,
  VStack,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import AppHeader from "../components/AppHeader";
import { getExpenses } from "../api/expenseAPI";
import { getBudgetSummary } from "../api/budgetAPI";
import { getSavingsGoals } from "../api/savingsAPI";
import { groupByMonthIncomeExpense } from "../utils/financeUtils";

const MotionBox = motion(Box);

/* ---------- JWT Decode ---------- */
function getUserFromToken() {
  const token = sessionStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { email: payload.sub };
  } catch {
    return null;
  }
}

export default function Profile() {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(null);
  const [savings, setSavings] = useState([]);

  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportTarget, setExportTarget] = useState("profile");

  const user = getUserFromToken();
  const cardBg = useColorModeValue("white", "gray.800");
  const subtleBg = useColorModeValue("gray.50", "gray.700");

  /* ---------- Load Data ---------- */
  useEffect(() => {
    const month = new Date().toISOString().slice(0, 7);

    getExpenses().then((res) => setTransactions(res.data || []));
    getBudgetSummary(month)
      .then((res) => setBudget(res.data))
      .catch(() => setBudget(null));
    getSavingsGoals().then((res) => setSavings(res.data || []));
  }, []);

  /* ---------- Aggregates ---------- */
  const monthly = useMemo(
    () => groupByMonthIncomeExpense(transactions),
    [transactions]
  );

  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === "INCOME") income += t.amount;
      if (t.type === "EXPENSE") expense += t.amount;
    });

    return {
      income,
      expense,
      net: income - expense,
      savingsRate:
        income > 0 ? (((income - expense) / income) * 100).toFixed(1) : 0,
      expenseIncomePercent:
        income > 0 ? ((expense / income) * 100).toFixed(1) : 0,
    };
  }, [transactions]);

  const avgMonthlyExpense = useMemo(() => {
    if (!monthly.length) return 0;
    return Math.round(
      monthly.reduce((s, m) => s + m.expense, 0) / monthly.length
    );
  }, [monthly]);

  /* ---------- CSV Export ---------- */
  const exportTransactionsCSV = () => {
    const rows = [
      ["Date", "Title", "Type", "Category", "Amount"],
      ...transactions.map((t) => [
        t.date,
        t.title,
        t.type,
        t.category,
        t.amount,
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "budgetwise-transactions.csv";
    link.click();
  };

  /* ---------- PDF Exports ---------- */
  const exportProfilePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("BudgetWise – Profile Summary", 14, 20);
    doc.setFontSize(11);
    doc.text(`User: ${user?.email}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [["Metric", "Value"]],
      body: [
        ["Total Income", `INR ${summary.income}`],
        ["Total Expense", `INR ${summary.expense}`],
        ["Net Balance", `INR ${summary.net}`],
        ["Avg Monthly Expense", `INR ${avgMonthlyExpense}`],
        ["Savings Rate", `${summary.savingsRate}%`],
        ["Expense / Income", `${summary.expenseIncomePercent}%`],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Month", "Income", "Expense"]],
      body: monthly.map((m) => [m.month, m.income, m.expense]),
    });

    doc.save("budgetwise-profile-summary.pdf");
  };

  const exportTransactionsPDF = () => {
    const doc = new jsPDF();
    doc.text("BudgetWise – Transactions", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Date", "Title", "Type", "Category", "Amount"]],
      body: transactions.map((t) => [
        t.date,
        t.title,
        t.type,
        t.category,
        `INR ${t.amount}`,
      ]),
    });

    doc.save("budgetwise-transactions.pdf");
  };

  const exportBudgetSavingsPDF = () => {
    const doc = new jsPDF();
    doc.text("BudgetWise – Budget & Savings", 14, 20);
    let y = 30;

    if (budget?.overall) {
      autoTable(doc, {
        startY: y,
        head: [["Metric", "Value"]],
        body: [
          ["Total Budget", `INR ${budget.overall.budget}`],
          ["Spent", `INR ${budget.overall.spent}`],
          ["Remaining", `INR ${budget.overall.remaining}`],
        ],
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    if (budget?.categories?.length) {
      autoTable(doc, {
        startY: y,
        head: [["Category", "Budget", "Spent"]],
        body: budget.categories.map((c) => [
          c.category,
          `INR ${c.budget}`,
          `INR ${c.spent}`,
        ]),
      });
      y = doc.lastAutoTable.finalY + 10;
    }

    autoTable(doc, {
      startY: y,
      head: [["Goal", "Target", "Saved"]],
      body: savings.map((s) => [
        s.title,
        `INR ${s.targetAmount}`,
        `INR ${s.savedAmount}`,
      ]),
    });

    doc.save("budgetwise-budget-savings.pdf");
  };

  const handleExport = () => {
    if (exportFormat === "csv") {
      exportTransactionsCSV();
      return;
    }

    if (exportTarget === "profile") exportProfilePDF();
    if (exportTarget === "transactions") exportTransactionsPDF();
    if (exportTarget === "budget") exportBudgetSavingsPDF();
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <AppHeader isAuthenticated />

      <Box px={{ base: 4, md: 6, lg: 8 }} py={8}>
        {/* Header */}
        <VStack align="start" spacing={1} mb={8}>
          <Heading
            size="lg"
            bgGradient="linear(to-r, teal.500, cyan.500)"
            bgClip="text"
          >
            Profile Overview
          </Heading>
          <Text fontSize="sm" color="gray.600">
            Logged in as <strong>{user?.email}</strong>
          </Text>
        </VStack>

        {/* 6 Cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={12}>
          {[
            ["Total Income", summary.income, "green"],
            ["Total Expense", summary.expense, "red"],
            ["Net Balance", summary.net, "teal"],
            ["Avg Monthly Expense", avgMonthlyExpense, "orange"],
            ["Savings Rate", `${summary.savingsRate}%`, "blue"],
            ["Expense / Income", `${summary.expenseIncomePercent}%`, "purple"],
          ].map(([label, value, color], i) => (
            <MotionBox
              key={i}
              bg={cardBg}
              p={6}
              borderRadius="2xl"
              boxShadow="lg"
              whileHover={{ y: -4 }}
            >
              <Text color="gray.500">{label}</Text>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={`${color}.500`}
              >
                {typeof value === "number"
                  ? `₹${value.toLocaleString()}`
                  : value}
              </Text>
            </MotionBox>
          ))}
        </SimpleGrid>

        {/* Chart + Export */}
        <Flex direction={{ base: "column", lg: "row" }} gap={8}>
          {/* Chart */}
          <MotionBox
            flex={1}
            bg={subtleBg}
            p={6}
            borderRadius="2xl"
            boxShadow="lg"
          >
            <Heading size="md" mb={4}>
              Income vs Expense
            </Heading>
            <Box h="280px">
              <ResponsiveContainer>
                <BarChart data={monthly}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#10B981" />
                  <Bar dataKey="expense" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </MotionBox>

          {/* Export Panel */}
          <MotionBox
            flex={1}
            bg={cardBg}
            p={6}
            borderRadius="2xl"
            boxShadow="lg"
          >
            <Heading size="md" mb={4}>
              Export Data
            </Heading>

            <VStack align="stretch" spacing={4}>
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
              </Select>

              <Select
                value={exportTarget}
                onChange={(e) => setExportTarget(e.target.value)}
                isDisabled={exportFormat === "csv"}
              >
                <option value="profile">Profile Summary</option>
                <option value="transactions">Transactions</option>
                <option value="budget">Budget & Savings</option>
              </Select>

              <Button colorScheme="teal" onClick={handleExport}>
                Export
              </Button>

              <Text fontSize="sm" color="gray.500">
                Files are generated locally. No data leaves your device.
              </Text>
            </VStack>
          </MotionBox>
        </Flex>
      </Box>
    </Box>
  );
}
