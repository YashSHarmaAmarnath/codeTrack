import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, Building2, Download, ChevronRight, Code, Users, FileSpreadsheet } from 'lucide-react';


const Dashboard = () => {
  const navigate = useNavigate();

  // const handleNavigate = (path) => {
  //   console.log(`Navigating to: ${path}`);
  //   // Add your navigation logic here
  // };

  const cards = [
    {
      title: "Search Question",
      description: "Find and explore coding problems with company name",
      icon: Search,
      gradient: "from-blue-50 via-blue-100 to-blue-200",
      hoverGradient: "hover:from-blue-100 hover:via-blue-200 hover:to-blue-300",
      iconColor: "text-blue-600",
      path: "/leetCodeProblems",
      accent: "bg-blue-500"
    },
    {
      title: "Search Company",
      description: "Browse questions by company to prepare for specific interviews",
      icon: Building2,
      gradient: "from-amber-50 via-amber-100 to-amber-200",
      hoverGradient: "hover:from-amber-100 hover:via-amber-200 hover:to-amber-300",
      iconColor: "text-amber-600",
      path: "/company",
      accent: "bg-amber-500"
    },
    {
      title: "Download CSV",
      description: "Export problem sets by company name",
      icon: Download,
      gradient: "from-emerald-50 via-emerald-100 to-emerald-200",
      hoverGradient: "hover:from-emerald-100 hover:via-emerald-200 hover:to-emerald-300",
      iconColor: "text-emerald-600",
      path: "/downloadCSV",
      accent: "bg-emerald-500"
    }
  ];

  const platforms = [
    {
      name: "LeetCode",
      route: "/leetcode",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
      color: "from-yellow-100 to-yellow-300",
      hoverColor: "hover:from-yellow-200 hover:to-yellow-400",
      textColor: "text-yellow-800",
      description: "Practice algorithmic problems"
    },
    {
      name: "CodeChef",
      route: "/codechef",
      logo: "https://cdn.codechef.com/sites/all/themes/abessive/cc-logo.png",
      color: "from-purple-100 to-purple-300",
      hoverColor: "hover:from-purple-200 hover:to-purple-400",
      textColor: "text-purple-800",
      description: "Competitive programming contests"
    },
    {
      name: "Codeforces",
      route: "/codeforces",
      logo: "https://sta.codeforces.com/s/59557/images/codeforces-logo-with-telegram.png",
      color: "from-sky-100 to-sky-300",
      hoverColor: "hover:from-sky-200 hover:to-sky-400",
      textColor: "text-sky-800",
      description: "Programming competitions"
    }
  ];

  const handleNavigate = (route) => {
    navigate(route, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Coding Platforms Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Track and explore your progress on top competitive platforms
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              onClick={() => handleNavigate(platform.route)}
              className={`
                group relative cursor-pointer rounded-3xl 
                shadow-md bg-gradient-to-br ${platform.color} ${platform.hoverColor}
                p-8 transition-all duration-300 hover:scale-105 hover:shadow-xl
              `}
            >
              <div className="relative z-10 flex flex-col items-center text-center">
                <img
                  src={platform.logo}
                  alt={`${platform.name} logo`}
                  className="w-24 h-24 object-contain mb-4 bg-white p-2 rounded-2xl shadow"
                />
                <h3 className={`text-2xl font-bold ${platform.textColor}`}>
                  {platform.name}
                </h3>
                <p className="text-sm text-gray-700 mt-2 mb-4">
                  {platform.description}
                </p>
                <span className="text-sm font-medium text-gray-800">
                  View Profile →
                </span>
              </div>
            </div>
          ))}
        </div>

         
    <div className="mt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
            <Code className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent mb-4">
            LeetCode Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Master coding interviews with our comprehensive collection of problems and company-specific questions
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className={`group relative cursor-pointer rounded-3xl shadow-lg bg-gradient-to-br ${card.gradient} ${card.hoverGradient} p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 border border-white border-opacity-50 backdrop-blur-sm overflow-hidden`}
                onClick={() => handleNavigate(card.path)}
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-110 transition-transform duration-500"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full translate-y-12 -translate-x-12 group-hover:scale-110 transition-transform duration-500"></div>
                
                {/* Accent Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${card.accent} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex items-center justify-center w-16 h-16 bg-white bg-opacity-90 rounded-2xl mb-6 shadow-md group-hover:shadow-lg group-hover:bg-opacity-100 transition-all duration-300">
                    <Icon className={`w-8 h-8 ${card.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors duration-300">
                    {card.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-base leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    {card.description}
                  </p>
                  
                  {/* Action Button */}
                  <div className="flex items-center text-gray-700 font-semibold group-hover:text-gray-900 transition-colors duration-300">
                    <span className="mr-2">Explore</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        
      </div>
    </div>
      </div>
    </div>
  );
};

export default Dashboard;
