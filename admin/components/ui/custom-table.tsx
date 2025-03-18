"use client";
import React, { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { twMerge } from "tailwind-merge";
import { Input } from "./input";
import SearchInput from "./search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Button } from "./button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { IoIosOptions } from "react-icons/io";
import { Separator } from "./separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { ArrowDown, ArrowUp } from "lucide-react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Label } from "./label";
import { sortList } from "@/common/utils/misc.utils";

export type TableActionType = {
  key: number | string;
  name: string;
  onAction: (selectedList: string[]) => void;
};

export enum DEFAULT_TABLE_ACTIONS_ENUM {
  delete = "del",
}

export const DEFAULT_TABLE_ACTIONS: TableActionType[] = [
  {
    key: DEFAULT_TABLE_ACTIONS_ENUM.delete,
    name: "Delete All",
    onAction: (selectedList) => {},
  },
];

export type RowActionType = {
  title?: string | React.ReactElement | number;
  icon?: React.ReactElement;
  elem?: React.ReactElement;
  isLink?: boolean;
  href?: string;
  onAction: (id: string) => void;
};

export type TableRowType = {
  id: string;
  rowClassName?: string;
  actions?: RowActionType[];
  list: {
    data: string | React.ReactElement | number;
    itemClassName?: string;
  }[];
  searchableKeyValues?: { [key: string]: string };
  sortableKeyValues?: { [key: string]: string | number };
};

export type TableHeaderRowType = {
  text: string | React.ReactElement | number;
  itemClassName?: string;
  sortable?: {
    desc: string;
    asc: string;
    curr: SortStateEnum;
  };
};

export enum SortStateEnum {
  asc,
  desc,
}

interface props {
  headerList: TableHeaderRowType[];
  rows: TableRowType[];
  allCellClassName?: string;
  emptyPlaceholderText?: string;
  shouldNotSelect?: boolean;
  onSearchSubmit?: (d: { search?: string }) => void;
  useDefaultSearch?: boolean;
  searchables?: string[];
  actions?: TableActionType[];
  rightElements?: React.ReactElement[];
  shouldNotNumber?: boolean;
  page?: number;
  setPage?: (p: number) => void;
  totalPages?: number;
  total?: number;
  numInPage?: number;
  sortBy?: string;
  setSortBy?: (val: string) => void;
  useDefaultSort?: boolean;
  hideSearch?: boolean;
  renderSearch?: ({
    search,
    setSearch,
  }: {
    search: string;
    setSearch: (val: string) => void;
  }) => React.ReactElement;
  searchOptions?: Object;
  showOnlySearched?: boolean;
}

const CustomTable: React.FC<props> = ({
  headerList,
  rows,
  allCellClassName,
  emptyPlaceholderText,
  shouldNotSelect,
  onSearchSubmit,
  useDefaultSearch,
  actions,
  rightElements,
  shouldNotNumber,
  page,
  totalPages,
  setPage,
  total,
  numInPage,
  sortBy,
  setSortBy,
  searchables,
  useDefaultSort,
  renderSearch,
  searchOptions,
  showOnlySearched,
  hideSearch,
}) => {
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [searchedRows, setSearchedRows] = useState<TableRowType[]>([]);
  return (
    <div className="relative rounded-md border">
      <div className="flex items-center justify-between">
        {!hideSearch && (
          <div className="flex items-center lg:w-[50%] space-x-1">
            {useDefaultSearch ? (
              <TableDefaultSearcher
                searchedRows={searchedRows}
                setSearchedRows={setSearchedRows}
                rows={rows}
                searchables={searchables || []}
                renderInput={renderSearch}
                searchOptions={searchOptions}
              />
            ) : (
              onSearchSubmit && <SearchInput onSubmit={onSearchSubmit} />
            )}
            {actions && (
              <CustomTableActionSelector
                actions={actions}
                selectedList={selectedList}
              />
            )}
          </div>
        )}

        <TableTopRightElements
          rightElements={rightElements}
          actions={actions}
          selectedList={selectedList}
        />
      </div>
      <div className="bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              {!shouldNotNumber && (
                <TableHead
                  className={twMerge("font-bold whitespace-nowrap w-[20px]")}
                >
                  #
                </TableHead>
              )}

              {!shouldNotSelect && (
                <TableSelectAllInput
                  rows={rows}
                  selectedList={selectedList}
                  setSelectedList={setSelectedList}
                />
              )}
              {headerList.map((item, indx) =>
                item.sortable &&
                typeof sortBy !== "undefined" &&
                typeof setSortBy !== "undefined" ? (
                  <TableHeadSortable
                    key={indx}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    item={item}
                  />
                ) : (
                  <TableHead
                    key={indx}
                    className={twMerge(
                      "font-bold whitespace-nowrap md:text-md sm:text-sm text-xs",
                      item.itemClassName
                    )}
                  >
                    {item.text}
                  </TableHead>
                )
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* 
            Use searched rows or sorted list if useDefaultSort is turned on. 
            Else the rows as passed into component is used.
            If showOnlySearched is true, only searched rows are rendered
          */}
            {(showOnlySearched
              ? searchedRows
              : searchedRows.length > 0
              ? searchedRows
              : useDefaultSort && sortBy
              ? (sortList(rows, sortBy, "sortableKeyValues") as TableRowType[])
              : rows
            ).map((row, indx) => (
              <TableRow className={row.rowClassName} key={row.id}>
                {!shouldNotNumber && (
                  <TableCell
                    className={twMerge(
                      "md:text-md sm:text-sm text-xs w-[20px]"
                    )}
                  >
                    {indx + 1 + (numInPage || 7) * ((page || 1) - 1)}
                  </TableCell>
                )}
                {!shouldNotSelect && (
                  <TableSelectInput
                    id={row.id}
                    selectedList={selectedList}
                    setSelectedList={setSelectedList}
                    allCellClassName={allCellClassName}
                  />
                )}
                {row.list.map((item, indx) => (
                  <TableCell
                    key={`${row.id + indx}`}
                    className={twMerge(
                      "md:text-md sm:text-sm text-xs",
                      allCellClassName,
                      item.itemClassName
                    )}
                  >
                    {item.data}
                  </TableCell>
                ))}
                {row.actions && (
                  <TableCell
                    className={twMerge(
                      "md:text-md sm:text-sm text-xs flex items-center space-x-1 border-l",
                      allCellClassName
                    )}
                  >
                    {row.actions?.map((action, indx) => (
                      <React.Fragment key={indx}>
                        {action.isLink ? (
                          <Link href={action.href || "#"}>
                            {action.elem ? (
                              action.elem
                            ) : (
                              <Button
                                variant="outline"
                                className="flex items-center space-x-1"
                              >
                                {action.icon}
                                <span>{action.title}</span>
                              </Button>
                            )}
                          </Link>
                        ) : action.elem ? (
                          action.elem
                        ) : (
                          <Button
                            variant="outline"
                            className="flex items-center space-x-1"
                            onClick={(e) => {
                              e.preventDefault();
                              action.onAction(row.id);
                            }}
                          >
                            {action.icon}
                            <span>{action.title}</span>
                          </Button>
                        )}
                      </React.Fragment>
                    ))}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {(showOnlySearched ? !searchedRows.length : !rows.length) && (
          <div className="w-full h-[100px] border border-gray-300 rounded-xl flex items-center justify-center">
            <p className="koho-R text-md text-gray-500">
              {emptyPlaceholderText || "No Results"}
            </p>
          </div>
        )}
        {totalPages && page && setPage && total && (
          <TablePagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            total={total}
          />
        )}
      </div>
    </div>
  );
};

export const CustomTableActionSelector = (props: {
  actions: TableActionType[];
  selectedList: string[];
  showMob?: boolean;
}) => {
  const [selected, setSelected] = useState<string>("");
  return (
    <div
      className={twMerge(
        "md:flex hidden items-center",
        props.showMob ? "flex" : ""
      )}
    >
      <Select
        value={selected}
        onValueChange={(value) => {
          setSelected(value);
        }}
      >
        <SelectTrigger className="md:w-[180px] w-[260px]">
          <SelectValue placeholder="Select Action" />
        </SelectTrigger>
        <SelectContent>
          {props.actions.map((action) => (
            <SelectItem key={action.key} value={action.key.toString()}>
              {action.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="hover:bg-primary-hovered rounded-none"
        onClick={() => {
          if (!selected) return;
          const action = props.actions.find(
            (action) => action.key === parseInt(selected)
          );
          action?.onAction(props.selectedList);
        }}
      >
        GO
      </Button>
    </div>
  );
};

export const TableTopRightElements = (props: {
  rightElements?: React.ReactElement[];
  actions?: TableActionType[];
  selectedList: string[];
}) => {
  return (
    <>
      <div className={"md:flex space-x-1 hidden items-center"}>
        {props.rightElements?.map((elem, index) => (
          <span key={index}>{elem}</span>
        ))}
      </div>
      <div className="md:hidden">
        {Boolean(props.rightElements?.length) && (
          <Drawer>
            <DrawerTrigger>
              <Button variant={"outline"}>
                <IoIosOptions size={24} />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Options</DrawerTitle>
              </DrawerHeader>
              <Separator className="my-5" />
              <div className="w-full flex flex-col items-center space-y-3 max-h-[60vh] overflow-y-auto">
                {props.rightElements?.map((elem, index) => (
                  <span key={index}>{elem}</span>
                ))}
                {props.actions && (
                  <CustomTableActionSelector
                    actions={props.actions}
                    selectedList={props.selectedList}
                    showMob
                  />
                )}
              </div>
              <Separator className="mt-5" />
              <DrawerFooter>
                <DrawerClose>
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </>
  );
};

export const TableSelectAllInput = (props: {
  selectedList: string[];
  setSelectedList: (s: string[]) => void;
  rows: TableRowType[];
}) => {
  const [checked, setChecked] = useState(false);
  return (
    <TableHead className={twMerge("font-bold whitespace-nowrap w-[80px]")}>
      <Input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          if (e.target.checked) {
            props.setSelectedList([
              ...props.selectedList.filter(
                (id) => props.rows.findIndex((row) => row.id === id) === -1
              ),
              ...props.rows.map((row) => row.id),
            ]);
          } else {
            props.setSelectedList(
              props.selectedList.filter(
                (id) => props.rows.findIndex((row) => row.id === id) === -1
              )
            );
          }
          setChecked(e.target.checked);
        }}
        className="w-[16px] h-[16px] mx-auto"
      />
    </TableHead>
  );
};

const TableSelectInput = (props: {
  id: string;
  selectedList: string[];
  setSelectedList: (s: string[]) => void;
  allCellClassName?: string;
}) => {
  return (
    <TableCell className={twMerge("w-[80px]", props.allCellClassName)}>
      <Input
        type="checkbox"
        checked={props.selectedList.findIndex((id) => id === props.id) !== -1}
        onChange={(e) => {
          if (e.target.checked) {
            props.setSelectedList([
              ...props.selectedList.filter((id) => id !== props.id),
              props.id,
            ]);
          } else {
            props.setSelectedList(
              props.selectedList.filter((id) => id !== props.id)
            );
          }
        }}
        className="w-[16px] h-[16px] mx-auto"
      />
    </TableCell>
  );
};

export const TablePagination = (props: {
  totalPages: number;
  page: number;
  setPage: (p: number) => void;
  total: number;
}) => {
  return (
    <div className="flex items-center bg-background">
      <div className="flex items-center whitespace-nowrap md:text-md text-sm pl-2">
        <span>Total - </span>
        <span className="font-bold">{props.total}</span>
      </div>
      <Pagination className="relative md:translate-x-[-40px] md:justify-center justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                props.setPage(props.page - 1 < 1 ? 1 : props.page - 1);
              }}
              href="#"
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">
              {props.page}/{props.totalPages}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              onClick={(e) => {
                e.preventDefault();
                props.setPage(
                  props.page + 1 > props.totalPages
                    ? props.totalPages
                    : props.page + 1
                );
              }}
              href="#"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

const TableHeadSortable = (props: {
  item: TableHeaderRowType;
  setSortBy: (val: string) => void;
  sortBy: string;
}) => {
  const [currentSortState, setCurrentSortState] = useState(
    props.item.sortable?.curr || SortStateEnum.asc
  );
  return (
    <TableHead
      className={twMerge(
        "font-bold whitespace-nowrap md:text-md sm:text-sm text-xs",
        props.item.itemClassName
      )}
    >
      <Button
        className="flex items-center space-x-1 font-bold whitespace-nowrap md:text-md sm:text-sm text-xs shadow-none border-none"
        variant={"outline"}
        onClick={(e) => {
          e.preventDefault();
          if (props.item.sortable) {
            const isInAscendingOrder = currentSortState === SortStateEnum.asc;
            props.setSortBy(
              isInAscendingOrder
                ? props.item.sortable.desc
                : props.item.sortable.asc
            );
            setCurrentSortState(
              isInAscendingOrder ? SortStateEnum.desc : SortStateEnum.asc
            );
          }
        }}
      >
        <span>{props.item.text}</span>
        {currentSortState === SortStateEnum.desc ? (
          <ArrowUp size={16} />
        ) : (
          <ArrowDown size={16} />
        )}
      </Button>
    </TableHead>
  );
};

export const TableDefaultSearcher = ({
  rows,
  searchables,
  setSearchedRows,
  searchedRows,
  renderInput,
  searchOptions,
}: {
  rows: TableRowType[];
  searchables: string[];
  setSearchedRows: (rows: TableRowType[]) => void;
  searchedRows: TableRowType[];
  searchOptions?: Object;
  renderInput?: ({
    search,
    setSearch,
  }: {
    search: string;
    setSearch: (val: string) => void;
  }) => React.ReactElement;
}) => {
  const fuseOptions = {
    keys: searchables.map((s) => `searchableKeyValues.${s}`),
    threshold: 0.8,
    ...searchOptions,
  };
  const fuse = useMemo(() => new Fuse(rows, fuseOptions), [rows]);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("rows changed");
    if (deferredSearch) {
      setLoading(true);
      const matched = fuse.search(deferredSearch);
      setSearchedRows(matched.map((match) => match.item));
      setLoading(false);
    } else {
      setSearchedRows([]);
    }
  }, [deferredSearch, rows]);

  return (
    <div className="relative w-full">
      {search && !loading && searchedRows.length <= 0 && (
        <div className="w-full flex items-center justify-center absolute top-0 left-0 translate-y-[-100%] h-[40px] rounded-md bg-gray-900 text-white">
          <Label>No Search Found</Label>
        </div>
      )}
      {renderInput ? (
        renderInput({ search, setSearch })
      ) : (
        <SearchInput
          search={search}
          setSearch={setSearch}
          onSubmit={() => {}}
        />
      )}
    </div>
  );
};

export default CustomTable;
