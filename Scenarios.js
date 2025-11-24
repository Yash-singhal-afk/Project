import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, ArrowLeft, Trash2, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { toast } from "sonner";

export default function Scenarios() {
  const [selectedCalc, setSelectedCalc] = useState(null);
  const queryClient = useQueryClient();

  const { data: calculations = [] } = useQuery({
    queryKey: ['calculations'],
    queryFn: () => base44.entities.Calculation.list('-created_date')
  });

  const deleteCalculation = useMutation({
    mutationFn: (id) => base44.entities.Calculation.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calculations'] });
      setSelectedCalc(null);
      toast.success('Calculation deleted');
    }
  });

  const getPerformanceRating = (densityAlt) => {
    if (densityAlt < 3000) return { label: 'Excellent', color: 'bg-green-500' };
    if (densityAlt < 6000) return { label: 'Good', color: 'bg-blue-500' };
    if (densityAlt < 9000) return { label: 'Fair', color: 'bg-yellow-500' };
    return { label: 'Poor', color: 'bg-red-500' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to={createPageUrl('Dashboard')}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-600 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Saved Scenarios</h1>
              <p className="text-lg text-slate-600 mt-1">
                Review and compare your performance calculations
              </p>
            </div>
          </div>
        </div>

        {calculations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List View */}
            <div className="lg:col-span-1 space-y-4">
              {calculations.map((calc) => {
                const rating = getPerformanceRating(calc.results?.density_altitude || 0);
                return (
                  <Card 
                    key={calc.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedCalc?.id === calc.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedCalc(calc)}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">
                            {calc.scenario_name || calc.aircraft_name}
                          </h3>
                          <p className="text-sm text-slate-600">{calc.aircraft_name}</p>
                        </div>
                        <Badge className={`${rating.color} text-white`}>
                          {rating.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(calc.created_date), 'MMM d, yyyy')}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Detail View */}
            <div className="lg:col-span-2">
              {selectedCalc ? (
                <Card className="shadow-lg">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold text-slate-900">
                        {selectedCalc.scenario_name || selectedCalc.aircraft_name}
                      </CardTitle>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteCalculation.mutate(selectedCalc.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    {/* Conditions */}
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-3">Conditions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">Altitude</p>
                          <p className="font-semibold text-slate-900">{selectedCalc.altitude.toLocaleString()} ft</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">Temperature</p>
                          <p className="font-semibold text-slate-900">{selectedCalc.temperature}°C</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">Weight</p>
                          <p className="font-semibold text-slate-900">{selectedCalc.weight.toLocaleString()} lbs</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">Headwind</p>
                          <p className="font-semibold text-slate-900">{selectedCalc.headwind} kts</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600">Runway</p>
                          <p className="font-semibold text-slate-900 capitalize">{selectedCalc.runway_condition}</p>
                        </div>
                      </div>
                    </div>

                    {/* Results */}
                    {selectedCalc.results && (
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-3">Performance Results</h3>
 