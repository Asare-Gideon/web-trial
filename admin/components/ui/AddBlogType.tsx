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

export function AddBlogType({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
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
      await addDoc(collection(FIREBASE_DB, "blog_types"), {
        date: serverTimestamp(),
        name: values.name,
      });
    });
    toast({
      variant: "default",
      title: "Blog type added successfully",
    });
    form.setValue("name", "");
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTrigger></DialogTrigger>
        <DialogHeader>
          <DialogTitle>Add New Blog Type</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-[2rem]"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-[#ececec5c] border-gray-400 h-12 rounded-xl"
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button
                  loading={loading}
                  className="w-[90%] h-12 koho-M text-md"
                >
                  submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
