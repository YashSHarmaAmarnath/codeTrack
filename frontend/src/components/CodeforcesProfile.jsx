import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trophy, TrendingUp, Code, Calendar, Award, User, Target } from "lucide-react";
import axios from 'axios';

const CodeforcesProfile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming your API base URL is set in Axios defaults or a proxy
        const response = await axios.get('http://localhost:8000/profile/codeforces',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch Codeforces data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  const getRankColor = (rank) => {
    const rankColors = {
      'newbie': 'text-gray-600',
      'pupil': 'text-green-600',
      'specialist': 'text-cyan-600',
      'expert': 'text-blue-600',
      'candidate master': 'text-purple-600',
      'master': 'text-orange-600',
      'international master': 'text-orange-500',
      'grandmaster': 'text-red-600',
      'international grandmaster': 'text-red-500',
      'legendary grandmaster': 'text-red-700 font-bold'
    };
    return rankColors[rank?.toLowerCase()] || 'text-gray-600';
  };

  const getVerdictColor = (verdict) => {
    const verdictColors = {
      'OK': 'bg-green-100 text-green-800',
      'WRONG_ANSWER': 'bg-red-100 text-red-800',
      'TIME_LIMIT_EXCEEDED': 'bg-yellow-100 text-yellow-800',
      'MEMORY_LIMIT_EXCEEDED': 'bg-orange-100 text-orange-800',
      'RUNTIME_ERROR': 'bg-purple-100 text-purple-800',
      'COMPILATION_ERROR': 'bg-gray-100 text-gray-800'
    };
    return verdictColors[verdict] || 'bg-gray-100 text-gray-800';
  };

  const getVerdictIcon = (verdict) => {
    return verdict === 'OK' ? '✓' : '✗';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading your Codeforces profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex justify-center items-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 text-lg">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <p className="text-gray-600 text-lg">No data available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { status, info, rating } = data;
  const userInfo = info.result[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Codeforces Profile</h1>
          <p className="text-gray-600">Competitive Programming Statistics</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {data.username  || "CodeForces User"}
                </h1>
                <a href={`https://codeforces.com/profile/${data.username}`} target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:underline">
                  <p className="text-orange-100">Code Forces Profile 🔗</p>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Cards */}
        {info.status === "OK" && info.result.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <CardContent className="p-6 text-center">
                <User className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-700 mb-1">Handle</h3>
                <p className="text-2xl font-bold text-gray-800">{userInfo.handle}</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <CardContent className="p-6 text-center">
                <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-700 mb-1">Current Rank</h3>
                <p className={`text-lg font-bold capitalize ${getRankColor(userInfo.rank)}`}>
                  {userInfo.rank}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-700 mb-1">Current Rating</h3>
                <p className="text-2xl font-bold text-green-600">{userInfo.rating}</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-0">
              <CardContent className="p-6 text-center">
                <Award className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-700 mb-1">Max Rating</h3>
                <p className="text-2xl font-bold text-orange-600">{userInfo.maxRating}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rating History */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Rating History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {rating.status === "OK" && rating.result.length > 0 ? (
                <div className="overflow-hidden">
                  {rating.result.slice(-10).reverse().map((entry, index) => (
                    <div key={index} className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${index === 0 ? 'bg-blue-50' : ''}`}>
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm mb-1">
                            {entry.contestName}
                          </h4>
                          <p className="text-sm text-gray-600">Rank: #{entry.rank}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{entry.oldRating}</span>
                            <span className="text-gray-400">→</span>
                            <span className={`font-bold ${entry.newRating > entry.oldRating ? 'text-green-600' : entry.newRating < entry.oldRating ? 'text-red-600' : 'text-gray-600'}`}>
                              {entry.newRating}
                            </span>
                          </div>
                          <div className={`text-xs mt-1 ${entry.newRating > entry.oldRating ? 'text-green-600' : entry.newRating < entry.oldRating ? 'text-red-600' : 'text-gray-600'}`}>
                            {entry.newRating > entry.oldRating ? '+' : ''}{entry.newRating - entry.oldRating}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No rating history available.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Submissions */}
          <Card className="bg-white shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Recent Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {status.status === "OK" && status.result.length > 0 ? (
                <div className="overflow-hidden">
                  {status.result.slice(0, 10).map((submission, index) => (
                    <div key={index} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm mb-1">
                            {submission.problem.name}
                          </h4>
                          <p className="text-xs text-gray-500 mb-2">Contest {submission.problem.contestId}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(submission.creationTimeSeconds * 1000).toLocaleString()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getVerdictColor(submission.verdict)}`}>
                            <span className="mr-1">{getVerdictIcon(submission.verdict)}</span>
                            {submission.verdict.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Code className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No submissions available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CodeforcesProfile;