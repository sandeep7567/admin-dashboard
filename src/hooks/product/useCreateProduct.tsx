import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../http/api";
import { FormInstance } from "antd";

export const useCreateProduct = (
  form: FormInstance,
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();

  const { mutate: productMutate, isPending: isProductPending } = useMutation({
    mutationKey: ["product"],

    mutationFn: async (data: FormData) =>
      createProduct(data).then((res) => res.data),

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      form.resetFields();
      setIsDrawerOpen(false);

      return;
    },
  });

  return { productMutate, isProductPending };
};
