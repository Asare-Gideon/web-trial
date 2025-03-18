"use client";
import React, { useDeferredValue, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./form";
import { Input, InputProps } from "./input";
import { twMerge } from "tailwind-merge";
import { CiSearch } from "react-icons/ci";

export const searchSchema = z.object({
  search: z.string().optional(),
});
interface props {
  onSubmit: (values: z.infer<typeof searchSchema>) => void;
  search?: string;
  setSearch?: (val: string) => void;
  inputProps?: InputProps;
}
const SearchInput: React.FC<props> = ({
  onSubmit,
  inputProps,
  search,
  setSearch,
}) => {
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
  });
  const formSearch = form.watch("search");
  const deferredSearch = useDeferredValue(formSearch);

  useEffect(() => {
    if (search) {
      form.setValue("search", search);
    }
  }, [search]);

  useEffect(() => {
    onSubmit({ search: deferredSearch });
  }, [deferredSearch]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={twMerge("flex items-center")}
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="relative">
              <div className="relative">
                <CiSearch
                  size={24}
                  className="absolute top-[50%] translate-y-[-50%] left-2"
                />
                <FormControl>
                  <Input
                    placeholder="Search"
                    className="pl-[35px]  bg-background"
                    {...(typeof search === "string" &&
                    typeof setSearch !== "undefined"
                      ? {
                          value: search,
                          onChange: (e) => {
                            setSearch(e.target.value);
                          },
                        }
                      : field)}
                    {...(inputProps && inputProps)}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SearchInput;
