import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plane, Calculator, Database, TrendingUp, Zap } from "lucide-react";
import QuickStats from "../components/dashboard/QuickStats";

export default function Dashboard() {
  const { data: aircraft = [] } = useQuery({
    queryKey: ['aircraft'],
    queryFn: () => base44.entities.Aircraft.list()
  });

  const { data: calculations = [] } = useQuery({
    queryKey: ['calculations'],
    queryFn: () => base44.entities.Calculation.list('-created_date', 5)
  });

  const features = [
    {
      icon: Calculator,
      title: 'Performance Calculator',
      description: 'Calculate takeoff, landing, and climb performance under any atmospheric conditions',
      link: 'Calculator',
      color: 'bg-blue-500'
    },
    {
      icon: Database,
      title: 'Aircraft Library',
      description: 'Manage your aircraft database with detailed performance specifications',
      link: 'Aircraft',
      color: 'bg-indigo-500'
    },
    {
      icon: TrendingUp,
      title: 'Saved Scenarios',
      description: 'Review and compare past performance calculations',
      link: 'Scenarios',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white bg-opacity-20 rounded-2xl backdrop-blur-sm">
              <Plane className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Aviation Performance Analyzer
              </h1>
              <p className="text-xl text-blue-100">
                Professional aircraft performance calculations made simple
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-8">
            <Link to={createPageUrl('Calculator')}>
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 font-semibold">
                <Zap className="w-5 h-5 mr-2" />
                Start Calculating
              </Button>
            </Link>
            <Link to={createPageUrl('Aircraft')}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 font-semibold">
                <Database className="w-5 h-5 mr-2" />
                View Aircraft
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Quick Stats */}
        <QuickStats 
          aircraftCount={aircraft.length}
          calculationCount={calculations.length}
        />

        {/* Features Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Link key={idx} to={createPageUrl(feature.link)}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group">
                  <CardHeader>
                    <div className={`${feature.color} bg-opacity-10 p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-8 h-8 ${feature.color.replace('bg-', 'text-')}`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Calculations */}
        {calculations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Recent Calculations</h2>
              <Link to={createPageUrl('Scenarios')}>
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calculations.slice(0, 3).map((calc) => (
                <Card key={calc.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-slate-900">
                      {calc.scenario_name || calc.aircraft_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p>Aircraft: <span className="font-medium text-slate-900">{calc.aircraft_name}</span></p>
                      <p>Altitude: <span className="font-medium text-slate-900">{calc.altitude.toLocaleString()} ft</span></p>
                      <p>DA: <span className="font-medium text-slate-900">{Math.round(calc.results?.density_altitude).toLocaleString()} ft</span></p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}