import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Building2,
  ExternalLink,
  AlertCircle,
  Loader2,
  TrendingUp,
} from "lucide-react";

const PAGE_SIZE = 10;
export const Company = () => {
  const [companyName, setCompanyName] = useState("");
  const [problems, setProblems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  const token = localStorage.getItem("token");

  const handleSearch = useCallback(async () => {
    if (!companyName.trim()) return;
    console.log("clicked");
    setLoading(true);
    setError(null);
    setProblems([]);
    try {
      const response = await fetch(
        `http://localhost:8000/problem/search_company?name=${encodeURIComponent(
          companyName
        )}&limit=${PAGE_SIZE}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError("No Company found");
        } else {
          setError("Something went wrong");
        }
        setLoading(false);
        return;
      }

      const data = await response.json();
      setProblems(data);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [token, companyName, offset]);

  // Pre-defined color classes to avoid dynamic class generation
  const colorClasses = useMemo(
    () => ({
      high: "text-red-600 bg-red-50",
      medium: "text-orange-600 bg-orange-50",
      low: "text-green-600 bg-green-50",
    }),
    []
  );

  const getOccurrenceColor = useCallback(
    (count) => {
      if (count >= 10) return colorClasses.high;
      if (count >= 5) return colorClasses.medium;
      return colorClasses.low;
    },
    [colorClasses]
  );

  // Memoize the processed problems
  const processedProblems = useMemo(() => {
    return problems.map((problem, index) => ({
      ...problem,
      id: `${problem.problem_name}-${problem.num_occur}-${index}`,
      colorClass: getOccurrenceColor(problem.num_occur),
    }));
  }, [problems, getOccurrenceColor]);

  useEffect(() => {
    handleSearch();
  }, [offset]);

  const handleNext = () => setOffset(offset + PAGE_SIZE);
  const handlePrevious = () => setOffset(Math.max(offset - PAGE_SIZE, 0));

  // Memoize result count
  const resultCount = useMemo(
    () => processedProblems.length,
    [processedProblems]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Company</h1>
                <p className="text-gray-600">Search Company and get questions asked by them</p>
              </div>
            </div>
            
          </div>
        </div>
        {/* Search Section - Simplified styling */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter company name (e.g., Google, Microsoft, Apple)"
                value={companyName}
                onChange={(e) => {
                  setCompanyName(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
              />
            </div>
            <button
              onClick={() => {
                setOffset(0);
                handleSearch();
              }}
              disabled={loading || !companyName.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex items-center gap-2 min-w-fit"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Search Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {!loading && resultCount > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </h2>
              <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Company:{" "}
                <span className="font-medium text-gray-700">{companyName}</span>
              </div>
            </div>

            <div className="space-y-3">
              {processedProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="bg-white rounded-lg p-4 border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <a
                        href={problem.problem_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 group"
                      >
                        <span className="truncate">{problem.problem_name}</span>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                      </a>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-gray-600 text-sm">
                          Frequency:
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${problem.colorClass}`}
                        >
                          {problem.num_occur} occurrence
                          {problem.num_occur !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-xl font-bold text-blue-600">
                        {problem.num_occur}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">
                        Times Asked
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && problems.length === 0 && companyName && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Results Found
            </h3>
            <p className="text-gray-600 text-sm">
              Try searching for a different company name or check your spelling.
            </p>
          </div>
        )}

        {/* Initial State */}
        {!loading && !error && problems.length === 0 && !companyName && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Start Your Search
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-sm">
              Enter a company name above to find coding problems and interview
              questions they commonly ask.
            </p>
          </div>
        )}
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
              Showing {offset + 1} -{" "}
              {Math.min(offset + PAGE_SIZE, offset + problems.length)}
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
      </div>
    </div>
  );
};
