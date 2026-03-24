import { Badge } from "@/components/ui/badge";

export function PageIntro({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4">
      <Badge className="rounded-full bg-primary/10 px-4 py-1 text-primary hover:bg-primary/10">
        {badge}
      </Badge>
      <div className="space-y-2">
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-balance md:text-5xl">
          {title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
