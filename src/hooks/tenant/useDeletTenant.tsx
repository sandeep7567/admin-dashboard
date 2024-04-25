import { AxiosError } from "axios";
import { deleteTenant } from "../../http/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeletTenant = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteTenantMutation } = useMutation({
    mutationKey: ["delete-tenant"],

    mutationFn: async (id: string | null) =>
      deleteTenant(id!).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      return;
    },
    onError: async (err) => {
      if (err instanceof AxiosError) {
        err?.response?.status === 500 &&
          alert(
            "Cannot delete this tenant. Delete all associated users first." +
              err
          );
      } else {
        console.log("Please try again after some time", err);
      }
      return;
    },
  });

  return { deleteTenantMutation };
};

export default useDeletTenant;
