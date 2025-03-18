import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useListFilters = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState({
    page: 1,
    sortBy: "",
  });
  useEffect(() => {
    setFilters({
      page: parseInt(searchParams.get("page") ?? "1"),
      sortBy: searchParams.get("sortBy") ?? "",
    });
  }, []);

  useEffect(() => {
    router.push(`${pathname}?page=${filters.page}&sortBy=${filters.sortBy}`, {
      scroll: false,
    });
  }, [filters]);

  return { filters, setFilters };
};

export default useListFilters;
