import React, { useEffect, useState, useRef } from "react";
import {
  User,
  Trophy,
  Star,
  Globe,
  Calendar,
  TrendingUp,
  Award,
  Activity,
  BarChart3,
} from "lucide-react";
import * as Chart from 'chart.js';
import axios from "axios";
import ActivityHeatmap from "./ActivityHeatmap";

export const Codechef = () =>  {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const token = localStorage.getItem("token");
  
  // Mock data for demonstration - replace with actual API call
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulating API call with mock data
        //  const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/profile/codeChef`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
        console.log(response.data);
      } catch (err) {
        console.error("Error fetching CodeChef data:", err);
        setError(err.response?.data?.detail || "Error fetching data");
      } finally {
        setLoading(false);
      }
      } catch (err) {
        console.error("Error fetching CodeChef data:", err);
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create Chart.js chart
  useEffect(() => {
    if (data && data.ratingData && chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      const chartData = data.ratingData.map((contest, index) => ({
        x: index + 1,
        y: parseInt(contest.rating),
        label: contest.name,
        date: `${contest.getday}/${contest.getmonth}/${contest.getyear}`,
        rank: contest.rank
      }));

      // Register Chart.js components
      Chart.Chart.register(
        Chart.CategoryScale,
        Chart.LinearScale,
        Chart.PointElement,
        Chart.LineElement,
        Chart.Title,
        Chart.Tooltip,
        Chart.Legend
      );

      chartInstance.current = new Chart.Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            label: 'Rating Progress',
            data: chartData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 3,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: false
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                title: function(context) {
                  const point = context[0];
                  return chartData[point.dataIndex].label;
                },
                label: function(context) {
                  const point = chartData[context.dataIndex];
                  return [
                    `Rating: ${point.y}`,
                    `Date: ${point.date}`,
                    `Rank: #${point.rank}`
                  ];
                }
              }
            }
          },
          scales: {
            x: {
              type: 'linear',
              title: {
                display: true,
                text: 'Contest Number'
              },
              ticks: {
                stepSize: 1,
                callback: function(value) {
                  return Math.floor(value) === value ? value : '';
                }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Rating'
              },
              beginAtZero: false
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  const getRatingColor = (rating) => {
    if (rating >= 2000) return "text-red-600";
    if (rating >= 1800) return "text-purple-600";
    if (rating >= 1600) return "text-blue-600";
    if (rating >= 1400) return "text-green-600";
    return "text-gray-600";
  };

  const getStarColor = (stars) => {
    const starCount = parseInt(stars);
    if (starCount >= 6) return "text-red-500";
    if (starCount >= 4) return "text-purple-500";
    if (starCount >= 2) return "text-blue-500";
    return "text-yellow-500";
  };

  // const getHeatMapIntensity = (value) => {
  //   if (value >= 15) return "bg-green-900";
  //   if (value >= 12) return "bg-green-700";
  //   if (value >= 8) return "bg-green-500";
  //   if (value >= 4) return "bg-green-300";
  //   if (value >= 1) return "bg-green-100";
  //   return "bg-gray-100";
  // };

  // const generateHeatMapGrid = () => {
  //   if (!data?.heatMap) return [];
    
  //   const today = new Date();
  //   const startDate = new Date(today);
  //   startDate.setDate(today.getDate() - 364);
    
  //   const heatMapData = {};
  //   data.heatMap.forEach(item => {
  //     heatMapData[item.date] = item.value;
  //   });
    
  //   const weeks = [];
  //   const currentDate = new Date(startDate);
    
  //   for (let week = 0; week < 52; week++) {
  //     const weekData = [];
  //     for (let day = 0; day < 7; day++) {
  //       const dateStr = currentDate.toISOString().split('T')[0];
  //       const value = heatMapData[dateStr] || 0;
  //       weekData.push({
  //         date: dateStr,
  //         value,
  //         day: currentDate.getDay()
  //       });
  //       currentDate.setDate(currentDate.getDate() + 1);
  //     }
  //     weeks.push(weekData);
  //   }
    
  //   return weeks;
  // };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="animate-pulse">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-lg p-6">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
              <div className="h-64 bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Data Found
          </h2>
          <p className="text-gray-600">No CodeChef profile data available.</p>
        </div>
      </div>
    );
  }

  // const heatMapWeeks = generateHeatMapGrid();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={data.profile} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <User className="w-8 h-8 hidden" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {data.name || "CodeChef User"}
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  {data.countryFlag && (
                    <img src={data.countryFlag} alt="Country" className="w-6 h-4" />
                  )}
                  <p className="text-orange-100">{data.countryName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Current Rating</p>
                <p className={`text-2xl font-bold ${getRatingColor(data.currentRating)}`}>
                  {data.currentRating || "N/A"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Highest: {data.highestRating || "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Global Rank</p>
                <p className="text-2xl font-bold text-purple-600">
                  #{data.globalRank || "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Country Rank</p>
                <p className="text-2xl font-bold text-green-600">
                  #{data.countryRank || "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Stars</p>
                <p className={`text-2xl font-bold ${getStarColor(data.stars)}`}>
                  {data.stars || "N/A"}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Rating Progress Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">Rating Progress</h2>
          </div>
          
          {data.ratingData && data.ratingData.length > 0 ? (
            <div className="h-80">
              <canvas ref={chartRef}></canvas>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No rating data available for chart
            </div>
          )}
        </div>

        {/* Activity Heatmap */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">Activity Heatmap</h2>
          </div>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="flex space-x-1">
                {heatMapWeeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col space-y-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`w-3 h-3 rounded-sm ${getHeatMapIntensity(day.value)} border border-gray-200`}
                        title={`${day.date}: ${day.value} contributions`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span>Less</span>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-gray-100 rounded-sm border border-gray-200"></div>
                  <div className="w-3 h-3 bg-green-100 rounded-sm border border-gray-200"></div>
                  <div className="w-3 h-3 bg-green-300 rounded-sm border border-gray-200"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-sm border border-gray-200"></div>
                  <div className="w-3 h-3 bg-green-700 rounded-sm border border-gray-200"></div>
                  <div className="w-3 h-3 bg-green-900 rounded-sm border border-gray-200"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        </div> */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
  <ActivityHeatmap heatMap={data.heatMap} />
  </div>
</div>


        {/* Contest History */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="w-6 h-6 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">Contest History</h2>
          </div>

          {data.ratingData && data.ratingData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Contest</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Division</th>
                  </tr>
                </thead>
                <tbody>
                  {data.ratingData.map((contest, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-800">{contest.name || "N/A"}</p>
                          <p className="text-sm text-gray-500">{contest.code || "N/A"}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {contest.getday}/{contest.getmonth}/{contest.getyear}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-semibold ${getRatingColor(parseInt(contest.rating))}`}>
                          {contest.rating || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-700">#{contest.rank || "N/A"}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{ backgroundColor: contest.color || "#6b7280" }}
                        >
                          {contest.name?.includes('Division 4') ? 'Div 4' : 
                           contest.name?.includes('Division 3') ? 'Div 3' :
                           contest.name?.includes('Division 2') ? 'Div 2' : 'Rated'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600">No contest data available.</p>
            </div>
          )}
        </div>
      </div>
  );
}