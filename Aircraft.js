import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Database, Plus, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import AircraftCard from "../components/aircraft/AircraftCard";
import { toast } from "sonner";

export default function Aircraft() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const queryClient = useQueryClient();

  const { data: aircraft = [] } = useQuery({
    queryKey: ['aircraft'],
    queryFn: () => base44.entities.Aircraft.list()
  });

  const createAircraft = useMutation({
    mutationFn: (data) => base44.entities.Aircraft.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft'] });
      setIsDialogOpen(false);
      toast.success('Aircraft added successfully');
    }
  });

  const updateAircraft = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Aircraft.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aircraft'] });
      setIsDialogOpen(false);
      setEditingAircraft(null);
      toast.success('Aircraft updated successfully');
    }
  });

  const handleSelectForCalculation = (aircraft) => {
    // Store in sessionStorage and navigate
    sessionStorage.setItem('selectedAircraft', JSON.stringify(aircraft));
    window.location.href = createPageUrl('Calculator');
  };

  const filteredAircraft = aircraft.filter(a => {
    const matchesSearch = a.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         a.model?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || a.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Aircraft Library</h1>
                <p className="text-lg text-slate-600 mt-1">
                  Manage your aircraft database
                </p>
              </div>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setEditingAircraft(null)}>
                  <Plus className="w-5 h-5 mr-2" />
                  Add Aircraft
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAircraft ? 'Edit Aircraft' : 'Add New Aircraft'}
                  </DialogTitle>
                </DialogHeader>
                <AircraftForm
                  aircraft={editingAircraft}
                  onSubmit={(data) => {
                    if (editingAircraft) {
                      updateAircraft.mutate({ id: editingAircraft.id, data });
                    } else {
                      createAircraft.mutate(data);
                    }
                  }}
                  isLoading={createAircraft.isPending || updateAircraft.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-md mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search aircraft..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="single_engine">Single Engine</SelectItem>
                  <SelectItem value="multi_engine">Multi Engine</SelectItem>
                  <SelectItem value="jet">Jet</SelectItem>
                  <SelectItem value="turboprop">Turboprop</SelectItem>
                  <SelectItem value="glider">Glider</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Aircraft Grid */}
        {filteredAircraft.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAircraft.map((a) => (
 