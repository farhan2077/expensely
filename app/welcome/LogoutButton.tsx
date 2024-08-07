"use client";

import { useFormState, useFormStatus } from "react-dom";

import { toast } from "sonner";

import { signoutAction } from "@/app/actions/auth";

import { Icons } from "@/components/icons";

const LogoutButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      type="submit"
      className="flex items-center text-sm text-primary hover:underline"
    >
      {pending && <Icons.spinner className="h-4 w-4 animate-spin" />}
      {pending ? "" : "Logout"}
    </button>
  );
};

export default function Logout() {
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
    <form action={formAction}>
      <LogoutButton />
    </form>
  );
}
