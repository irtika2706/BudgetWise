import { Box, Text } from "@chakra-ui/react";

const Layout = ({ children }) => {
  return (
    <Box
      minH="100vh"
      bg="gray.100"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        width="900px"
        bg="white"
        border="1px solid black"
        borderRadius="lg"
        boxShadow="lg"
      >
        {/* Top gold strip */}
        <Box bg="goldenrod" p={6}>
          <Text fontSize="xl" fontWeight="bold" color="black">
            Welcome
          </Text>
          <Text fontSize="lg" color="gray.700">
            BudgetWise
          </Text>
        </Box>

        {/* Page content */}
        <Box p={8}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
