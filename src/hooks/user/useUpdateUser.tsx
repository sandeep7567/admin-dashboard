import { QueryClient, useMutation } from "@tanstack/react-query";
import { CreateUserData } from "../../types";
import { updateUser } from "../../http/api";

export const useUpdateUser = (id: string | undefined) => {
  const queryClient = new QueryClient();
  const { mutate: updateUserMutation } = useMutation({
    mutationKey: ["update-user"],

    mutationFn: async (data: CreateUserData) =>
      updateUser(data, id!).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  return { updateUserMutation };
};
