import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  Text,
  Select,
  HStack,
  Flex,
  IconButton,
  useColorModeValue,
  Spinner,
  Center,
  useDisclosure,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { AddIcon, RepeatIcon } from "@chakra-ui/icons";
import TransactionCard from "./TransactionCard";
import AddEditTransactionModal from "./AddEditTransactionModal";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "../../api/expenseAPI";
import { CATEGORIES } from "../../constants/categories";

const PAGE_SIZE = 10;

// ✅ NEW (minimal, local)
const INCOME_CATEGORIES = ["Salary", "Freelance", "Interest", "Business", "Other"];

// Motion wrappers
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionVStack = motion(VStack);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);

export default function TransactionsPanel() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingTx, setEditingTx] = useState(null);

  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDate, setFilterDate] = useState("All");

  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.800");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getExpenses();
      setExpenses(Array.isArray(res.data) ? res.data : []);
      setCurrentPage(1);
    } catch {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data) => {
    await addExpense(data);
    onClose();
    fetchExpenses();
  };

  const handleUpdate = async (data) => {
    await updateExpense(editingTx.id, data);
    setEditingTx(null);
    onClose();
    fetchExpenses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await deleteExpense(id);
    fetchExpenses();
  };

  const processedExpenses = useMemo(() => {
    return expenses
      .filter((tx) => {
        if (filterCategory !== "All" && tx.category !== filterCategory)
          return false;

        if (filterDate === "Today") {
          const today = new Date().toISOString().slice(0, 10);
          return tx.date === today;
        }

        if (filterDate === "Month") {
          const now = new Date();
          const d = new Date(tx.date);
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        }

        return true;
      })
      .sort((a, b) => {
        const A = sortKey === "date" ? new Date(a.date) : a.amount;
        const B = sortKey === "date" ? new Date(b.date) : b.amount;
        return sortOrder === "asc" ? (A > B ? 1 : -1) : (B > A ? 1 : -1);
      });
  }, [expenses, filterCategory, filterDate, sortKey, sortOrder]);

  const totalPages = Math.ceil(processedExpenses.length / PAGE_SIZE);

  const paginatedExpenses = processedExpenses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const visiblePages = useMemo(() => {
    if (totalPages <= 5) return [...Array(totalPages)].map((_, i) => i + 1);

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);

    if (end - start < 4) start = Math.max(1, end - 4);

    return [...Array(end - start + 1)].map((_, i) => start + i);
  }, [currentPage, totalPages]);

  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      bg={cardBg}
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
        >
          Your Transactions
        </MotionHeading>

        <HStack spacing={3}>
          <MotionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            colorScheme="teal"
            rounded="full"
            size="md"
            leftIcon={<AddIcon />}
            onClick={() => {
              setEditingTx(null);
              onOpen();
            }}
            boxShadow="lg"
          >
            Add Transaction
          </MotionButton>

          <IconButton
            icon={<RepeatIcon />}
            aria-label="Refresh"
            variant="outline"
            size="sm"
            onClick={fetchExpenses}
            isLoading={loading}
          />
        </HStack>
      </HStack>

      {/* Filters */}
      <Flex direction={{ base: "column", md: "row" }} gap={4} mb={6}>
        <MotionFlex
          flex={1}
          bg="gray.50"
          p={5}
          borderRadius="xl"
          boxShadow="md"
        >
          <VStack spacing={4} w="full">
            <Text fontWeight="medium" alignSelf="start">
              Filters
            </Text>

            {/* ✅ UPDATED CATEGORY FILTER */}
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              bg="white"
              borderRadius="lg"
            >
              <option value="All">All Categories</option>

              <optgroup label="Expenses">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>

              <optgroup label="Income">
                {INCOME_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </optgroup>
            </Select>

            <Select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              bg="white"
              borderRadius="lg"
            >
              <option value="All">All Dates</option>
              <option value="Today">Today</option>
              <option value="Month">This Month</option>
            </Select>
          </VStack>
        </MotionFlex>

        {/* Sort */}
        <MotionFlex
          flex={1}
          bg="gray.50"
          p={5}
          borderRadius="xl"
          boxShadow="md"
        >
          <VStack spacing={4} w="full">
            <Text fontWeight="medium" alignSelf="start">
              Sort By
            </Text>

            <Select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              bg="white"
              borderRadius="lg"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </Select>

            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              bg="white"
              borderRadius="lg"
            >
              <option value="desc">Newest / Highest First</option>
              <option value="asc">Oldest / Lowest First</option>
            </Select>
          </VStack>
        </MotionFlex>
      </Flex>

      {/* List */}
      <Box flex="1" overflowY="auto" pr={2} pb={4}>
        {loading ? (
          <Center h="full">
            <Spinner size="xl" color="teal.500" />
          </Center>
        ) : error ? (
          <Text color="red.500" textAlign="center">
            {error}
          </Text>
        ) : paginatedExpenses.length === 0 ? (
          <MotionText textAlign="center" color="gray.500" mt={10}>
            No transactions found matching your filters.
          </MotionText>
        ) : (
          <AnimatePresence>
            <MotionVStack spacing={4} align="stretch">
              {paginatedExpenses.map((tx, index) => (
                <MotionBox
                  key={tx.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TransactionCard
                    tx={tx}
                    onEdit={() => {
                      setEditingTx(tx);
                      onOpen();
                    }}
                    onDelete={() => handleDelete(tx.id)}
                  />
                </MotionBox>
              ))}
            </MotionVStack>
          </AnimatePresence>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && (
        <HStack justify="center" spacing={2} pt={4}>
          {visiblePages.map((p) => (
            <MotionButton
              key={p}
              bg={p === currentPage ? "teal.500" : "gray.200"}
              color={p === currentPage ? "white" : "gray.800"}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </MotionButton>
          ))}
        </HStack>
      )}

      <AddEditTransactionModal
        isOpen={isOpen}
        onClose={() => {
          setEditingTx(null);
          onClose();
        }}
        onSave={editingTx ? handleUpdate : handleAdd}
        initialData={editingTx}
      />
    </MotionBox>
  );
}
