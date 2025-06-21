import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom";

export const SidebarRibbon = () => {
  // const [activeButton, setActiveButton] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="fixed left-0 top-0 h-full bg-white-900 z-50 flex flex-col mt-16">
      {/* Sidebar content */}
      <div className="flex flex-col p-2 space-y-2">
        <Button
          variant='default'
          size="sm"
          onClick={() => navigate('/leetcode', { replace: true })}
          className="w-12 h-12 text-black hover:bg-yellow-100 border border-white-600 bg-yellow-200"
        >
        <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" alt="Leet Code" />
        </Button>
        
        <Button
          variant='default'
          size="sm"
          onClick={() => navigate('/codechef', { replace: true })}
          className="w-12 h-12 text-black hover:bg-purple-100 border border-white-600 bg-purple-200"
        >
        <img src="https://img.icons8.com/fluent/512/codechef.png" alt="Code Chef" />
        </Button>
        
        <Button
          variant='default'
          size="sm"
          onClick={() => navigate('/codeforces', { replace: true })}
          className="w-12 h-12 text-black hover:bg-blue-100 border border-white-600  bg-blue-200"
        >
          <img src="https://cdn.iconscout.com/icon/free/png-256/free-code-forces-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-2-pack-logos-icons-2944796.png?f=webp&w=256" alt="Code Forces" />
        </Button>
      </div>
    </div>
  );
};

