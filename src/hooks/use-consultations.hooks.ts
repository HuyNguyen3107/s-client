import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/query-key.constants";
import { MUTATION_KEYS } from "../constants/mutation-key.constants";
import { API_PATHS } from "../constants/api-path.constants";
import http from "../libs/http.libs";

export interface Consultation {
  id: string;
  customerName: string;
  phoneNumber: string;
  status: "pending" | "contacted" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  notes?: string;
  assignedTo?: {
    userId: string;
    userName: string;
  } | null;
}

export interface CreateConsultationDto {
  customerName: string;
  phoneNumber: string;
}

const createConsultation = async (
  data: CreateConsultationDto
): Promise<{ success: boolean; message: string; data: Consultation }> => {
  const response = await http.post(API_PATHS.CONSULTATIONS, data);
  return response.data;
};

const fetchConsultations = async (): Promise<{
  success: boolean;
  data: Consultation[];
  total: number;
}> => {
  const response = await http.get(API_PATHS.CONSULTATIONS);
  return response.data;
};

const fetchMyConsultations = async (
  userId: string
): Promise<{
  success: boolean;
  data: Consultation[];
  total: number;
}> => {
  const response = await http.get(
    `${API_PATHS.CONSULTATIONS}/my-consultations/${userId}`
  );
  return response.data;
};

const assignConsultationToMe = async (data: {
  consultationId: string;
  userId: string;
  userName: string;
}): Promise<{ success: boolean; message: string; data: Consultation }> => {
  const response = await http.patch(
    `${API_PATHS.CONSULTATIONS}/${data.consultationId}/assign`,
    { userId: data.userId, userName: data.userName }
  );
  return response.data;
};

const updateConsultationStatus = async (data: {
  id: string;
  status: Consultation["status"];
  notes?: string;
}): Promise<{ success: boolean; message: string; data: Consultation }> => {
  const response = await http.patch(
    API_PATHS.CONSULTATION_UPDATE_STATUS(data.id),
    { status: data.status, notes: data.notes }
  );
  return response.data;
};

export const useCreateConsultation = () => {
  return useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_CONSULTATION],
    mutationFn: createConsultation,
  });
};

export const useConsultations = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CONSULTATIONS],
    queryFn: fetchConsultations,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMyConsultations = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.CONSULTATIONS, "my", userId],
    queryFn: () => fetchMyConsultations(userId),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
};

export const useAssignConsultation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.ASSIGN_CONSULTATION],
    mutationFn: assignConsultationToMe,
    onSuccess: (result, variables) => {
      // Update cache for my consultations immediately (optimistic UI)
      const key = [QUERY_KEYS.CONSULTATIONS, "my", variables.userId];
      const existing: any = queryClient.getQueryData(key);
      if (existing && Array.isArray(existing.data)) {
        const list = existing.data as Consultation[];
        const idx = list.findIndex((c) => c.id === variables.consultationId);
        const updated = result.data;
        const nextList = [...list];
        if (idx >= 0) {
          nextList[idx] = updated as any;
        } else {
          nextList.unshift(updated as any);
        }
        queryClient.setQueryData(key, {
          success: true,
          data: nextList,
          total: existing.total !== undefined ? existing.total + (idx >= 0 ? 0 : 1) : nextList.length,
        });
      }

      // Invalidate all consultation queries to refetch latest data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONSULTATIONS] });
    },
  });
};

export const useUpdateConsultationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_CONSULTATION_STATUS || "update-consultation-status"],
    mutationFn: updateConsultationStatus,
    onSuccess: (result) => {
      const updated = result.data;
      const allKey = [QUERY_KEYS.CONSULTATIONS];
      const existingAll: any = queryClient.getQueryData(allKey);
      if (existingAll && Array.isArray(existingAll.data)) {
        const list = existingAll.data as Consultation[];
        const nextList = list.map((c) => (c.id === updated.id ? (updated as any) : c));
        queryClient.setQueryData(allKey, {
          success: true,
          data: nextList,
          total: existingAll.total ?? nextList.length,
        });
      }

      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONSULTATIONS] });
    },
  });
};
