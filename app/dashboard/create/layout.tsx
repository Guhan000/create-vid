import { CreateVideoTabs } from "../components/CreateVideoTabs";

export default function DashboardCreateLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-6 sm:gap-8">
      <div className="shrink-0">
        <CreateVideoTabs />
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
