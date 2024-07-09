"use client";

import type { ReactNode } from "react";

import { useRouter } from "next/navigation";
import { TableRow } from "@/components/ui/table";

export default function ClientSideTableRow({
  groupId,
  children,
}: {
  groupId: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/settings/group/details/${groupId}`);
  };

  return (
    <TableRow onClick={handleRowClick} className="cursor-pointer">
      {children}
    </TableRow>
  );
}
