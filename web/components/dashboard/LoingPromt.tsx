import Link from "next/link";
import { LogIn } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/components/ui/card";
import { Button } from "@components/components/ui/button";

interface LoginPromptProps {
  title?: string;
  message?: string;
  loginPath?: string;
  buttonText?: string;
}

const LoginPrompt = ({
  title = "Login Required",
  message = "Please log in to access your dashboard",
  loginPath = "/login",
  buttonText = "Log In",
}: LoginPromptProps) => {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center p-4">
      <Card className="w-full max-w-md border-t-4 border-t-primary shadow-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-center text-muted-foreground">{message}</p>
        </CardContent>

        <CardFooter className="flex justify-center pb-6">
          <Button
            asChild
            size="lg"
            className="px-20 text-white hover:text-white"
          >
            <Link href={loginPath}>{buttonText}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPrompt;
