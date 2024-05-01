import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts } from "../../http/api";
import { QueryParams } from "../../types";

export const useFetchProducts = (queryParams: QueryParams) => {
  const {
    data: products,
    isError,
    isFetching,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: async () => {
      const filterParams = Object.entries(queryParams).filter(
        ([, value]) => !!value
      );

      const queryString = new URLSearchParams(
        filterParams as unknown as Record<string, string>
      ).toString();

      return getProducts(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  return { products, isError, isFetching, error, isSuccess };
};
