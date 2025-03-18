import { PAGE_SIZE } from "@/common/constants/common.constants";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QueryDocumentSnapshot,
  endAt,
  getCountFromServer,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

type OptionsType = {
  orderBy?: { value: string; sort: "asc" | "desc" };
  page: number;
  deletedId?: string;
  search?: string;
  searchKey?: string;
};
const usePagedCollectionQuery = (
  c: CollectionReference,
  options: OptionsType
) => {
  const currentPage = useRef<number>(options.page);
  const hasSearched = useRef<boolean>(Boolean(options.search));
  const lastDoc = useRef<QueryDocumentSnapshot | null>(null);
  const [startAfterRef, setStartAfterRef] =
    useState<QueryDocumentSnapshot | null>(null);
  const q = options.search
    ? query(
        c,
        orderBy(options.searchKey || "name"),
        startAt(options.search.toUpperCase()),
        endAt(options.search.toLowerCase() + "\uf8ff")
      )
    : startAfterRef
    ? query(
        c,
        orderBy(
          options?.orderBy?.value || "date",
          options?.orderBy?.sort || "desc"
        ),
        startAfter(startAfterRef),
        limit(PAGE_SIZE)
      )
    : query(
        c,
        orderBy(
          options?.orderBy?.value || "date",
          options?.orderBy?.sort || "desc"
        ),
        limit(PAGE_SIZE)
      );
  const [response, loading] = useCollection(q, {
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [listFetched, setListFetched] = useState<
    (DocumentData & { id: string })[]
  >([]);
  const [queryInfo, setQueryInfo] = useState({
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    (async () => {
      const response = await getCountFromServer(c);
      const total = response.data().count;
      setQueryInfo({
        total,
        totalPages: total > PAGE_SIZE ? Math.ceil(total / PAGE_SIZE) : 1,
      });
    })();
  }, []);

  useEffect(() => {
    if (currentPage.current !== options.page) {
      if (options.page > currentPage.current) {
        currentPage.current = options.page;
        setStartAfterRef(lastDoc.current);
      }
    }
  }, [options.page]);

  useEffect(() => {
    if (options.deletedId) {
      setListFetched(
        listFetched.filter((item) => item.id !== options.deletedId)
      );
    }
  }, [options.deletedId]);

  // console.log(listFetched);
  useEffect(() => {
    if (response?.docs.length && !options.search && !hasSearched.current) {
      lastDoc.current = response?.docs[response.docs.length - 1] || null;
      const newListData: (DocumentData & { id: string })[] = [];
      const updateListData: (DocumentData & { id: string })[] = [];
      response?.docs.forEach((doc) => {
        const exists = listFetched.find(
          (d2) => d2.id.toString() === doc.id.toString()
        );
        if (!exists) {
          newListData.push({ ...doc.data(), id: doc.id });
        } else {
          updateListData.push({ ...doc.data(), id: doc.id });
        }
      });
      console.log(
        "new ones ===> ",
        newListData,
        "update list ===> ",
        updateListData
      );
      setListFetched([
        ...listFetched.map(
          (doc) => updateListData.find((d2) => d2.id === doc.id) || doc
        ),
        ...newListData,
      ]);
    }
    if (!options.search) {
      hasSearched.current = false;
    } else {
      hasSearched.current = true;
    }
  }, [response]);

  return {
    loading,
    ...queryInfo,
    data: options.search
      ? response?.docs.map((item) => ({ ...item.data(), id: item.id })) || []
      : listFetched.slice(
          (options.page - 1) * PAGE_SIZE,
          (options.page - 1) * PAGE_SIZE + PAGE_SIZE
        ),
  };
};

export default usePagedCollectionQuery;
