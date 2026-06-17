import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  Calendar,
  RefreshCw,
  Download,
  Filter,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

// Sample data generators
const generateRevenueData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month) => ({
    name: month,
    revenue: Math.floor(Math.random() * 50000) + 30000,
    target: Math.floor(Math.random() * 10000) + 40000,
  }));
};

const generateDailySales = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    name: day,
    sales: Math.floor(Math.random() * 200) + 100,
    orders: Math.floor(Math.random() * 50) + 20,
  }));
};

const generateCategoryData = () => [
  { name: 'Electronics', value: 35, color: '#06b6d4' },
  { name: 'Clothing', value: 25, color: '#3b82f6' },
  { name: 'Food', value: 20, color: '#8b5cf6' },
  { name: 'Home', value: 15, color: '#10b981' },
  { name: 'Other', value: 5, color: '#f59e0b' },
];

const generateRecentOrders = () => {
  const customers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Tom Brown', 'Emily Davis'];
  const products = ['Laptop Pro', 'Wireless Headphones', 'Smart Watch', 'Running Shoes', 'Coffee Maker', 'Backpack'];
  const statuses = ['Completed', 'Processing', 'Pending', 'Shipped'];
  
  return Array.from({ length: 10 }, (_, i) => ({
    id: `#ORD-${1000 + i}`,
    customer: customers[Math.floor(Math.random() * customers.length)],
    product: products[Math.floor(Math.random() * products.length)],
    amount: Math.floor(Math.random() * 500) + 50,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
  }));
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
    },
  },
};

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ElementType;
  color: string;
}

function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  const isPositive = change >= 0;
  
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-white">{value}</h3>
          <div className={`flex items-center gap-1 mt-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span className="text-sm font-medium">{Math.abs(change)}%</span>
            <span className="text-gray-500 text-sm">vs last month</span>
          </div>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </motion.div>
  );
}

export default function AnalyticsDashboard() {
  const [revenueData, setRevenueData] = useState(generateRevenueData());
  const [dailySales, setDailySales] = useState(generateDailySales());
  const [categoryData, setCategoryData] = useState(generateCategoryData());
  const [recentOrders, setRecentOrders] = useState(generateRecentOrders());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('7d');
  const [liveMetrics, setLiveMetrics] = useState({
    revenue: 124500,
    users: 8420,
    orders: 1256,
    conversion: 3.2,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics((prev) => ({
        revenue: prev.revenue + Math.floor(Math.random() * 100) - 50,
        users: prev.users + Math.floor(Math.random() * 10) - 5,
        orders: prev.orders + Math.floor(Math.random() * 5) - 2,
        conversion: Math.max(0, prev.conversion + (Math.random() * 0.2 - 0.1)),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRevenueData(generateRevenueData());
      setDailySales(generateDailySales());
      setCategoryData(generateCategoryData());
      setRecentOrders(generateRecentOrders());
      setIsRefreshing(false);
    }, 1000);
  }, []);

  const exportData = useCallback(() => {
    const data = {
      revenue: revenueData,
      sales: dailySales,
      categories: categoryData,
      orders: recentOrders,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [revenueData, dailySales, categoryData, recentOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-400 bg-green-400/10';
      case 'Processing':
        return 'text-blue-400 bg-blue-400/10';
      case 'Pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'Shipped':
        return 'text-purple-400 bg-purple-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 tech-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  <span className="text-white">Analytics </span>
                  <span className="gradient-text">Dashboard</span>
                </h1>
                <p className="text-gray-400 mt-2">
                  Real-time business insights and performance metrics.
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={refreshData}
                  disabled={isRefreshing}
                  className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-cyan-400 hover:bg-white/10 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={exportData}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Date Range Filter */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex items-center gap-2 glass-card p-2 w-fit">
              <Filter className="w-4 h-4 text-gray-400 ml-2" />
              {['24h', '7d', '30d', '90d'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-cyan-500 text-black'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {range === '24h' ? 'Last 24 Hours' : `Last ${range}`}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Metrics Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              title="Total Revenue"
              value={`$${liveMetrics.revenue.toLocaleString()}`}
              change={12.5}
              icon={DollarSign}
              color="#06b6d4"
            />
            <MetricCard
              title="Active Users"
              value={liveMetrics.users.toLocaleString()}
              change={8.2}
              icon={Users}
              color="#3b82f6"
            />
            <MetricCard
              title="Total Orders"
              value={liveMetrics.orders.toLocaleString()}
              change={-2.4}
              icon={ShoppingCart}
              color="#8b5cf6"
            />
            <MetricCard
              title="Conversion Rate"
              value={`${liveMetrics.conversion.toFixed(1)}%`}
              change={5.7}
              icon={Activity}
              color="#10b981"
            />
          </motion.div>

          {/* Charts Row 1 */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue Chart */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  This Year
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#06b6d4"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#f59e0b"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Sales Chart */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Daily Sales</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  This Week
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="sales" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Charts Row 2 */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Category Distribution */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Sales by Category</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Percentage']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-gray-400">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="glass-card p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-6">Traffic Sources</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Direct', value: 35, color: '#06b6d4' },
                      { name: 'Social', value: 25, color: '#3b82f6' },
                      { name: 'Organic', value: 20, color: '#8b5cf6' },
                      { name: 'Referral', value: 15, color: '#10b981' },
                      { name: 'Email', value: 5, color: '#f59e0b' },
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                    <XAxis type="number" stroke="#6b7280" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={12} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${value}%`, 'Traffic']}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {[
                        { color: '#06b6d4' },
                        { color: '#3b82f6' },
                        { color: '#8b5cf6' },
                        { color: '#10b981' },
                        { color: '#f59e0b' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Recent Orders Table */}
          <motion.div variants={itemVariants}>
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
                <button className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Order ID</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Product</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {recentOrders.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 px-4 text-cyan-400 font-mono text-sm">{order.id}</td>
                          <td className="py-3 px-4 text-white text-sm">{order.customer}</td>
                          <td className="py-3 px-4 text-gray-400 text-sm">{order.product}</td>
                          <td className="py-3 px-4 text-white font-medium text-sm">${order.amount}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400 text-sm">{order.date}</td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
