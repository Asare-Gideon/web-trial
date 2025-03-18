import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema, newCategorySchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./form";
import useAsyncCaller from "@/hooks/useAsyncCaller";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { FIREBASE_DB } from "@/firebase/config";
import { toast } from "./use-toast";
import { ImageSlider } from "./ImageSlider";

export function ShowImageModal({
  open,
  close,
  images,
  title,
}: {
  open: boolean;
  close: () => void;
  images: string[];
  title: string;
}) {
  const form = useForm<z.infer<typeof newCategorySchema>>({
    resolver: zodResolver(newCategorySchema),
    defaultValues: {
      name: "",
    },
  });
  const { handler: handleAddCategoryCaller, loading } = useAsyncCaller();

  async function onSubmit(values: z.infer<typeof newCategorySchema>) {
    await handleAddCategoryCaller(async () => {
      await addDoc(collection(FIREBASE_DB, "categories"), {
        date: serverTimestamp(),
        name: values.name,
      });
    });
    toast({
      variant: "default",
      title: "Category added successfully",
    });
    form.setValue("name", "");
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogTrigger></DialogTrigger>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ImageSlider images={images} />
      </DialogContent>
    </Dialog>
  );
}
