import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTenantData } from "../../types";
import { createTenant } from "../../http/api";

export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  const { mutate: tenantMutate } = useMutation({
    mutationKey: ["tenant"],

    mutationFn: async (data: CreateTenantData) =>
      createTenant(data).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
  });

  return { tenantMutate };
};
