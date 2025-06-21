import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut, Code2 } from 'lucide-react'

export const NavBar = () => {
    const [fullName, setFullName] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        // Get user's full name from localStorage or context
        const storedName = localStorage.getItem("full_name");
        if (storedName) {
            setFullName(storedName);
        }
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("full_name");
        navigate("/login");
    };
    
    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center space-x-2">
                        <Code2 className="h-8 w-8 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">
                            CodeTracker
                        </h1>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={()=> navigate("/dashboard")}
                            className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
                        >
                            <span>Home</span>
                        </Button>
                    </div>
                    
                    {/* User Section */}
                    <div className="flex items-center space-x-4">
                        {fullName && (
                            <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                                        {getInitials(fullName)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                                    Welcome, {fullName}
                                </span>
                            </div>
                        )}
                        
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleLogout}
                            className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}