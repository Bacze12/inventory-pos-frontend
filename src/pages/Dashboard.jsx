import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Center,
  useColorModeValue,
  StatArrow,
  Stack,
} from '@chakra-ui/react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import CollapsibleSidebar from '../components/layout/CollapsibleSidebar';
import  Navbar  from '../components/layout/Navbar';
import API from '../api/api';
import * as Sentry from '@sentry/react';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({});
  const [recentSales, setRecentSales] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [dailySalesData, setDailySalesData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [salesResponse, productsResponse, usersResponse] = await Promise.all([
          API.get('/sales'),
          API.get('/products'),
          API.get('/users'),
        ]);

        const totalSalesCount = salesResponse.data.length;
        const totalProductsSold = salesResponse.data.reduce((acc, sale) => acc + sale.items.reduce((sum, item) => sum + item.quantity, 0), 0);
        const totalRevenue = salesResponse.data.reduce((acc, sale) => acc + sale.total, 0);

        setStats({
          totalSalesCount,
          totalProductsSold,
          totalRevenue,
          salesGrowth: 10, // Ejemplo de crecimiento de ventas
        });

        setRecentSales(salesResponse.data.slice(0, 5)); // Últimas 5 ventas

        const dailySales = salesResponse.data.reduce((acc, sale) => {
          const date = new Date(sale.createdAt).toLocaleDateString();
          if (!acc[date]) acc[date] = 0;
          acc[date] += sale.total;
          return acc;
        }, {});

        setDailySalesData({
          labels: Object.keys(dailySales),
          datasets: [
            {
              label: 'Ventas Diarias',
              data: Object.values(dailySales),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });

        setChartData({
          labels: Object.keys(dailySales),
          datasets: [
            {
              label: 'Ventas Diarias',
              data: Object.values(dailySales),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        Sentry.captureException(new Error('Error fetching dashboard data:', error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const dailySalesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Ventas Diarias',
      },
    },
  };

  const bgColor = useColorModeValue('white', 'gray.800');

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box bg="gray.50" minH="100vh">
      <Navbar onMenuClick={toggleSidebar} />
      <Flex>
        <CollapsibleSidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
        <Box flex="1" ml={isSidebarOpen ? '0px' : '0px'} p={6}>
          <Heading size="lg" mb={6}>
            Dashboard
          </Heading>

          {/* Statistics Section */}
          <SimpleGrid columns={[1, 2, 4]} spacing={6} mb={8}>
            <Stat bg={bgColor} p={4} shadow="sm" borderRadius="lg">
              <StatLabel>Total de Ventas</StatLabel>
              <StatNumber>{stats.totalSalesCount}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" /> {stats.salesGrowth}%
              </StatHelpText>
            </Stat>
            <Stat bg={bgColor} p={4} shadow="sm" borderRadius="lg">
              <StatLabel>Productos Vendidos</StatLabel>
              <StatNumber>{stats.totalProductsSold}</StatNumber>
            </Stat>
            <Stat bg={bgColor} p={4} shadow="sm" borderRadius="lg">
              <StatLabel>Ingresos Totales</StatLabel>
              <StatNumber>${stats.totalRevenue.toLocaleString('es-CL')}</StatNumber>
            </Stat>
          </SimpleGrid>

          {/* Sales Chart */}
          <SimpleGrid columns={[1, 2]} spacing={8} mb={6}>
              <Stack spacing={4}>
                    <Box mb={8} bg={bgColor} p={6} borderRadius="lg" shadow="sm" maxW="800px">
                        <Heading size="md" mb={4}>
                        Historial de Ventas
                        </Heading>
                        {chartData && <Line data={chartData} options={chartOptions} />}
                    </Box>
              </Stack>
              <Stack spacing={4}>
              <Box mb={8} bg={bgColor} p={6} borderRadius="lg" shadow="sm" maxW="800px">
                    <Heading size="md" mb={4}>
                    Ventas Diarias
                    </Heading>
                    {dailySalesData && <Bar data={dailySalesData} options={dailySalesChartOptions} />}
                </Box>
              </Stack>
            </SimpleGrid>

          {/* Recent Sales Table */}
          <Box bg={bgColor} p={6} borderRadius="lg" shadow="sm">
            <Heading size="md" mb={4}>
              Ventas Recientes
            </Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Cliente</Th>
                  <Th>Fecha</Th>
                  <Th isNumeric>Total</Th>
                </Tr>
              </Thead>
              <Tbody>
                {recentSales.map((sale) => (
                  <Tr key={sale.id}>
                    <Td>{sale.id}</Td>
                    <Td>{sale.customerName}</Td>
                    <Td>{new Date(sale.createdAt).toLocaleDateString()}</Td>
                    <Td isNumeric>${sale.total.toLocaleString('es-CL')}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default DashboardPage;