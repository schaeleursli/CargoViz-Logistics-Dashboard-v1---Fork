import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cargoVizAPI, Area, Cargo, Project, Organization, CreateAreaRequest, UpdateAreaRequest, CreateCargoRequest, UpdateCargoRequest } from '../services/cargoVizAPI';
import { ApiError } from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';

// Projects
export const useProjects = () => {
  const {
    user
  } = useAuth();
  return useQuery<Project[], ApiError>({
    queryKey: ['projects', user?.id],
    queryFn: () => cargoVizAPI.getProjectsForUser(user!.id),
    enabled: !!user?.id
  });
};

// Organization
export const useOrganization = () => {
  const {
    user
  } = useAuth();
  return useQuery<Organization, ApiError>({
    queryKey: ['organization', user?.id],
    queryFn: () => cargoVizAPI.getMyOrganization(user!.id),
    enabled: !!user?.id
  });
};

// Areas/Zones
export const useAreas = () => {
  const {
    data: organization
  } = useOrganization();
  return useQuery<Area[], ApiError>({
    queryKey: ['areas', organization?.id],
    queryFn: () => cargoVizAPI.getAreas(organization!.id),
    enabled: !!organization?.id
  });
};
export const useCreateArea = () => {
  const queryClient = useQueryClient();
  const {
    data: organization
  } = useOrganization();
  return useMutation<Area, ApiError, Omit<CreateAreaRequest, 'organizationId'>>({
    mutationFn: data => cargoVizAPI.createArea({
      ...data,
      organizationId: organization!.id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['areas']
      });
    }
  });
};
export const useUpdateArea = (areaId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Area, ApiError, UpdateAreaRequest>({
    mutationFn: data => cargoVizAPI.updateArea(areaId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['areas']
      });
    }
  });
};
export const useDeleteArea = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: (areaId: string) => cargoVizAPI.deleteArea(areaId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['areas']
      });
    }
  });
};

// Cargo
export const useCargo = () => {
  const {
    data: organization
  } = useOrganization();
  return useQuery<Cargo[], ApiError>({
    queryKey: ['cargo', organization?.id],
    queryFn: () => cargoVizAPI.getCargo(organization!.id),
    enabled: !!organization?.id
  });
};
export const useCreateCargo = () => {
  const queryClient = useQueryClient();
  const {
    data: organization
  } = useOrganization();
  return useMutation<Cargo, ApiError, Omit<CreateCargoRequest, 'organizationId'>>({
    mutationFn: data => cargoVizAPI.createCargo({
      ...data,
      organizationId: organization!.id
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cargo']
      });
    }
  });
};
export const useUpdateCargo = (cargoId: string) => {
  const queryClient = useQueryClient();
  return useMutation<Cargo, ApiError, UpdateCargoRequest>({
    mutationFn: data => cargoVizAPI.updateCargo(cargoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cargo']
      });
    }
  });
};
export const useDeleteCargo = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: (cargoId: string) => cargoVizAPI.deleteCargo(cargoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cargo']
      });
    }
  });
};

// Legacy hooks for backward compatibility
// These should be deprecated and removed in future versions
export const useProjectsLegacy = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    user
  } = useAuth();
  useEffect(() => {
    if (user?.id) {
      fetchProjects();
    }
  }, [user]);
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await cargoVizAPI.getProjectsForUser(user!.id);
      setProjects(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };
  return {
    projects,
    loading,
    error,
    refetch: fetchProjects
  };
};
export const useOrganizationLegacy = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    user
  } = useAuth();
  useEffect(() => {
    if (user?.id) {
      fetchOrganization();
    }
  }, [user]);
  const fetchOrganization = async () => {
    try {
      setLoading(true);
      const response = await cargoVizAPI.getMyOrganization(user!.id);
      setOrganization(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organization');
    } finally {
      setLoading(false);
    }
  };
  return {
    organization,
    loading,
    error,
    refetch: fetchOrganization
  };
};
export const useAreasLegacy = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    organization
  } = useOrganizationLegacy();
  useEffect(() => {
    if (organization?.id) {
      fetchAreas();
    }
  }, [organization]);
  const fetchAreas = async () => {
    try {
      setLoading(true);
      const response = await cargoVizAPI.getAreas(organization!.id);
      setAreas(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch areas');
    } finally {
      setLoading(false);
    }
  };
  return {
    areas,
    loading,
    error,
    refetch: fetchAreas
  };
};
export const useCargoLegacy = () => {
  const [cargo, setCargo] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    organization
  } = useOrganizationLegacy();
  useEffect(() => {
    if (organization?.id) {
      fetchCargo();
    }
  }, [organization]);
  const fetchCargo = async () => {
    try {
      setLoading(true);
      const response = await cargoVizAPI.getCargo(organization!.id);
      setCargo(response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cargo');
    } finally {
      setLoading(false);
    }
  };
  return {
    cargo,
    loading,
    error,
    refetch: fetchCargo
  };
};