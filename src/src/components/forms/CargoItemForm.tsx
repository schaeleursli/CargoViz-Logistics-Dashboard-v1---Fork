import React, { useEffect, useState } from 'react';
import { PackageIcon, SaveIcon, XIcon, LoaderIcon } from 'lucide-react';
import { Cargo, CreateCargoRequest, UpdateCargoRequest } from '../../services/cargoVizAPI';
import { useAreas } from '../../hooks/useCargoVizData';
interface CargoItemFormProps {
  cargo?: Cargo;
  onSubmit: (data: CreateCargoRequest | UpdateCargoRequest) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}
const CargoItemForm: React.FC<CargoItemFormProps> = ({
  cargo,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const {
    data: areaData
  } = useAreas();
  const [name, setName] = useState('');
  const [type, setType] = useState('Container');
  const [dimensions, setDimensions] = useState('');
  const [weight, setWeight] = useState('');
  const [zone, setZone] = useState('');
  const [status, setStatus] = useState<'Placed' | 'Pending' | 'Conflict'>('Pending');
  // Populate form with cargo data if editing
  useEffect(() => {
    if (cargo) {
      setName(cargo.name);
      setType(cargo.type);
      setDimensions(cargo.dimensions);
      setWeight(cargo.weight);
      setZone(cargo.zone);
      setStatus(cargo.status);
    }
  }, [cargo]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name,
      type,
      dimensions,
      weight,
      zone,
      ...(cargo && {
        status
      })
    };
    await onSubmit(data);
  };
  const cargoTypes = ['Container', 'Pallet', 'Crate', 'Equipment', 'Vehicle', 'Other'];
  return <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <PackageIcon size={20} className="mr-2" />
          {cargo ? 'Edit Cargo Item' : 'Add New Cargo Item'}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <XIcon size={20} />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="name">
              Cargo Name
            </label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" placeholder="Enter cargo name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="type">
              Cargo Type
            </label>
            <select id="type" value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
              {cargoTypes.map(cargoType => <option key={cargoType} value={cargoType}>
                  {cargoType}
                </option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="dimensions">
                Dimensions
              </label>
              <input id="dimensions" type="text" value={dimensions} onChange={e => setDimensions(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" placeholder="e.g. 10' x 8' x 8'" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="weight">
                Weight
              </label>
              <input id="weight" type="text" value={weight} onChange={e => setWeight(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white" placeholder="e.g. 2000 lbs" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="zone">
              Zone
            </label>
            <select id="zone" value={zone} onChange={e => setZone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
              <option value="">-- Select Zone --</option>
              {areaData?.map(area => <option key={area.id} value={area.name}>
                  {area.name}
                </option>)}
            </select>
          </div>
          {cargo && <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="status">
                Status
              </label>
              <select id="status" value={status} onChange={e => setStatus(e.target.value as 'Placed' | 'Pending' | 'Conflict')} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                <option value="Placed">Placed</option>
                <option value="Pending">Pending</option>
                <option value="Conflict">Conflict</option>
              </select>
            </div>}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 flex items-center">
            {isSubmitting ? <>
                <LoaderIcon size={16} className="animate-spin mr-2" />
                Saving...
              </> : <>
                <SaveIcon size={16} className="mr-2" />
                {cargo ? 'Update Cargo' : 'Add Cargo'}
              </>}
          </button>
        </div>
      </form>
    </div>;
};
export default CargoItemForm;