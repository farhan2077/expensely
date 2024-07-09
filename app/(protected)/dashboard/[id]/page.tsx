import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getGroupInfo } from "@/app/actions/group";
import { PrettyJSONFormatter } from "@/libs/formatters";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Welcome to your expensely dashboard",
};

async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const result = await getGroupInfo(id);

  if (!result.success) {
    notFound();
  }

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Take a look at what&apos;s happening at {result.data.groupInfo.name}
      </p>
      <hr className="my-4 text-muted-foreground" />
      <div>
        <PrettyJSONFormatter data={result.data} />
      </div>
    </main>
  );
}

export default Page;
