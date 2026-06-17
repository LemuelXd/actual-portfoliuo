import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Flame,
  Activity,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Target,
  Dumbbell,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface Workout {
  id: string;
  name: string;
  duration: number;
  calories: number;
  date: string;
  category: string;
}

interface DailyStats {
  date: string;
  calories: number;
  duration: number;
}

const workoutCategories = [
  { name: 'Cardio', color: '#06b6d4' },
  { name: 'Strength', color: '#3b82f6' },
  { name: 'Flexibility', color: '#8b5cf6' },
  { name: 'Sports', color: '#10b981' },
  { name: 'Other', color: '#f59e0b' },
];

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

export default function FitnessTracker() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    duration: '',
    calories: '',
    category: 'Cardio',
  });
  const [dailyGoal, setDailyGoal] = useState(500);
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Load workouts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fitnessWorkouts');
    if (saved) {
      setWorkouts(JSON.parse(saved));
    }
    const savedGoal = localStorage.getItem('fitnessDailyGoal');
    if (savedGoal) {
      setDailyGoal(parseInt(savedGoal, 10));
    }
  }, []);

  // Save workouts to localStorage
  useEffect(() => {
    localStorage.setItem('fitnessWorkouts', JSON.stringify(workouts));
  }, [workouts]);

  // Save goal to localStorage
  useEffect(() => {
    localStorage.setItem('fitnessDailyGoal', dailyGoal.toString());
  }, [dailyGoal]);

  const addWorkout = useCallback(() => {
    if (!newWorkout.name || !newWorkout.duration || !newWorkout.calories) return;

    const workout: Workout = {
      id: Date.now().toString(),
      name: newWorkout.name,
      duration: parseInt(newWorkout.duration, 10),
      calories: parseInt(newWorkout.calories, 10),
      date: new Date().toISOString(),
      category: newWorkout.category,
    };

    setWorkouts((prev) => [workout, ...prev]);
    setNewWorkout({ name: '', duration: '', calories: '', category: 'Cardio' });
    setShowAddModal(false);
  }, [newWorkout]);

  const deleteWorkout = useCallback((id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }, []);

  // Calculate stats
  const totalWorkouts = workouts.length;
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);

  // Today's stats
  const today = new Date().toDateString();
  const todayWorkouts = workouts.filter(
    (w) => new Date(w.date).toDateString() === today
  );
  const todayCalories = todayWorkouts.reduce((sum, w) => sum + w.calories, 0);
  const todayDuration = todayWorkouts.reduce((sum, w) => sum + w.duration, 0);
  const goalProgress = Math.min((todayCalories / dailyGoal) * 100, 100);

  // Weekly stats for chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  }).reverse();

  const weeklyData: DailyStats[] = last7Days.map((dateStr) => {
    const dayWorkouts = workouts.filter(
      (w) => new Date(w.date).toDateString() === dateStr
    );
    return {
      date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
      calories: dayWorkouts.reduce((sum, w) => sum + w.calories, 0),
      duration: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
    };
  });

  // Category breakdown for pie chart
  const categoryData = workoutCategories
    .map((cat) => ({
      name: cat.name,
      value: workouts.filter((w) => w.category === cat.name).length,
      color: cat.color,
    }))
    .filter((c) => c.value > 0);

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
                  <span className="text-white">Fitness </span>
                  <span className="gradient-text">Tracker</span>
                </h1>
                <p className="text-gray-400 mt-2">
                  Track your workouts, monitor calories, and achieve your fitness goals.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="glow-button px-6 py-3 rounded-xl text-black font-semibold flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Workout
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: Flame,
                label: "Today's Calories",
                value: todayCalories.toLocaleString(),
                subtext: `Goal: ${dailyGoal}`,
                color: 'text-orange-400',
              },
              {
                icon: Activity,
                label: "Today's Duration",
                value: `${todayDuration} min`,
                subtext: 'Keep it up!',
                color: 'text-cyan-400',
              },
              {
                icon: Dumbbell,
                label: 'Total Workouts',
                value: totalWorkouts.toString(),
                subtext: 'All time',
                color: 'text-purple-400',
              },
              {
                icon: TrendingUp,
                label: 'Total Calories',
                value: totalCalories.toLocaleString(),
                subtext: 'All time',
                color: 'text-green-400',
              },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <span className="text-sm text-gray-500">{stat.label}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500">{stat.subtext}</div>
              </div>
            ))}
          </motion.div>

          {/* Goal Progress */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-semibold">Daily Calorie Goal</span>
                </div>
                <button
                  onClick={() => setShowGoalModal(true)}
                  className="text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Edit Goal
                </button>
              </div>
              <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${goalProgress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, #06b6d4, #3b82f6)`,
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.5)',
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-400">{todayCalories} / {dailyGoal} cal</span>
                <span className="text-cyan-400">{Math.round(goalProgress)}%</span>
              </div>
            </div>
          </motion.div>

          {/* Charts */}
          <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Weekly Calories Chart */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Weekly Calories</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="calories" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Workout Categories</h3>
              <div className="h-64">
                {categoryData.length > 0 ? (
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
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No workout data yet
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-1 text-xs">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="text-gray-400">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Workouts */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-semibold text-white mb-4">Recent Workouts</h3>
            <div className="space-y-3">
              <AnimatePresence>
                {workouts.length > 0 ? (
                  workouts.slice(0, 10).map((workout) => (
                    <motion.div
                      key={workout.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="glass-card p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                          <Dumbbell className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">{workout.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-white/5 text-xs">
                              {workout.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(workout.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-cyan-400 font-semibold">
                            {workout.calories} cal
                          </div>
                          <div className="text-sm text-gray-500">
                            {workout.duration} min
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteWorkout(workout.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 glass-card">
                    <Dumbbell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No workouts yet
                    </h3>
                    <p className="text-gray-400">
                      Add your first workout to start tracking your fitness journey!
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Add Workout Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card-strong w-full max-w-md p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Add Workout</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Workout Name</label>
                  <input
                    type="text"
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                    placeholder="e.g., Morning Run"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      value={newWorkout.duration}
                      onChange={(e) =>
                        setNewWorkout({ ...newWorkout, duration: e.target.value })
                      }
                      placeholder="30"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Calories
                    </label>
                    <input
                      type="number"
                      value={newWorkout.calories}
                      onChange={(e) =>
                        setNewWorkout({ ...newWorkout, calories: e.target.value })
                      }
                      placeholder="300"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Category</label>
                  <select
                    value={newWorkout.category}
                    onChange={(e) =>
                      setNewWorkout({ ...newWorkout, category: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    {workoutCategories.map((cat) => (
                      <option key={cat.name} value={cat.name} className="bg-gray-900">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addWorkout}
                  disabled={!newWorkout.name || !newWorkout.duration || !newWorkout.calories}
                  className="flex-1 px-4 py-3 rounded-xl bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition-colors disabled:opacity-50"
                >
                  Add Workout
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Goal Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card-strong w-full max-w-sm p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Set Daily Goal</h2>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Daily Calorie Goal
                </label>
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-cyan-500 text-black font-medium hover:bg-cyan-400 transition-colors"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
