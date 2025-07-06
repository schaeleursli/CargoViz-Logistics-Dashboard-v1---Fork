import { ApiClient, ApiError } from './apiClient';

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

// The enhanced CargoViz API client
class CargoVizAPIClient extends ApiClient {
  constructor() {
    // Get configuration from window._env_ or use defaults
    const apiUrl = typeof window !== 'undefined' && window._env_ ? window._env_.REACT_APP_CARGOVIZ_API_URL : 'https://api.cargoviz.com/api';
    const timeout = typeof window !== 'undefined' && window._env_ ? parseInt(window._env_.REACT_APP_API_TIMEOUT || '10000') : 10000;
    super({
      baseURL: apiUrl,
      timeout: timeout
    });
  }

  // Authentication
  async login(email: string, password: string): Promise<{
    token: string;
    user: User;
  }> {
    const response = await this.client.post('/token', {
      email,
      password
    });
    return response.data;
  }

  // Projects
  async getProjects(orgId: string): Promise<Project[]> {
    const response = await this.client.post('/Variant/Projects/GetProjects', {
      orgId
    });
    return response.data.projects || [];
  }
  async getProjectsForUser(userId: string): Promise<Project[]> {
    const response = await this.client.get(`/Variant/Projects/GetProjectsForUser/${userId}`);
    return response.data.projects || [];
  }

  // Organizations
  async getMyOrganization(userId: string): Promise<Organization> {
    const response = await this.client.get(`/Variant/Organizations/GetMyOrganization/${userId}`);
    return response.data;
  }

  // Areas
  async getAreas(orgId: string): Promise<Area[]> {
    const response = await this.client.get(`/Variant/Areas/GetAreas/${orgId}`);
    return response.data.areas || [];
  }
  async createArea(data: CreateAreaRequest): Promise<Area> {
    const response = await this.client.post('/Variant/Areas/CreateArea', data);
    return response.data;
  }
  async updateArea(areaId: string, data: UpdateAreaRequest): Promise<Area> {
    const response = await this.client.put(`/Variant/Areas/UpdateArea/${areaId}`, data);
    return response.data;
  }
  async deleteArea(areaId: string): Promise<void> {
    await this.client.delete(`/Variant/Areas/DeleteArea/${areaId}`);
  }

  // Cargo
  async getCargo(orgId: string): Promise<Cargo[]> {
    const response = await this.client.get(`/Variant/Cargo/GetCargo/${orgId}`);
    return response.data.cargo || [];
  }
  async createCargo(data: CreateCargoRequest): Promise<Cargo> {
    const response = await this.client.post('/Variant/Cargo/CreateCargo', data);
    return response.data;
  }
  async updateCargo(cargoId: string, data: UpdateCargoRequest): Promise<Cargo> {
    const response = await this.client.put(`/Variant/Cargo/UpdateCargo/${cargoId}`, data);
    return response.data;
  }
  async deleteCargo(cargoId: string): Promise<void> {
    await this.client.delete(`/Variant/Cargo/DeleteCargo/${cargoId}`);
  }
}
export const cargoVizAPI = new CargoVizAPIClient();