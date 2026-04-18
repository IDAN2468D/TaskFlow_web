"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { AIPulseCard } from './AIPulseCard';
import { GamificationCard } from './GamificationCard';

interface IIntelligenceHubProps {
  userData: any;
  userProgress?: any;
  topTask?: string;
  urgentCount: number;
}

export default function IntelligenceHub({ 
  userData, 
  userProgress, 
  topTask, 
  urgentCount 
}: IIntelligenceHubProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 lg:mb-20">
      {/* Primary AI Intelligence Banner - Spans 2 columns on large screens */}
      <div className="lg:col-span-2">
        <AIPulseCard 
          userName={userData?.name || "אסטרטג"} 
          topTask={topTask || "תכנון המהלך הבא להיום..."}
          urgentCount={urgentCount}
        />
      </div>

      {/* Gamification & Progress Card */}
      <div className="lg:col-span-1">
        <GamificationCard 
          level={userProgress?.level || 1}
          xp={userProgress?.xp || 0}
          streak={userProgress?.currentStreak || 0}
          totalTasks={userProgress?.totalTasksCompleted || 0}
        />
      </div>
    </div>
  );
}
