// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // export const Codechef = () => {
// //   const [data, setData] = useState();
// //   const token = localStorage.getItem("token");
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const response = await axios.get(
// //           "http://localhost:8000/profile/codeChef",
// //           {
// //             headers: {
// //               Authorization: `Bearer ${token}`,
// //             },
// //           }
// //         );
// //         setData(response.data);
// //         console.log(response.data);
// //       } catch (err) {
// //         console.error("Error fetching codechef data:", err);
// //         setError(
// //           err.response ? err.response.data.detail : "Error fetching data"
// //         );
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, [token]);
// //   return (
// //     <div>
// //       <h1>Fetch CodeChef Data</h1>
// //     </div>
// //   );
// // };

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export const Codechef = () => {
//   const [data, setData] = useState(null);
//   const token = localStorage.getItem("token");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(
//           `${"http://localhost:8000"}/profile/codeChef`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setData(response.data);
//         console.log(response.data);
//       } catch (err) {
//         console.error("Error fetching CodeChef data:", err);
//         setError(
//           err.response?.data?.detail || "Error fetching data"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [token]);

//   if (loading) {
//     return <div>Loading CodeChef data...</div>;
//   }

//   if (error) {
//     return <div style={{ color: "red" }}>Error: {error}</div>;
//   }

//   if (!data) {
//     return <div>No CodeChef data found.</div>;
//   }

//   return (
//     <div>
//       <h1>CodeChef Profile</h1>
//       <div>
//         <strong>Username:</strong>{" "}
//         {data.name || "Not available"}
//       </div>
//       <div>
//         <strong>Rating:</strong>{" "}
//         {data.currentRating !== null && data.currentRating !== undefined ? data.currentRating : "Not available"}
//       </div>
//       <div>
//         <strong>Rank:</strong>{" "}
//         {data.globalRank !== null && data.globalRank !== undefined ? data.globalRank : "Not available"}
//       </div>
//       <div>
//         <strong>Country:</strong>{" "}
//         {data.countryName !== null && data.countryName !== undefined ? data.countryName : "Not available"}
//       </div>
//       <div>
//         <strong>countryRank:</strong>{" "}
//         {data.countryRank !== null && data.countryRank !== undefined ? data.countryRank : "Not available"}
//       </div>
//       <div>
//         <strong>Stars:</strong>{" "}
//         {data.stars !== null && data.stars !== undefined ? data.stars : "Not available"}
//       </div>

//       <div style={{ marginTop: "20px" }}>
//         <h2>Contest History</h2>
//         {data.ratingData && data.ratingData.length > 0 ? (
//           <table border="1" cellPadding="8">
//             <thead>
//               <tr>
//                 <th>Code</th>
//                 <th>Name</th>
//                 <th>Date</th>
//                 <th>Rating</th>
//                 <th>Rank</th>
//                 <th>Color</th>
//                 <th>Reason</th>
//                 <th>Penalised In</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.ratingData.map((contest, index) => (
//                 <tr key={index}>
//                   <td>{contest.code || "N/A"}</td>
//                   <td>{contest.name || "N/A"}</td>
//                   <td>
//                     {contest.getday || "--"}/
//                     {contest.getmonth || "--"}/
//                     {contest.getyear || "--"}
//                   </td>
//                   <td>{contest.rating || "N/A"}</td>
//                   <td>{contest.rank || "N/A"}</td>
//                   <td>
//                     <span
//                       style={{
//                         backgroundColor: contest.color || "#ccc",
//                         padding: "2px 6px",
//                         borderRadius: "4px",
//                         color: "#fff"
//                       }}
//                     >
//                       {contest.color || "N/A"}
//                     </span>
//                   </td>
//                   <td>{contest.reason || "N/A"}</td>
//                   <td>{contest.penalised_in || "N/A"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <div>No contest data available.</div>
//         )}
//       </div>
//     </div>
//     // </div>
//   );
// };
import React, { useEffect, useState } from "react";
import {
  User,
  Trophy,
  Star,
  Globe,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";
import axios from "axios";

export const Codechef = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${"http://localhost:8000"}/profile/codeChef`,
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
    };

    fetchData();
  }, [token]);
  // Mock data for demonstration since we can't access localStorage
  //   useEffect(() => {
  //     const mockData = {
  //       name: "codechef_user",
  //       currentRating: 1847,
  //       globalRank: 12543,
  //       countryName: "India",
  //       countryRank: 2341,
  //       stars: 4,
  //       ratingData: [
  //         {
  //           code: "COOK156",
  //           name: "CodeChef Cook-Off 156",
  //           getday: 15,
  //           getmonth: 12,
  //           getyear: 2024,
  //           rating: 1847,
  //           rank: 234,
  //           color: "#3498db",
  //           reason: "Rated",
  //           penalised_in: null
  //         },
  //         {
  //           code: "START162",
  //           name: "CodeChef Starters 162",
  //           getday: 8,
  //           getmonth: 12,
  //           getyear: 2024,
  //           rating: 1823,
  //           rank: 456,
  //           color: "#3498db",
  //           reason: "Rated",
  //           penalised_in: null
  //         },
  //         {
  //           code: "COOK155",
  //           name: "CodeChef Cook-Off 155",
  //           getday: 1,
  //           getmonth: 12,
  //           getyear: 2024,
  //           rating: 1798,
  //           rank: 678,
  //           color: "#2ecc71",
  //           reason: "Rated",
  //           penalised_in: null
  //         }
  //       ]
  //     };

  //     // Simulate API call
  //     setTimeout(() => {
  //       setData(mockData);
  //       setLoading(false);
  //     }, 1500);
  //   }, []);

  const getRatingColor = (rating) => {
    if (rating >= 2000) return "text-red-600";
    if (rating >= 1800) return "text-purple-600";
    if (rating >= 1600) return "text-blue-600";
    if (rating >= 1400) return "text-green-600";
    return "text-gray-600";
  };

  const getStarColor = (stars) => {
    if (stars >= 6) return "text-red-500";
    if (stars >= 4) return "text-purple-500";
    if (stars >= 2) return "text-blue-500";
    return "text-yellow-500";
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {data.name || "CodeChef User"}
                </h1>
                <a href={`https://www.codechef.com/users/${data.name}`} target="_blank" rel="noopener noreferrer" className="text-sm text-white/80 hover:underline">
                <p className="text-orange-100">CodeChef Profile 🔗</p>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Current Rating
                </p>
                <p
                  className={`text-2xl font-bold ${getRatingColor(
                    data.currentRating
                  )}`}
                >
                  {data.currentRating !== null &&
                  data.currentRating !== undefined
                    ? data.currentRating
                    : "N/A"}
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
                  {data.globalRank !== null && data.globalRank !== undefined
                    ? `#${data.globalRank}`
                    : "N/A"}
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
                <p className="text-gray-600 text-sm font-medium">
                  Country Rank
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {data.countryRank !== null && data.countryRank !== undefined
                    ? `#${data.countryRank}`
                    : "N/A"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {data.countryName || "N/A"}
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
                <div className="flex items-center space-x-1">
                  <p
                    className={`text-2xl font-bold ${getStarColor(data.stars)}`}
                  >
                    {data.stars !== null && data.stars !== undefined
                      ? data.stars
                      : "N/A"}
                  </p>
                  {/* <Star
                    className={`w-6 h-6 ${getStarColor(
                      data.stars
                    )} fill-current`}
                  /> */}
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
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
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Contest
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Rating
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Rank
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.ratingData.map((contest, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-800">
                            {contest.name || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {contest.code || "N/A"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {contest.getday || "--"}/{contest.getmonth || "--"}/
                        {contest.getyear || "--"}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`font-semibold ${getRatingColor(
                            contest.rating
                          )}`}
                        >
                          {contest.rating || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-700">
                          #{contest.rank || "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                          style={{
                            backgroundColor: contest.color || "#6b7280",
                          }}
                        >
                          {contest.reason || "N/A"}
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
    </div>
  );
};
