import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCategories } from "../../http/api";

export const useFetchCategories = () => {
  const {
    data: categories,
    isError: isCategoriesError,
    isFetching: isCategoriesFetching,
    error: categoriesError,
    isSuccess: isCategoriesSuccess,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return getCategories().then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  return {
    categories,
    isCategoriesError,
    isCategoriesFetching,
    categoriesError,
    isCategoriesSuccess,
  };
};
