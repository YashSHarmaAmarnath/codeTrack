import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Trophy,
  Target,
  BarChart3,
  TrendingUp,
  Award,
  Users,
  User,
} from "lucide-react";
import axios from "axios";
Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const Leetcode = () => {
  const [data, setData] = useState({
    contestRanking: {
      attendedContestsCount: 0,
      rating: 0,
      globalRanking: 0,
      totalParticipants: 0,
      topPercentage: 0,
      badge: { name: "none" },
    },
    publicProfileRanking: 0,
    submissionStats: [
      { difficulty: "Easy", count: 0, submissions: 0 },
      { difficulty: "Medium", count: 0, submissions: 0 },
      { difficulty: "Hard", count: 0, submissions: 0 },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/profile/leetcode",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching LeetCode data:", err);
        setError(
          err.response ? err.response.data.detail : "Error fetching data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Mock data loading for demo
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 font-medium">Loading LeetCode data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-100">
          <div className="text-red-500 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const { contestRanking, publicProfileRanking, submissionStats } = data || {};

  // Chart configurations with improved styling
  const rankingData = contestRanking
    ? {
        labels: ["Your Ranking", "Total Participants"],
        datasets: [
          {
            label: "Count",
            data: [
              contestRanking.globalRanking || 0,
              contestRanking.totalParticipants || 0,
            ],
            backgroundColor: ["#3B82F6", "#E5E7EB"],
            borderColor: ["#2563EB", "#D1D5DB"],
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      }
    : null;

  const gaugeData = contestRanking
    ? {
        labels: [`Top ${contestRanking.topPercentage}%`, "Others"],
        datasets: [
          {
            data: [
              contestRanking.topPercentage || 0,
              100 - (contestRanking.topPercentage || 0),
            ],
            backgroundColor: ["#10B981", "#F3F4F6"],
            borderColor: ["#059669", "#E5E7EB"],
            borderWidth: 3,
          },
        ],
      }
    : null;

  let profileData = null;
  if (
    contestRanking &&
    contestRanking.totalParticipants &&
    publicProfileRanking !== undefined
  ) {
    const profilePercentage =
      ((contestRanking.totalParticipants - publicProfileRanking) /
        contestRanking.totalParticipants) *
      100;
    profileData = {
      labels: ["Better Than", "Remaining"],
      datasets: [
        {
          data: [profilePercentage, 100 - profilePercentage],
          backgroundColor: ["#8B5CF6", "#F3F4F6"],
          borderColor: ["#7C3AED", "#E5E7EB"],
          borderWidth: 3,
        },
      ],
    };
  }

  const submissionData = submissionStats
    ? {
        labels: submissionStats.map((stat) => stat.difficulty),
        datasets: [
          {
            label: "Accepted",
            data: submissionStats.map((stat) => stat.count || 0),
            backgroundColor: "#10B981",
            borderColor: "#059669",
            borderWidth: 2,
            borderRadius: 6,
          },
          {
            label: "Failed",
            data: submissionStats.map(
              (stat) => (stat.submissions || 0) - (stat.count || 0)
            ),
            backgroundColor: "#EF4444",
            borderColor: "#DC2626",
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: { size: 12, weight: "500" },
          color: "#374151",
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        grid: { color: "#F3F4F6" },
        ticks: { color: "#6B7280", font: { size: 11 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6B7280", font: { size: 11 } },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          font: { size: 12, weight: "500" },
          color: "#374151",
        },
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F9FAFB",
        bodyColor: "#F9FAFB",
        borderColor: "#374151",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
  };

  const questionCountData = {
    labels: submissionStats.map((stat) => stat.difficulty),
    datasets: [
      {
        label: "Questions Solved",
        data: submissionStats.map((stat) =>  stat.count),
        backgroundColor:["#3B82F6" ,"#34D399", "#FBBF24", "#F87171"],
        borderColor: ["#3B82F6" ,"#34D399", "#FBBF24", "#F87171"],
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600 text-blue-600",
      green: "from-green-500 to-green-600 text-green-600",
      purple: "from-purple-500 to-purple-600 text-purple-600",
      orange: "from-orange-500 to-orange-600 text-orange-600",
    };

    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div
                className={`p-2 rounded-xl bg-gradient-to-r ${colorClasses[color]} bg-opacity-10`}
              >
                <Icon
                  className={`w-5 h-5 ${colorClasses[color].split(" ")[2]}`}
                />
              </div>
              <h3 className="text-slate-600 font-medium text-sm">{title}</h3>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-800">{value}</p>
              {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                LeetCode Dashboard
              </h1>
              <p className="text-slate-600">
                Track your coding progress and achievements
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-lime-500 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {data.username || "leetCode User"}
                </h1>
                  <a href= {`https://leetcode.com/u/${data.username}`} target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:underline">
                  <p className="text-orange-100">LeetCode Profile 🔗</p>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {contestRanking && (
            <>
              <StatCard
                icon={Award}
                title="Contest Rating"
                value={contestRanking.rating.toFixed(0)}
                subtitle={contestRanking.badge?.name || "No badge"}
                color="blue"
              />
              <StatCard
                icon={Users}
                title="Global Ranking"
                value={`#${contestRanking.globalRanking.toLocaleString()}`}
                subtitle={`Top ${contestRanking.topPercentage}%`}
                color="green"
              />
              <StatCard
                icon={Target}
                title="Contests Attended"
                value={contestRanking.attendedContestsCount}
                subtitle="Total competitions"
                color="purple"
              />
            </>
          )}
          <StatCard
            icon={TrendingUp}
            title="Profile Ranking"
            value={`#${publicProfileRanking?.toLocaleString() || "N/A"}`}
            subtitle="Public ranking"
            color="orange"
          />
        </div>
          {questionCountData && (<div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <BarChart3 className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-semibold text-slate-800">
                Question Count by Difficulty
              </h2>
            </div>
            <div className="h-64">
              <Bar data={questionCountData} options={chartOptions} />
            </div>
          </div>)}
        {/* Detailed Stats Table */}
        {submissionStats && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">
              Problem Solving Breakdown
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Difficulty
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Solved
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Attempted
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Success Rate
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Success Rate Bar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissionStats.map((stat, index) => {
                    const successRate = (
                      (stat.count / stat.submissions) *
                      100
                    ).toFixed(1);
                    const difficultyColors = {
                      Easy: "text-green-600 bg-green-50",
                      Medium: "text-yellow-600 bg-yellow-50",
                      Hard: "text-red-600 bg-red-50",
                    };

                    return (
                      <tr
                        key={index}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              difficultyColors[stat.difficulty] ||
                              "text-slate-600 bg-slate-50"
                            }`}
                          >
                            {stat.difficulty}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-800">
                          {stat.count}
                        </td>
                        <td className="py-4 px-4 text-slate-600">
                          {stat.submissions}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`font-medium ${
                              difficultyColors[stat.difficulty]
                            }`}
                          >
                            {successRate}%
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                successRate >= 70
                                  ? "bg-green-500"
                                  : successRate >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${successRate}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contest Ranking Chart */}
          {rankingData && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Contest Performance
                </h2>
              </div>
              <div className="h-64">
                <Bar data={rankingData} options={chartOptions} />
              </div>
            </div>
          )}

          {/* Top Percentage Gauge */}
          {gaugeData && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center space-x-3 mb-6">
                <Target className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Percentile Rank
                </h2>
              </div>
              <div className="h-64">
                <Doughnut data={gaugeData} options={doughnutOptions} />
              </div>
            </div>
          )}

          {/* Profile Progress */}
          {profileData && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Profile Progress
                </h2>
              </div>
              <div className="h-64">
                <Doughnut data={profileData} options={doughnutOptions} />
              </div>
            </div>
          )}

          {/* Submission Stats */}
          {submissionData && (
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
              <div className="flex items-center space-x-3 mb-6">
                <BarChart3 className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Submission Statistics
                </h2>
              </div>
              <div className="h-64">
                <Bar data={submissionData} options={chartOptions} />
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default Leetcode;

