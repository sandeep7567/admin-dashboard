import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { QueryParams } from "../../types";

export const useFetchUsers = (queryParams: QueryParams) => {
  const {
    data: users,
    isError,
    isFetching,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: async () => {
      const filterParams = Object.entries(queryParams).filter(
        ([, value]) => !!value
      );

      const queryString = new URLSearchParams(
        filterParams as unknown as Record<string, string>
      ).toString();

      return getUsers(queryString).then((res) => res.data);
    },
    placeholderData: keepPreviousData,
  });

  return { users, isError, isFetching, error, isSuccess };
};
