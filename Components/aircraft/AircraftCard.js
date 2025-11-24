import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Gauge, TrendingUp, Fuel } from "lucide-react";

export default function AircraftCard({ aircraft, onSelect, onEdit }) {
  const categoryColors = {
    single_engine: 'bg-blue-100 text-blue-800',
    multi_engine: 'bg-purple-100 text-purple-800',
    jet: 'bg-red-100 text-red-800',
    turboprop: 'bg-green-100 text-green-800',
    glider: 'bg-sky-100 text-sky-800'
  };

  const specs = [
    { icon: Gauge, label: 'Cruise', value: `${aircraft.cruise_speed || 'N/A'} kts` },
    { icon: TrendingUp, label: 'Climb', value: `${aircraft.rate_of_climb || 'N/A'} fpm` },
    { icon: Fuel, label: 'Range', value: aircraft.fuel_capacity ? `${Math.round((aircraft.fuel_capacity / aircraft.fuel_burn_rate) * aircraft.cruise_speed)} nm` : 'N/A' }
  ];

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Plane className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
                {aircraft.make} {aircraft.model}
              </CardTitle>
              <Badge className={`${categoryColors[aircraft.category]} mt-1`}>
                {aircraft.category.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {specs.map((spec, idx) => (
            <div key={idx} className="text-center">
              <spec.icon className="w-4 h-4 text-slate-400 mx-auto mb-1" />
              <p className="text-xs text-slate-500">{spec.label}</p>
              <p className="text-sm font-semibold text-slate-900">{spec.value}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => onSelect(aircraft)}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Use in Calculator
          </Button>
          {onEdit && (
            <Button 
              onClick={() => onEdit(aircraft)}
              variant="outline"
            >
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}