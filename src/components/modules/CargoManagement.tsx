import React, { useMemo, useState, useRef } from 'react';
import { PackageIcon, UploadIcon, FilterIcon, PlusIcon, SearchIcon, CheckIcon, XIcon, EditIcon, ChevronDownIcon, LoaderIcon, AlertCircleIcon, RefreshCwIcon } from 'lucide-react';
import { useCargo, useDeleteCargo, useUpdateCargo, useCreateCargo } from '../../src/hooks/useCargoVizData';
import { Cargo, UpdateCargoRequest, CreateCargoRequest } from '../../src/services/cargoVizAPI';
import CargoItemForm from '../../src/components/forms/CargoItemForm';
import { useWebSocketContext } from '../../src/contexts/WebSocketContext';
const CargoManagement = () => {
  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [zoneFilter, setZoneFilter] = useState<string | null>(null);
  const [isAddingCargo, setIsAddingCargo] = useState(false);
  const [editingCargo, setEditingCargo] = useState<Cargo | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  // Fetch cargo data using React Query
  const {
    data: cargoItems = [],
    isLoading,
    error,
    refetch
  } = useCargo();
  const deleteCargoMutation = useDeleteCargo();
  const updateCargoMutation = useUpdateCargo(editingCargo?.id || '');
  const createCargoMutation = useCreateCargo();
  // WebSocket for real-time updates
  const {
    isConnected: wsConnected,
    cargoUpdates
  } = useWebSocketContext();
  // Track last update time for optimistic UI updates
  const lastUpdateRef = useRef<number>(Date.now());
  // Apply real-time updates from WebSocket
  const enhancedCargoItems = useMemo(() => {
    if (cargoUpdates.length === 0) return cargoItems;
    // Create a copy of cargo items
    const updatedItems = [...cargoItems];
    // Apply updates from WebSocket
    cargoUpdates.forEach(update => {
      if (update.type === 'cargo_status' && update.timestamp > lastUpdateRef.current) {
        const index = updatedItems.findIndex(item => item.id === update.cargoId);
        if (index !== -1) {
          updatedItems[index] = {
            ...updatedItems[index],
            status: update.status,
            ...(update.location && {
              coordinates: update.location
            })
          };
        }
      }
    });
    return updatedItems;
  }, [cargoItems, cargoUpdates]);
  // Filter cargo items based on search and filters
  const filteredCargoItems = useMemo(() => {
    return enhancedCargoItems.filter(item => {
      // Apply search filter
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      // Apply status filter
      if (statusFilter && item.status !== statusFilter) {
        return false;
      }
      // Apply type filter
      if (typeFilter && item.type !== typeFilter) {
        return false;
      }
      // Apply zone filter
      if (zoneFilter && item.zone !== zoneFilter) {
        return false;
      }
      return true;
    });
  }, [enhancedCargoItems, searchTerm, statusFilter, typeFilter, zoneFilter]);
  // Get unique values for filters
  const statusOptions = useMemo(() => Array.from(new Set(enhancedCargoItems.map(item => item.status))), [enhancedCargoItems]);
  const typeOptions = useMemo(() => Array.from(new Set(enhancedCargoItems.map(item => item.type))), [enhancedCargoItems]);
  const zoneOptions = useMemo(() => Array.from(new Set(enhancedCargoItems.map(item => item.zone))), [enhancedCargoItems]);
  // Status color mapping
  const statusColors = {
    Placed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Conflict: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };
  // Handle cargo deletion
  const handleDeleteCargo = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this cargo item?')) {
      try {
        await deleteCargoMutation.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete cargo:', error);
        alert('Failed to delete cargo. Please try again.');
      }
    }
  };
  // Handle cargo creation
  const handleCreateCargo = async (data: CreateCargoRequest) => {
    try {
      await createCargoMutation.mutateAsync(data);
      setIsAddingCargo(false);
      lastUpdateRef.current = Date.now();
    } catch (error) {
      console.error('Failed to create cargo:', error);
      alert('Failed to create cargo. Please try again.');
    }
  };
  // Handle cargo update
  const handleUpdateCargo = async (data: UpdateCargoRequest) => {
    if (!editingCargo) return;
    try {
      await updateCargoMutation.mutateAsync(data);
      setEditingCargo(null);
      lastUpdateRef.current = Date.now();
    } catch (error) {
      console.error('Failed to update cargo:', error);
      alert('Failed to update cargo. Please try again.');
    }
  };
  // Render cargo row
  const renderCargoRow = (item: Cargo) => {
    return <div key={item.id} className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700">
          <div className="flex-1 flex items-center">
            <PackageIcon size={16} className="mr-2 text-gray-400" />
            <span className="font-medium dark:text-white">{item.name}</span>
          </div>
          <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
            {item.type}
          </div>
          <div className="flex-1">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[item.status]}`}>
              {item.status}
            </span>
          </div>
          <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
            {item.dimensions}
          </div>
          <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
            {item.weight}
          </div>
          <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
            {item.zone}
          </div>
          <div className="flex justify-end space-x-2">
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300" onClick={() => setEditingCargo(item)}>
              <EditIcon size={16} />
            </button>
            <button className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300" onClick={() => handleDeleteCargo(item.id)} disabled={deleteCargoMutation.isPending}>
              {deleteCargoMutation.isPending && deleteCargoMutation.variables === item.id ? <LoaderIcon size={16} className="animate-spin" /> : <XIcon size={16} />}
            </button>
          </div>
        </div>
      </div>;
  };
  // Render loading state
  if (isLoading) {
    return <div className="h-full flex flex-col items-center justify-center">
        <LoaderIcon className="animate-spin h-12 w-12 text-blue-500 mb-4" />
        <p className="text-lg">Loading cargo data...</p>
      </div>;
  }
  // Render error state
  if (error) {
    return <div className="h-full flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <h3 className="font-bold flex items-center">
            <AlertCircleIcon size={18} className="mr-2" />
            Error loading cargo
          </h3>
          <p>
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <button onClick={() => refetch()} className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Try Again
          </button>
        </div>
      </div>;
  }
  return <div className="h-full flex flex-col">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">Cargo Management</h1>
          {wsConnected && <span className="ml-3 flex items-center text-sm text-green-600 dark:text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
              Live
            </span>}
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center" onClick={() => setIsAddingCargo(true)}>
            <PlusIcon size={16} className="mr-2" />
            <span>Add Cargo</span>
          </button>
          <button className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center dark:text-white" onClick={() => refetch()}>
            <RefreshCwIcon size={16} className="mr-2" />
            <span>Refresh</span>
          </button>
          <button className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center dark:text-white">
            <UploadIcon size={16} className="mr-2" />
            <span>Import List</span>
          </button>
        </div>
      </div>

      {/* Form for adding/editing cargo */}
      {(isAddingCargo || editingCargo) && <div className="mb-6">
          <CargoItemForm cargo={editingCargo || undefined} onSubmit={editingCargo ? handleUpdateCargo : handleCreateCargo} onCancel={() => {
        setIsAddingCargo(false);
        setEditingCargo(null);
      }} isSubmitting={createCargoMutation.isPending || updateCargoMutation.isPending} />
        </div>}

      {/* Main content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex-1 overflow-hidden flex flex-col">
        {/* Search and filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-4 justify-between">
          <div className="relative w-full md:w-64">
            <input type="text" placeholder="Search cargo..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" />
            <SearchIcon size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md flex items-center dark:text-white" onClick={() => setShowFilters(!showFilters)}>
              <FilterIcon size={16} className="mr-2" />
              <span>Filters</span>
              <ChevronDownIcon size={16} className="ml-2" />
            </button>
            {/* Filter dropdowns */}
            {showFilters && <div className="absolute right-6 mt-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10 p-4 w-64">
                <h3 className="font-medium mb-3 dark:text-white">
                  Filter Options
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select value={statusFilter || ''} onChange={e => setStatusFilter(e.target.value || null)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                      <option value="">All Statuses</option>
                      {statusOptions.map(status => <option key={status} value={status}>
                          {status}
                        </option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Type
                    </label>
                    <select value={typeFilter || ''} onChange={e => setTypeFilter(e.target.value || null)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                      <option value="">All Types</option>
                      {typeOptions.map(type => <option key={type} value={type}>
                          {type}
                        </option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Zone
                    </label>
                    <select value={zoneFilter || ''} onChange={e => setZoneFilter(e.target.value || null)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                      <option value="">All Zones</option>
                      {zoneOptions.map(zone => <option key={zone} value={zone}>
                          {zone}
                        </option>)}
                    </select>
                  </div>
                  <div className="pt-2 flex justify-end">
                    <button onClick={() => {
                  setStatusFilter(null);
                  setTypeFilter(null);
                  setZoneFilter(null);
                }} className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>}
          </div>
        </div>

        {/* Active filters display */}
        {(statusFilter || typeFilter || zoneFilter) && <div className="bg-gray-50 dark:bg-gray-900 px-6 py-2 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Active filters:
            </span>
            {statusFilter && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter(null)} className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800">
                  <XIcon size={12} />
                </button>
              </span>}
            {typeFilter && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Type: {typeFilter}
                <button onClick={() => setTypeFilter(null)} className="ml-1 text-purple-600 dark:text-purple-400 hover:text-purple-800">
                  <XIcon size={12} />
                </button>
              </span>}
            {zoneFilter && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Zone: {zoneFilter}
                <button onClick={() => setZoneFilter(null)} className="ml-1 text-green-600 dark:text-green-400 hover:text-green-800">
                  <XIcon size={12} />
                </button>
              </span>}
          </div>}

        {/* Table header */}
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-7 px-6 py-3">
            <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Name
            </div>
            <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Type
            </div>
            <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </div>
            <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Dimensions
            </div>
            <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Weight
            </div>
            <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Zone
            </div>
            <div className="text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </div>
          </div>
        </div>

        {/* Cargo items list */}
        <div className="flex-1 overflow-y-auto">
          {filteredCargoItems.length > 0 ? <div>{filteredCargoItems.map(renderCargoRow)}</div> : <div className="flex items-center justify-center h-full p-8 text-gray-500 dark:text-gray-400">
              No cargo items match your filters.
            </div>}
        </div>
      </div>
    </div>;
};
export default CargoManagement;