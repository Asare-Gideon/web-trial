import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "./label";
import { Button } from "./button";
import { deleteDoc, doc } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebase/config";

interface prop {
  open: boolean;
  close: () => void;
  id?: string;
  onOk: () => void;
  message?: string;
  title?: string;
  loading?: boolean;
}

const AlertComp = ({ title, open, close, onOk, message, loading }: prop) => {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> {title ? title : "Delete Product"} </DialogTitle>
          <DialogDescription>
            {message ? message : "Are sure you want to delete this product?"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <Button
            loading={loading}
            onClick={onOk}
            className="bg-red-500/85 hover:bg-red-500/45"
            type="submit"
          >
            Yes, continue
          </Button>
          <Button
            onClick={close}
            variant={"outline"}
            className="w-[8rem]"
            type="submit"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertComp;
