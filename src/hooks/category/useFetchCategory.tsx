import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../http/api";
import { Category } from "../../types";

export const useFetchCategory = (categoryId: string) => {
  const {
    data: category,
    isError: isCategoryError,
    isFetching: isCategoryFetching,
    error: categoryError,
    isSuccess: isCategorySuccess,
  } = useQuery<Category>({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      return getCategory(categoryId).then((res) => res.data);
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    category,
    isCategoryError,
    isCategoryFetching,
    categoryError,
    isCategorySuccess,
  };
};
