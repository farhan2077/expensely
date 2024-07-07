"use client";

import { useFormStatus, useFormState } from "react-dom";
import { toast } from "sonner";

import { signoutAction } from "@/app/actions/auth";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LogoutButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      disabled={pending}
      type="submit"
      variant="destructive"
      className="w-full"
    >
      {pending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "" : "Logout"}
    </Button>
  );
};

export function LogoutConfirmation({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const initialState = {
    success: false,
    message: "",
  };

  const [state, formAction] = useFormState(signoutAction, initialState);

  if (state.success) {
    toast.success("Successfully logged out");
  }

  if (!state.success && state?.message) {
    toast.warning(state.message);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">Are you sure?</DialogTitle>
          <DialogDescription className="text-pretty py-2 text-center">
            Logging out will require you to log back in to use expensely
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="focus-visible:ring-0"
          >
            Cancel
          </Button>
          <form action={formAction}>
            <LogoutButton />
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
