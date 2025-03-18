"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./drawer";
import { Button } from "./button";
import { Separator } from "./separator";
// import { useMediaQuery } from "@uidotdev/usehooks";
import { twMerge } from "tailwind-merge";

interface props {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  triggerer?: React.ReactElement;
  children?: React.ReactElement;
  title?: string;
  description?: string;
  maxWidth?: string;
  mobileHeight?: string;
  desktopClassName?: string;
  noDefaultClose?: boolean;
  noMobileCancel?: boolean;
}
const CustomModal: React.FC<props> = ({
  open,
  setOpen,
  triggerer,
  title,
  description,
  children,
  maxWidth,
  mobileHeight,
  desktopClassName,
  noDefaultClose,
  noMobileCancel,
}) => {
  // const isDesktop = useMediaQuery("(min-width: 768px)");
  if (true) {
    return (
      <div className="md:block hidden w-full">
        <Dialog open={open} onOpenChange={setOpen}>
          {typeof open === "undefined" && typeof setOpen === "undefined" && (
            <DialogTrigger asChild className="w-full">
              {triggerer}
            </DialogTrigger>
          )}
          <DialogContent
            className={twMerge(
              "sm:max-w-[425px] max-h-[70vh] overflow-y-auto",
              `${maxWidth ? `sm:max-${maxWidth}` : ""}`,
              desktopClassName
            )}
            // noDefaultClose={noDefaultClose}
          >
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            {children}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  return (
    <>
      <div className="md:hidden flex flex-col items-center w-full">
        <Drawer open={open} onOpenChange={setOpen}>
          {typeof open === "undefined" && typeof setOpen === "undefined" && (
            <DrawerTrigger asChild className="w-full">
              {triggerer}
            </DrawerTrigger>
          )}
          <DrawerContent className={mobileHeight}>
            <DrawerHeader className="text-left">
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            {children}
            <Separator className="my-2" />
            {!noMobileCancel && (
              <DrawerFooter className="pt-2">
                <DrawerClose asChild>
                  <Button
                    onClick={() => {
                      if (setOpen) {
                        setOpen(false);
                      }
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

export default CustomModal;
