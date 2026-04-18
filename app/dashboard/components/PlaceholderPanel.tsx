export function PlaceholderPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}): React.ReactElement {
  return (
    <div className="rounded-2xl border border-cv-border bg-cv-bg-surface/80 p-6 sm:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-cv-text-primary sm:text-3xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-cv-text-secondary">
        {description}
      </p>
      <div className="mt-10 rounded-xl border border-dashed border-cv-border bg-cv-bg-elevated/50 px-6 py-16 text-center">
        <p className="text-sm text-cv-text-tertiary">Content coming soon</p>
      </div>
    </div>
  );
}
