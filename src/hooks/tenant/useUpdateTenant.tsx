import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTenantData } from "../../types";
import { updateTenant } from "../../http/api";

export const useUpdateTenant = (id: string | undefined) => {
  const queryClient = useQueryClient();

  const { mutate: updateTenantMutation } = useMutation({
    mutationKey: ["update-tenant"],

    mutationFn: async (data: CreateTenantData) =>
      updateTenant(data, id!).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
  });

  return { updateTenantMutation };
};
