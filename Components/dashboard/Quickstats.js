import React from 'react';
import { Card } from "@/components/ui/card";
import { Plane, Calculator, Database, BookOpen } from "lucide-react";

export default function QuickStats({ aircraftCount, calculationCount }) {
  const stats = [
    {
      label: "Aircraft in Library",
      value: aircraftCount || 0,
      icon: Database,
      color: "bg-blue-500"
    },
    {
      label: "Saved Calculations",
      value: calculationCount || 0,
      icon: Calculator,
      color: "bg-indigo-500"
    },
    {
      label: "Performance Factors",
      value: "5",
      icon: Plane,
      color: "bg-sky-500"
    },
    {
      label: "Learning Resources",
      value: "12",
      icon: BookOpen,
      color: "bg-violet-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
            </div>
            <div className={`${stat.color} bg-opacity-10 p-3 rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}import React from 'react';
import { Card } from "@/components/ui/card";
import { Plane, Calculator, Database, BookOpen } from "lucide-react";

export default function QuickStats({ aircraftCount, calculationCount }) {
  const stats = [
    {
      label: "Aircraft in Library",
      value: aircraftCount || 0,
      icon: Database,
      color: "bg-blue-500"
    },
    {
      label: "Saved Calculations",
      value: calculationCount || 0,
      icon: Calculator,
      color: "bg-indigo-500"
    },
    {
      label: "Performance Factors",
      value: "5",
      icon: Plane,
      color: "bg-sky-500"
    },
    {
      label: "Learning Resources",
      value: "12",
      icon: BookOpen,
      color: "bg-violet-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
            </div>
            <div className={`${stat.color} bg-opacity-10 p-3 rounded-xl`}>
              <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}