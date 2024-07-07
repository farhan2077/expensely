import { Suspense } from "react";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Experiment from "@/app/(protected)/dashboard/[id]/Experiment";
import { getGroupInfo } from "@/app/actions/group";
import { PrettyJSONFormatter } from "@/libs/formatters";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Welcome to your expensely dashboard",
};

async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const result = await getGroupInfo(id);

  if (!result) {
    notFound();
  }

  return (
    <main>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Take a look at what&apos;s happening at {result.data.name}
      </p>
      <hr className="my-4 text-muted-foreground" />
      <div>
        <Suspense fallback={"loading ..."}>
          <PrettyJSONFormatter data={result.data} />
        </Suspense>
        <Suspense fallback={"Experiment loading"}>
          {/* <Experiment userId={user.id} /> */}
        </Suspense>
      </div>
    </main>
  );
}

export default Page;
