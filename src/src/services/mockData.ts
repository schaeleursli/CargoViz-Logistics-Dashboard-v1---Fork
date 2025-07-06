// Mock data for development
export const mockAreas = [{
  id: 'area-1',
  name: 'Storage Area A',
  surface: 'Concrete',
  elevation: 12,
  coordinates: [[47.6062, -122.3321], [47.6072, -122.3321], [47.6072, -122.3301], [47.6062, -122.3301]],
  area: 2500,
  organizationId: 'org-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}, {
  id: 'area-2',
  name: 'Container Zone B',
  surface: 'Asphalt',
  elevation: 10,
  coordinates: [[47.6082, -122.3341], [47.6092, -122.3341], [47.6092, -122.3321], [47.6082, -122.3321]],
  area: 1800,
  organizationId: 'org-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}, {
  id: 'area-3',
  name: 'Heavy Equipment',
  surface: 'Reinforced',
  elevation: 8,
  coordinates: [[47.6052, -122.3361], [47.6062, -122.3361], [47.6062, -122.3341], [47.6052, -122.3341]],
  area: 3200,
  organizationId: 'org-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}];
export const mockCargo = [{
  id: 'cargo-1',
  name: 'Container A-123',
  type: 'Container',
  status: 'Placed',
  dimensions: "20' x 8' x 8'",
  weight: '15,000 lbs',
  zone: 'Storage Area A',
  coordinates: [[47.6065, -122.3315]],
  organizationId: 'org-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}, {
  id: 'cargo-2',
  name: 'Pallet B-456',
  type: 'Pallet',
  status: 'Pending',
  dimensions: "4' x 4' x 5'",
  weight: '2,500 lbs',
  zone: 'Container Zone B',
  coordinates: [[47.6085, -122.3335]],
  organizationId: 'org-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}, {
  id: 'cargo-3',
  name: 'Crate C-789',
  type: 'Crate',
  status: 'Conflict',
  dimensions: "6' x 4' x 4'",
  weight: '3,200 lbs',
  zone: 'Heavy Equipment',
  coordinates: [[47.6055, -122.3355]],
  organizationId: 'org-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}];
export const mockUser = {
  id: 'user-1',
  name: 'Admin User',
  email: 'admin@cargoviz.com',
  role: 'Admin',
  organizationId: 'org-1'
};
export const mockOrganization = {
  id: 'org-1',
  name: 'Port of Seattle',
  address: '2711 Alaskan Way, Seattle, WA 98121',
  contact: '206-787-3000'
};
export const mockProjects = [{
  id: 'project-1',
  name: 'Port of Seattle',
  description: 'Main port operations',
  organizationId: 'org-1',
  startDate: '2023-01-01',
  endDate: '2023-12-31'
}, {
  id: 'project-2',
  name: 'Oakland Terminal',
  description: 'Oakland expansion',
  organizationId: 'org-1',
  startDate: '2023-02-15',
  endDate: '2023-11-30'
}];