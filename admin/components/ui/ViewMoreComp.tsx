import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";

const ViewMoreComp = ({
  user,
  open,
  close,
}: {
  user: any;
  open: boolean;
  close: () => void;
}) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user.name}</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>
        <div className="">
          <p className="text-sm">{user.message}</p>
        </div>
        <DialogFooter>
          <Button onClick={close} type="button">
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMoreComp;
