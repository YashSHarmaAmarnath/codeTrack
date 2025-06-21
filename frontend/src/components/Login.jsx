import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const API_BASE_URL = "http://localhost:8000"; // Replace with your backend URL if different
  const navigate = useNavigate();

  

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    fullName: '',
    email: '',
    password: '',
    leet_code: "",
    codechef: "",
    codeforces: "",
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/login/`, {
        username: loginData.email,
        password: loginData.password
      });
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('full_name', response.data.full_name);
      alert(`Welcome, ${response.data.full_name}!`);
      navigate("/dashboard");
      // redirect or update state if needed
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: Invalid credentials');
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/register/`, {
        username: registerData.email,
        password: registerData.password,
        full_name: registerData.fullName,
        leet_code: registerData.leet_code,
        codechef: registerData.codechef,
        codeforces: registerData.codeforces
      });
      console.log('Registration successful:', response.data);
      alert('Registration successful! Please login.');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed: Try a different email.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl relative z-10">
        <CardContent className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mb-4 shadow-lg">
              <span className="text-2xl font-bold text-white">CT</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Welcome to CodeTrack
            </h1>
            <p className="text-gray-300 text-sm">Your coding journey starts here</p>
          </div>

          {/* Tabs for Login/Register */}
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-1">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-300 rounded-lg transition-all duration-300 font-medium"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-gray-300 rounded-lg transition-all duration-300 font-medium"
              >
                Register
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-gray-200 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 h-12 rounded-xl transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-gray-200 font-medium">
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 h-12 rounded-xl transition-all duration-300"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="text-right">
                  <button type="button" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    Forgot password?
                  </button>
                </div>

                <Button 
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white h-12 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Sign In
                </Button>
              </div>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
                           <form onSubmit={handleRegister}>
 <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="register-fullname" className="text-gray-200 font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="register-fullname"
                    name="fullName"
                    type="text"
                    value={registerData.fullName}
                    onChange={handleRegisterChange}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 h-12 rounded-xl transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-gray-200 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 h-12 rounded-xl transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-leet_code" className="text-gray-200 font-medium">
                    Leet Code
                  </Label>
                  <Input
                    id="register-leet_code"
                    name="leet_code"
                    type="text"
                    value={registerData.leet_code}
                    onChange={handleRegisterChange}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 h-12 rounded-xl transition-all duration-300"
                    placeholder="Enter your leetcode id"
                    />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-codechef" className="text-gray-200 font-medium">
                    Code chef
                  </Label>
                  <Input
                    id="register-codechef"
                    name="codechef"
                    type="text"
                    value={registerData.codechef}
                    onChange={handleRegisterChange}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 h-12 rounded-xl transition-all duration-300"
                    placeholder="Enter your codechef id"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-codeforces" className="text-gray-200 font-medium">
                    Code forces
                  </Label>
                  <Input
                    id="register-codeforces"
                    name="codeforces"
                    type="text"
                    value={registerData.codeforces}
                    onChange={handleRegisterChange}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 h-12 rounded-xl transition-all duration-300"
                    placeholder="Enter your codeforces id"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-gray-200 font-medium">
                    Password
                  </Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                    className="bg-white/5 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 h-12 rounded-xl transition-all duration-300"
                    placeholder="Create a strong password"
                  />
                </div>

                {/* <Button 
                  onClick={handleRegister}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white h-12 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Create Account
                </Button> */}
                <Button type="submit">Sign In</Button>

              </div>
              </form>
            </TabsContent>
          </Tabs>

          {/* Divider */}
          <div className="flex items-center my-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <span className="px-4 text-gray-400 text-sm">or continue with</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>

          {/* Social Login Section */}
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1 bg-white/5 backdrop-blur-sm hover:bg-white/10 border-white/20 text-white h-12 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 bg-white/5 backdrop-blur-sm hover:bg-white/10 border-white/20 text-white h-12 rounded-xl transition-all duration-300 hover:scale-105 font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}