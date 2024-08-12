import { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn } from "@/libs/utils";

type InfoCardProps = {
  title: string;
  body: number;
  description?: string;
  bodyType: "currency" | "number";
  icon: LucideIcon;
  hideOnSmallScreen?: boolean;
};

export default function InfoCard({
  title,
  body,
  bodyType,
  description,
  icon: Icon,
  hideOnSmallScreen,
}: InfoCardProps) {
  const formattedBody = new Intl.NumberFormat("en-US").format(body);

  return (
    <Card
      className={cn("overflow-hidden", {
        "hidden md:block": hideOnSmallScreen,
      })}
    >
      <CardHeader className="flex w-full flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="overflow-hidden text-ellipsis text-sm font-normal text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {bodyType === "currency" && (
            <span className="mr-0.5 text-[1.6875rem] font-semibold">
              {/* symbol source: https://www.toptal.com/designers/htmlarrows/currency/, Bengali Taka */}
              &#2547;
            </span>
          )}
          {formattedBody}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
