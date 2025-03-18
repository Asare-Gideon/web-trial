"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import logoImg from "../../../../public/images/logos/logo.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema, signupSchema } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logoIcon from "../../../../public/images/logos/logo-icon.png";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebase/config";
import {
  useDocumentDataOnce,
  useCollectionOnce,
} from "react-firebase-hooks/firestore";
import { collection, doc } from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";

const FormCard = () => {
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(FIREBASE_AUTH);
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userEmail: "",
    },
  });
  const [snapshot, adminDataLoading] = useCollectionOnce(
    collection(FIREBASE_DB, "admins"),
    {}
  );

  function onSubmit(values: z.infer<typeof loginSchema>) {
    if (!adminDataLoading) {
      let isAdim = snapshot?.docs.find(
        (doc) => doc.data().email === values.userEmail
      );
      if (isAdim != undefined) {
        signInWithEmailAndPassword(values.userEmail, values.userPassword);
      } else {
        toast({
          variant: "destructive",
          title: "Error occured",
          description: "Admin is not found",
        });
      }
    }
  }

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: error.name,
        description: error.message,
      });
    }
  }, [error]);

  return (
    <div className="w-full relative h-full min-h-[40rem] overflow-hidden rounded-[3rem]">
      <div className="z-40 p-2 sm:p-4">
        <div className="sm:mt-4">
          <Link href={"/"}>
            {/* <Image
              src={logoImg}
              className=" h-[80px] w-[200px] sm:h-[60px] sm:w-[160px]"
              alt="img"
            /> */}
            <h2 className=" font-bold text-2xl ml-2">Kmtec</h2>
          </Link>
        </div>
        <h1 className=" text-[2rem] sm:text-[2.5rem] mt-[2.5rem] leading-[40px] sm:leading-[50px] koho-B font-[800]">
          Login to <br />
          your account
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-[2rem]"
          >
            <FormField
              control={form.control}
              name="userEmail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-[#ececec5c] border-gray-400 h-12 rounded-xl"
                      placeholder="Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-[#ececec5c] border-gray-400 h-12 rounded-xl"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button loading={loading} className="w-[90%] h-12 koho-M text-md">
                Login
              </Button>
            </div>
            {/* <div className="flex items-center justify-center">
              <p className="text-md koho-L ml-2 ">Dont have an account?</p>
              <Link
                href={"/signup"}
                className="text-primary koho-L text-lg ml-3"
              >
                Creat account
              </Link>
            </div> */}
          </form>
        </Form>
      </div>
      {/* <div className="absolute h-[3rem]   bottom-32 right-0 left-0 flex justify-center items-center ">
        {error && <h3 className="text-red-600 text-lg">{error as any}</h3>}
        {error && <h3 className="text-red-600 text-lg">{error as any}</h3>}
      </div> */}
    </div>
  );
};

export default FormCard;
