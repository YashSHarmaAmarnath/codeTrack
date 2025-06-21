import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ExternalLink, Code, Trophy, Clock, Target, CodeSquare } from "lucide-react";

const PAGE_SIZE = 10;

export default function LeetCodeQuestion() {
  const [problems, setProblems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchError, setSearchError] = useState(false);
  // const [token, setToken] = useState("demo-token"); // Using state instead of localStorage
  const token = localStorage.getItem("token")
  const fetchProblems = async () => {
    setLoading(true);
    setSearchError(false);
    try {
      const response = await fetch(`http://localhost:8000/problems/?limit=${PAGE_SIZE}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setProblems(data);
        console.log(data);
      } else {
        throw new Error('Failed to fetch');
      }
    } catch (error) {
      console.error("Failed to fetch problems:", error);
      }
      setLoading(false);
    };

    const searchProblems = async()=>{
      setLoading(true);
      setSearchError(false);
      try{
        const response = await fetch(`http://localhost:8000/problem/search/?name=${searchText}`,
          {
            method: 'GET',
            headers:{
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if(response.ok){
            const data = await response.json();
            setProblems(data);
          }else{
            throw new Error('Failed to fetch');
          }
      }catch(error){
        console.error('Failed to fetch problem:',error);
        setSearchError(true)
      }
      setLoading(false);
    };

    useEffect(() => {
    fetchProblems();
  }, [offset, token]);

  const handleNext = () => setOffset(offset + PAGE_SIZE);
  const handlePrevious = () => setOffset(Math.max(offset - PAGE_SIZE, 0));

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return <Target className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'hard':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Code className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LeetCode Problems
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Master coding interviews with curated problem sets
          </p>
        </div>

        {/* Token Input */}
      
      <div className="flex items-center justify-center mb-8">
        <input
          type="text"
          className="w-80 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search problems by name..."
          onChange={e=>setSearchText(e.target.value)}
          value={searchText}
        />
        <Button
          className="rounded-r-lg px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
          onClick={searchProblems}
          type="button"
        >
          Search
        </Button>
      </div>

      {searchError && <>
      <div className="bg-red-500 mb-4 p-4  rounded-xl flex justify-center">
        <p className="text-white text-xl">Question not found</p>
      </div>
      </>}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading problems...</p>
          </div>
        ) : (
          <>
            {/* Problems Grid */}
            {/* <div className="grid gap-6 mb-8">
              {problems.map((problem, index) => (
                <Card key={problem.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.02] bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items- start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            #{(offset + index + 1).toString().padStart(3, '0')}
                          </span>
                          <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {problem.name}
                          </h2>
                        </div>
                        
                        <div className="flex items-center gap-2 ">
                          {getDifficultyIcon(problem.difficulty)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </div>
                         <div className="p-4 max-w-md mx-auto">
                        <ul className="space-y-3">
                          {problem.companies.map((item, index) => (
                            <li
                              key={index}
                              className="flex justify-between items-center bg-white shadow-md rounded-xl px-4 py-2 hover:bg-gray-100"
                            >
                              <span className="font-medium text-gray-800">{item.company_name}</span>
                              <span className="text-sm text-gray-600">x{item.num_occur}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                        
                      </div>
                      
                      <a
                        href={problem.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Solve
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div> */}
            <div className="grid gap-8 mb-8">
  {problems.map((problem, index) => (
    <Card key={problem.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-[1.01] bg-gradient-to-br from-white via-white to-gray-50/50 backdrop-blur-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              {/* Header Section */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors">
                  #{(offset + index + 1).toString().padStart(3, '0')}
                </span>
                <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 truncate">
                  {problem.name}
                </h2>
              </div>
              
              {/* Difficulty Badge */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2">
                  {getDifficultyIcon(problem.difficulty)}
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border-2 transition-all duration-300 ${getDifficultyColor(problem.difficulty)} group-hover:shadow-sm`}>
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap"
            >
              <ExternalLink className="w-4 h-4" />
              Solve
            </a>
          </div>
        </div>
        
        {/* Companies Section */}
        <div className="bg-gray-50/70 border-t border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-semibold text-gray-700">Asked by Companies</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {problem.companies.map((item, companyIndex) => (
              <div
                key={companyIndex}
                className="flex justify-between items-center bg-white shadow-sm hover:shadow-md rounded-lg px-3 py-2.5 hover:bg-blue-50 transition-all duration-200 border border-gray-100 hover:border-blue-200"
              >
                <span className="font-medium text-gray-800 text-sm truncate pr-2">
                  {item.company_name}
                </span>
                <span className="text-xs text-gray-600 bg-gray-100 hover:bg-blue-100 px-2 py-1 rounded-full font-medium transition-colors">
                  {item.num_occur}×
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

            {/* Pagination */}
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border">
              <Button 
                onClick={handlePrevious} 
                disabled={offset === 0}
                className="flex items-center gap-2 px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700 border-0"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  Showing {offset + 1} - {Math.min(offset + PAGE_SIZE, offset + problems.length)}
                </span>
                <div className="w-px h-6 bg-gray-300"></div>
                <span className="text-sm font-medium text-gray-800">
                  Page {Math.floor(offset / PAGE_SIZE) + 1}
                </span>
              </div>
              
              <Button 
                onClick={handleNext} 
                disabled={problems.length < PAGE_SIZE}
                className="flex items-center gap-2 px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}