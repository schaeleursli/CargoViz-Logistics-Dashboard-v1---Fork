import { ApiClient, unwrap } from './apiClient';
import { mockAreas, mockCargo, mockUser, mockOrganization, mockProjects } from './mockData';

// Cargo domain models
export interface Area {
  id: string;
  name: string;
  surface?: string;
  elevation?: number;
  coordinates: [number, number][];
  area: number;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}
export interface Cargo {
  id: string;
  name: string;
  type: string;
  status: 'Placed' | 'Pending' | 'Conflict';
  dimensions: string;
  weight: string;
  zone: string;
  coordinates?: [number, number][];
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organizationId: string;
}
export interface Organization {
  id: string;
  name: string;
  address?: string;
  contact?: string;
}
export interface Project {
  id: string;
  name: string;
  description?: string;
  organizationId: string;
  startDate?: string;
  endDate?: string;
}

// Request and response types
export interface CreateAreaRequest {
  name: string;
  surface?: string;
  elevation?: string;
  coordinates: [number, number][];
  area: number;
  organizationId: string;
}
export interface UpdateAreaRequest {
  name?: string;
  surface?: string;
  elevation?: string;
  coordinates?: [number, number][];
  area?: number;
}
export interface CreateCargoRequest {
  name: string;
  type: string;
  dimensions: string;
  weight: string;
  zone: string;
  coordinates?: [number, number][];
  organizationId: string;
}
export interface UpdateCargoRequest {
  name?: string;
  type?: string;
  status?: 'Placed' | 'Pending' | 'Conflict';
  dimensions?: string;
  weight?: string;
  zone?: string;
  coordinates?: [number, number][];
}

// API response types
interface TokenResponse {
  token: string;
  user: User;
}
interface ProjectsResponse {
  projects: Project[];
}
interface AreasResponse {
  areas: Area[];
}
interface CargoResponse {
  cargo: Cargo[];
}

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development' || false;

// The enhanced CargoViz API client
class CargoVizAPIClient extends ApiClient {
  constructor() {
    // More defensive environment variable handling
    const apiUrl = typeof __API_URL__ !== 'undefined' && __API_URL__ ? __API_URL__ : window._env_?.CARGOVIZ_API_URL ??
    // runtime fallback for iframe previews
    'https://api.cargoviz.com/api';
    const timeout = 10000;
    super({
      baseURL: apiUrl,
      timeout: timeout
    });
  }

  // Authentication
  async login(email: string, password: string): Promise<TokenResponse> {
    // In development, use mock data
    if (isDevelopment) {
      return Promise.resolve({
        token: 'mock-token-for-development',
        user: mockUser
      });
    }
    return await this.post<TokenResponse>('/token', {
      email,
      password
    });
  }

  // Projects
  async getProjects(orgId: string): Promise<Project[]> {
    if (isDevelopment) {
      return Promise.resolve(mockProjects);
    }
    const response = await this.post<ProjectsResponse>('/Variant/Projects/GetProjects', {
      orgId
    });
    return response.projects || [];
  }
  async getProjectsForUser(userId: string): Promise<Project[]> {
    if (isDevelopment) {
      return Promise.resolve(mockProjects);
    }
    const response = await this.get<ProjectsResponse>(`/Variant/Projects/GetProjectsForUser/${userId}`);
    return response.projects || [];
  }

  // Organizations
  async getMyOrganization(userId: string): Promise<Organization> {
    if (isDevelopment) {
      return Promise.resolve(mockOrganization);
    }
    return await this.get<Organization>(`/Variant/Organizations/GetMyOrganization/${userId}`);
  }

  // Areas
  async getAreas(orgId: string): Promise<Area[]> {
    if (isDevelopment) {
      return Promise.resolve(mockAreas);
    }
    const response = await this.get<AreasResponse>(`/Variant/Areas/GetAreas/${orgId}`);
    return response.areas || [];
  }
  async createArea(data: CreateAreaRequest): Promise<Area> {
    if (isDevelopment) {
      const newArea: Area = {
        id: `area-${Date.now()}`,
        name: data.name,
        surface: data.surface,
        elevation: data.elevation ? parseFloat(data.elevation) : 10,
        coordinates: data.coordinates,
        area: data.area,
        organizationId: data.organizationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockAreas.push(newArea);
      return Promise.resolve(newArea);
    }
    return await this.post<Area>('/Variant/Areas/CreateArea', data);
  }
  async updateArea(areaId: string, data: UpdateAreaRequest): Promise<Area> {
    if (isDevelopment) {
      const areaIndex = mockAreas.findIndex(area => area.id === areaId);
      if (areaIndex === -1) {
        throw new Error(`Area with ID ${areaId} not found`);
      }
      const updatedArea = {
        ...mockAreas[areaIndex],
        ...data,
        elevation: data.elevation ? parseFloat(data.elevation) : mockAreas[areaIndex].elevation,
        updatedAt: new Date().toISOString()
      };
      mockAreas[areaIndex] = updatedArea;
      return Promise.resolve(updatedArea);
    }
    return await this.put<Area>(`/Variant/Areas/UpdateArea/${areaId}`, data);
  }
  async deleteArea(areaId: string): Promise<void> {
    if (isDevelopment) {
      const areaIndex = mockAreas.findIndex(area => area.id === areaId);
      if (areaIndex !== -1) {
        mockAreas.splice(areaIndex, 1);
      }
      return Promise.resolve();
    }
    await this.delete<void>(`/Variant/Areas/DeleteArea/${areaId}`);
  }

  // Cargo
  async getCargo(orgId: string): Promise<Cargo[]> {
    if (isDevelopment) {
      return Promise.resolve(mockCargo);
    }
    const response = await this.get<CargoResponse>(`/Variant/Cargo/GetCargo/${orgId}`);
    return response.cargo || [];
  }
  async createCargo(data: CreateCargoRequest): Promise<Cargo> {
    if (isDevelopment) {
      const newCargo: Cargo = {
        id: `cargo-${Date.now()}`,
        name: data.name,
        type: data.type,
        status: 'Pending',
        dimensions: data.dimensions,
        weight: data.weight,
        zone: data.zone,
        coordinates: data.coordinates,
        organizationId: data.organizationId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockCargo.push(newCargo);
      return Promise.resolve(newCargo);
    }
    return await this.post<Cargo>('/Variant/Cargo/CreateCargo', data);
  }
  async updateCargo(cargoId: string, data: UpdateCargoRequest): Promise<Cargo> {
    if (isDevelopment) {
      const cargoIndex = mockCargo.findIndex(cargo => cargo.id === cargoId);
      if (cargoIndex === -1) {
        throw new Error(`Cargo with ID ${cargoId} not found`);
      }
      const updatedCargo = {
        ...mockCargo[cargoIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
      mockCargo[cargoIndex] = updatedCargo;
      return Promise.resolve(updatedCargo);
    }
    return await this.put<Cargo>(`/Variant/Cargo/UpdateCargo/${cargoId}`, data);
  }
  async deleteCargo(cargoId: string): Promise<void> {
    if (isDevelopment) {
      const cargoIndex = mockCargo.findIndex(cargo => cargo.id === cargoId);
      if (cargoIndex !== -1) {
        mockCargo.splice(cargoIndex, 1);
      }
      return Promise.resolve();
    }
    await this.delete<void>(`/Variant/Cargo/DeleteCargo/${cargoId}`);
  }
}
export const cargoVizAPI = new CargoVizAPIClient();