import React, { useState, useEffect } from 'react';
import { Download, FileText, RefreshCw, AlertCircle, Folder, Search, X } from 'lucide-react';


export const DownloadCSV = () => {
   const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  // Base URL for your API - adjust this to match your backend
  const API_BASE_URL = 'http://localhost:8000'; // Change this to your actual API URL

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/list/company-csv/`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (filename) => {
    setDownloading(prev => new Set([...prev, filename]));
    
    try {
      const response = await fetch(`${API_BASE_URL}/download/company-csv/?filename=${encodeURIComponent(filename)}`);
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(`Download failed: ${err.message}`);
    } finally {
      setDownloading(prev => {
        const newSet = new Set(prev);
        newSet.delete(filename);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatFileSize = (filename) => {
    // This is a placeholder since we don't have file size info from the API
    // You could extend your backend to include file sizes
    return "Unknown size";
  };

  // Filter files based on search term
  const filteredFiles = files.filter(filename =>
    filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Folder className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Company CSV Files</h1>
                <p className="text-gray-600">Download and manage your CSV files</p>
              </div>
            </div>
            <button
              onClick={fetchFiles}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center space-x-3 text-gray-600">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="text-lg">Loading files...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Files</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchFiles}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : files.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Files Found</h3>
                <p className="text-gray-600">There are no CSV files available for download.</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              {/* Search Box */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {searchTerm ? (
                    <>
                      Search Results ({filteredFiles.length} of {files.length})
                      {searchTerm && (
                        <span className="text-sm font-normal text-gray-600 ml-2">
                          for "{searchTerm}"
                        </span>
                      )}
                    </>
                  ) : (
                    <>Available Files ({files.length})</>
                  )}
                </h2>
              </div>
              
              {filteredFiles.length === 0 && searchTerm ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No files found</h3>
                  <p className="text-gray-600 mb-4">
                    No files match your search term "{searchTerm}"
                  </p>
                  <button
                    onClick={clearSearch}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredFiles.map((filename, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {searchTerm ? (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: filename.replace(
                                    new RegExp(`(${searchTerm})`, 'gi'),
                                    '<mark class="bg-yellow-200 rounded px-1">$1</mark>'
                                  )
                                }}
                              />
                            ) : (
                              filename
                            )}
                          </h3>
                          <p className="text-sm text-gray-500">CSV File • {formatFileSize(filename)}</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => downloadFile(filename)}
                        disabled={downloading.has(filename)}
                        className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        {downloading.has(filename) ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>API Base URL: {API_BASE_URL}</p>
          <p className="mt-1">Make sure your backend server is running and CORS is configured properly.</p>
        </div>
      </div>
    </div>
  );
};

// import React, { useState, useEffect } from 'react';
// import { Download, FileText, RefreshCw, AlertCircle, Folder } from 'lucide-react';

// const DownloadCSV = () => {
//   const [files, setFiles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [downloading, setDownloading] = useState(new Set());

//   // Base URL for your API - adjust this to match your backend
//   const API_BASE_URL = 'http://localhost:8000'; // Change this to your actual API URL

//   const fetchFiles = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/list/company-csv/`);
      
//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       setFiles(data.files || []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadFile = async (filename) => {
//     setDownloading(prev => new Set([...prev, filename]));
    
//     try {
//       const response = await fetch(`${API_BASE_URL}/download/company-csv/?filename=${encodeURIComponent(filename)}`);
      
//       if (!response.ok) {
//         throw new Error(`Download failed: ${response.statusText}`);
//       }
      
//       // Create blob and download
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = filename;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//     } catch (err) {
//       alert(`Download failed: ${err.message}`);
//     } finally {
//       setDownloading(prev => {
//         const newSet = new Set(prev);
//         newSet.delete(filename);
//         return newSet;
//       });
//     }
//   };

//   useEffect(() => {
//     fetchFiles();
//   }, []);

//   const formatFileSize = (filename) => {
//     // This is a placeholder since we don't have file size info from the API
//     // You could extend your backend to include file sizes
//     return "Unknown size";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="bg-blue-500 p-3 rounded-lg">
//                 <Folder className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">Company CSV Files</h1>
//                 <p className="text-gray-600">Download and manage your CSV files</p>
//               </div>
//             </div>
//             <button
//               onClick={fetchFiles}
//               disabled={loading}
//               className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
//             >
//               <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
//               <span>Refresh</span>
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="bg-white rounded-lg shadow-lg">
//           {loading ? (
//             <div className="flex items-center justify-center py-16">
//               <div className="flex items-center space-x-3 text-gray-600">
//                 <RefreshCw className="w-6 h-6 animate-spin" />
//                 <span className="text-lg">Loading files...</span>
//               </div>
//             </div>
//           ) : error ? (
//             <div className="flex items-center justify-center py-16">
//               <div className="text-center">
//                 <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Files</h3>
//                 <p className="text-gray-600 mb-4">{error}</p>
//                 <button
//                   onClick={fetchFiles}
//                   className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
//                 >
//                   Try Again
//                 </button>
//               </div>
//             </div>
//           ) : files.length === 0 ? (
//             <div className="flex items-center justify-center py-16">
//               <div className="text-center">
//                 <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//                 <h3 className="text-lg font-semibold text-gray-900 mb-2">No Files Found</h3>
//                 <p className="text-gray-600">There are no CSV files available for download.</p>
//               </div>
//             </div>
//           ) : (
//             <div className="p-6">
//               <div className="mb-4">
//                 <h2 className="text-lg font-semibold text-gray-800">
//                   Available Files ({files.length})
//                 </h2>
//               </div>
              
//               <div className="grid gap-4">
//                 {files.map((filename, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="flex items-center space-x-3">
//                       <div className="bg-green-100 p-2 rounded-lg">
//                         <FileText className="w-5 h-5 text-green-600" />
//                       </div>
//                       <div>
//                         <h3 className="font-medium text-gray-900">{filename}</h3>
//                         <p className="text-sm text-gray-500">CSV File • {formatFileSize(filename)}</p>
//                       </div>
//                     </div>
                    
//                     <button
//                       onClick={() => downloadFile(filename)}
//                       disabled={downloading.has(filename)}
//                       className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded-lg transition-colors"
//                     >
//                       {downloading.has(filename) ? (
//                         <>
//                           <RefreshCw className="w-4 h-4 animate-spin" />
//                           <span>Downloading...</span>
//                         </>
//                       ) : (
//                         <>
//                           <Download className="w-4 h-4" />
//                           <span>Download</span>
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-6 text-gray-500 text-sm">
//           <p>API Base URL: {API_BASE_URL}</p>
//           <p className="mt-1">Make sure your backend server is running and CORS is configured properly.</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DownloadCSV;