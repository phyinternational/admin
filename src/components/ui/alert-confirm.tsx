import {Button} from "./button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  actionMessage: string;
  onConfirm: () => void;
  title?: string;
  description?: string;
};
const AlertConfirm = ({
  children,
  actionMessage,
  onConfirm,
  title = "Are you absolutely sure?",
  description,
}: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-xs">
        <AlertDialogHeader>
          <AlertDialogTitle className="border-b dark-border pb-2">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base py-4">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm()} asChild>
            <Button
              className="bg-red-600 text-white dark:bg-red-600 dark:text-white"
              variant="destructive"
            >
              {actionMessage}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertConfirm;
