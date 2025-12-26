import AppHeader from "../components/AppHeader";
import TransactionsPanel from "../components/transactions/TransactionsPanel";
import SavingsPanel from "../components/savings/SavingsGoalsPanel";
import BudgetPanel from "../components/budget/BudgetPanel";
import InsightsPanel from "../components/insights/InsightsPanel";
import { Box, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function Dashboard() {
  return (
    <Box minH="100vh" bg="gray.50">
      <AppHeader isAuthenticated />

      {/* Reduced side padding to make it feel more filled */}
      <Box px={{ base: 4, md: 6, lg: 8 }} py={8}>
        {/* TOP SECTION: Transactions + Savings */}
        <Flex 
          direction={{ base: "column", lg: "row" }} 
          gap={8} 
          mb={12} 
          align="stretch"
        >
          {/* LEFT: Transactions (~65% on desktop) */}
          <MotionBox
            flex={{ base: "1", lg: "7" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <TransactionsPanel />
          </MotionBox>

          {/* RIGHT: Savings (~35% on desktop) */}
          <MotionBox
            flex={{ base: "1", lg: "5" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SavingsPanel />
          </MotionBox>
        </Flex>

        {/* BOTTOM SECTION: Budget - Full width with good separation */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <BudgetPanel />
        </MotionBox>

                <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <InsightsPanel />
        </MotionBox>
      </Box>
    </Box>
  );
}