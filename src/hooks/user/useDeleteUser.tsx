import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../../http/api";

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const { mutate: deleteUserMutation } = useMutation({
    mutationKey: ["delete-user"],

    mutationFn: async (id: string | null) =>
      deleteUser(id as string).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  return { deleteUserMutation };
};
