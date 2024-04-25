import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";
import { QueryParams } from "../../types";

export const useFetchTenants = (queryParams: QueryParams) => {
  const {
    data: tenants,
    isError,
    isFetching,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["tenants", queryParams],
    queryFn: async () => {
      const filterParams = Object.entries(queryParams).filter(
        ([, value]) => !!value
      );

      const queryString = new URLSearchParams(
        filterParams as unknown as Record<string, string>
      ).toString();

      return getTenants(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  return { tenants, isError, isFetching, error, isSuccess };
};
