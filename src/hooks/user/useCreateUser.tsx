import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../../http/api";
import { CreateUserData } from "../../types";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const { mutate: userMutate } = useMutation({
    mutationKey: ["user"],

    mutationFn: async (data: CreateUserData) =>
      createUser(data).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      return;
    },
  });

  return { userMutate };
};
