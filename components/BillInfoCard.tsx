import { LucideIcon } from "lucide-react";

import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type BillInfoCardProps = {
  title: string;
  value: number;
  icon: LucideIcon;
};

export default function BillInfoCard({
  title,
  value,
  icon: Icon,
}: BillInfoCardProps) {
  const formattedValue = new Intl.NumberFormat("en-US").format(value);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex w-full flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="overflow-hidden text-ellipsis text-sm font-normal text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <Icons.bdt className="mr-0.5 size-[1.125rem] stroke-2" />
          <span className="text-2xl font-bold">{formattedValue}</span>
        </div>
      </CardContent>
    </Card>
  );
}
