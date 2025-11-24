import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator as CalcIcon, Save, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AtmosphericConditions from "../components/calculator/AtmosphericConditions";
import PerformanceResults from "../components/calculator/PerformanceResults";
import EducationalInsights from "../components/calculator/EducationalInsights";
import { toast } from "sonner";

export default function Calculator() {
  const [selectedAircraft, setSelectedAircraft] = useState(null);
  const [conditions, setConditions] = useState({
    altitude: 0,
    temperature: 15,
    weight: 0,
    headwind: 0,
    runway_condition: 'dry'
  });
  const [results, setResults] = useState(null);
  const [scenarioName, setScenarioName] = useState('');

  const queryClient = useQueryClient();

  const { data: aircraft = [] } = useQuery({
    queryKey: ['aircraft'],
    queryFn: () => base44.entities.Aircraft.list()
  });

  const saveCalculation = useMutation({
    mutationFn: (data) => base44.entities.Calculation.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calculations'] });
      toast.success('Calculation saved successfully');
      setScenarioName('');
    }
  });

  const calculatePerformance = () => {
    if (!selectedAircraft) {
      toast.error('Please select an aircraft');
      return;
    }

    // Calculate density altitude
    const isaTemp = 15 - (conditions.altitude / 1000) * 2;
    const tempDeviation = conditions.temperature - isaTemp;
    const densityAltitude = conditions.altitude + (120 * tempDeviation);

    // Performance degradation factors
    const altitudeFactor = 1 + (densityAltitude / 10000) * 0.2;
    const weightFactor = selectedAircraft.max_takeoff_weight 
      ? Math.pow(conditions.weight / selectedAircraft.max_takeoff_weight, 1.2)
      : 1.2;
    
    const runwayFactors = {
      dry: 1.0,
      wet: 1.15,
      icy: 2.5
    };
    const runwayFactor = runwayFactors[conditions.runway_condition] || 1.0;

    // Wind correction (5% per 10 knots)
    const windFactor = 1 - (conditions.headwind * 0.005);

    // Calculate distances
    const baselineTO = selectedAircraft.takeoff_distance || 1500;
    const takeoffDistance = baselineTO * altitudeFactor * weightFactor * windFactor * runwayFactor;

    const baselineLanding = selectedAircraft.landing_distance || 1200;
    const landingDistance = baselineLanding * altitudeFactor * weightFactor * windFactor * runwayFactor;

    // Calculate climb performance (decreases ~4% per 1000ft DA)
    const baselineClimb = selectedAircraft.rate_of_climb || 700;
    const climbDecrease = (densityAltitude / 1000) * 0.04;
    const rateOfClimb = baselineClimb * (1 - climbDecrease) * (selectedAircraft.max_takeoff_weight / conditions.weight);

    // Calculate TAS (increases ~2% per 1000ft)
    const baseCruiseSpeed = selectedAircraft.cruise_speed || 120;
    const trueAirspeed = baseCruiseSpeed * (1 + (conditions.altitude / 1000) * 0.02);

    // Fuel efficiency (decreases at high DA)
    const baseFuelBurn = selectedAircraft.fuel_burn_rate || 10;
    const fuelEfficiency = baseFuelBurn * (1 + (densityAltitude / 20000));

    const calculatedResults = {
      density_altitude: densityAltitude,
      takeoff_distance: takeoffDistance,
      landing_distance: landingDistance,
      rate_of_climb: rateOfClimb,
      true_airspeed: trueAirspeed,
      fuel_efficiency: fuelEfficiency
    };

    setResults(calculatedResults);
  };

  const handleSaveScenario = () => {
    if (!scenarioName.trim()) {
      toast.error('Please enter a scenario name');
      return;
    }

    saveCalculation.mutate({
      aircraft_id: selectedAircraft.id,
      aircraft_name: `${selectedAircraft.make} ${selectedAircraft.model}`,
      scenario_name: scenarioName,
      ...conditions,
      results
    });
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
            <div className="p-3 bg-blue-600 rounded-2xl">
              <CalcIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Performance Calculator</h1>
              <p className="text-lg text-slate-600 mt-1">
                Calculate aircraft performance under various atmospheric conditions
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Aircraft Selection */}
          <Card className="shadow-md">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardTitle className="text-xl font-bold text-slate-900">
            
 