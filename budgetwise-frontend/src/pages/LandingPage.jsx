// LandingPage.jsx – Expanded, milestone-aligned, production-ready
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Divider,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const LandingPage = () => {
  return (
    <Box minH="100vh" bg="gray.50">
      <PublicHeader />

      {/* ================= HERO ================= */}
      <MotionFlex
        px={{ base: 6, md: 16 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
        gap={16}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <VStack align="start" spacing={6} maxW="580px">
          <Heading size="xl" color="gray.800" lineHeight="1.2">
            Manage your expenses.
            <br />
            Understand your spending.
          </Heading>

          <Text fontSize="lg" color="gray.600" lineHeight="1.8">
            BudgetWise is a personal finance management application designed to
            help users record daily expenses, plan budgets, track savings goals,
            and visualize spending patterns over time.
          </Text>

          <Flex gap={4} pt={4}>
            <Button
              as={RouterLink}
              to="/register"
              colorScheme="teal"
              size="lg"
              rounded="full"
              px={10}
              fontWeight="semibold"
              boxShadow="lg"
              _hover={{ boxShadow: "xl", transform: "translateY(-2px)" }}
            >
              Get Started
            </Button>

            <Button
              as={RouterLink}
              to="/login"
              variant="ghost"
              size="lg"
              rounded="full"
              color="teal.600"
              fontWeight="semibold"
            >
              Sign In
            </Button>
          </Flex>
        </VStack>

        {/* Dashboard Preview */}
        <MotionBox
          w={{ base: "100%", md: "520px" }}
          borderRadius="2xl"
          boxShadow="lg"
          overflow="hidden"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src="/screenshots/dashboard-overview.png"
            alt="Dashboard Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </MotionBox>

      </MotionFlex>

      {/* ================= FEATURE OVERVIEW ================= */}
      <Box bg="white" py={16} px={{ base: 6, md: 16 }}>
        <VStack spacing={10} maxW="900px" mx="auto">
          <Heading size="lg" color="gray.800">
            Core Features
          </Heading>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <Box>
              <Heading size="md" mb={2} color="gray.800">
                Secure Authentication
              </Heading>
              <Text color="gray.600">
                User registration and login with protected access to personal
                financial data.
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2} color="gray.800">
                Expense Tracking
              </Heading>
              <Text color="gray.600">
                Log daily expenses with category-based organization and full
                history access.
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2} color="gray.800">
                Budgets & Savings
              </Heading>
              <Text color="gray.600">
                Define monthly budgets and savings goals and track progress in
                real time.
              </Text>
            </Box>
          </SimpleGrid>
        </VStack>
      </Box>

      {/* ================= DETAILED FEATURES ================= */}
      <VStack px={{ base: 6, md: 16 }} py={24} spacing={20}>
        {/* Expense Tracking */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          gap={14}
          maxW="960px"
        >
          <Box
            w="340px"
            h="220px"
            bg="white"
            borderRadius="2xl"
            boxShadow="lg"
            display="flex"
            alignItems="center"
            overflow="hidden"
            justifyContent="center"
            color="gray.400"
            fontSize="sm"
          >
            <img
              src="/screenshots/transactions-panel.png"
              alt="Transactions"
              style={{ width: "100%", height: "100%", objectFit: "cover"}}
            />

          </Box>

          <Box maxW="460px">
            <Heading size="lg" mb={4} color="gray.800">
              Track expenses without friction
            </Heading>
            <Text color="gray.600" lineHeight="1.8">
              BudgetWise allows users to quickly record daily expenses through
              simple input forms. Each transaction can be assigned to a category
              such as Food, Rent, Travel, or Utilities, creating a structured and
              searchable financial history.
            </Text>
            <Text mt={3} color="gray.600" lineHeight="1.8">
              Users can edit or delete transactions at any time, ensuring data
              accuracy and eliminating the need for manual spreadsheets.
            </Text>
          </Box>
        </Flex>

        {/* Budgets & Savings */}
        <Flex
          direction={{ base: "column", md: "row-reverse" }}
          align="center"
          gap={14}
          maxW="960px"
        >
          <Box
            w="340px"
            h="220px"
            bg="white"
            borderRadius="2xl"
            boxShadow="lg"
            display="flex"
            overflow="hidden"
            alignItems="center"
            justifyContent="center"
            color="gray.400"
            fontSize="sm"
          >
              <img
                src="/screenshots/budget-panel.png"
                alt="Budget Overview"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />

          </Box>

          <Box maxW="460px">
            <Heading size="lg" mb={4} color="gray.800">
              Plan budgets and savings goals
            </Heading>
            <Text color="gray.600" lineHeight="1.8">
              Users can define monthly budgets at an overall level or by category.
              The system automatically tracks spending against these limits and
              shows remaining budget amounts.
            </Text>
            <Text mt={3} color="gray.600" lineHeight="1.8">
              Savings goals can also be created with target amounts and deadlines,
              helping users build consistent saving habits over time.
            </Text>
          </Box>
        </Flex>

        {/* Visualization & Smart Insights */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          gap={14}
          maxW="960px"
        >
          <Box
            w="340px"
            h="220px"
            bg="white"
            borderRadius="2xl"
            boxShadow="lg"
            overflow="hidden"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="gray.400"
            fontSize="sm"
          >
            <img
              src="/screenshots/insights-panel.png"
              alt="Insights & Predictions"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

          </Box>

          <Box maxW="460px">
            <Heading size="lg" mb={4} color="gray.800">
              Visual insights and smart suggestions
            </Heading>
            <Text color="gray.600" lineHeight="1.8">
              BudgetWise provides visual representations such as category-wise
              pie charts and stacked bar charts to help users understand where
              money is being spent.
            </Text>
            <Text mt={3} color="gray.600" lineHeight="1.8">
              Based on spending patterns, the application can generate frontend-based smart insights, 
              alerts, and next-month spending predictions
            </Text>
          </Box>
        </Flex>
      </VStack>

      {/* ================= CTA ================= */}
      <Box bg="teal.50" py={20} px={{ base: 6, md: 16 }}>
        <VStack spacing={6} maxW="600px" mx="auto" textAlign="center">
          <Heading size="lg" color="gray.800">
            Take control of your financial habits
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Start tracking expenses, managing budgets, and understanding your
            spending with BudgetWise.
          </Text>
          <Button
            as={RouterLink}
            to="/register"
            colorScheme="teal"
            size="lg"
            rounded="full"
            px={12}
            fontWeight="semibold"
            boxShadow="lg"
          >
            Create Your Account
          </Button>
        </VStack>
      </Box>

      <Divider />

      {/* ================= FOOTER ================= */}
      <Box py={8} textAlign="center" color="gray.500" fontSize="sm">
        © {new Date().getFullYear()} BudgetWise. All rights reserved.
      </Box>
    </Box>
  );
};

export default LandingPage;
