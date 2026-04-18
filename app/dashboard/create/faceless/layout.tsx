export default function FacelessCreateLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      {children}
    </div>
  );
}
