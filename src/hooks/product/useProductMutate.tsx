import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "../../http/api";
import { FormInstance } from "antd";
import { Product } from "../../types";

export const useProductMutate = (
  form: FormInstance,
  currentEditingProduct: Product | null,
  setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const queryClient = useQueryClient();

  const { mutate: productMutate, isPending: isProductPending } = useMutation({
    mutationKey: ["product"],

    mutationFn: async (data: FormData) => {
      if (currentEditingProduct) {
        // edit mode
        return updateProduct(data, currentEditingProduct._id).then(
          (res) => res.data
        );
      } else {
        return createProduct(data).then((res) => res.data);
      }
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      form.resetFields();
      setIsDrawerOpen(false);

      return;
    },
  });

  return { productMutate, isProductPending };
};
