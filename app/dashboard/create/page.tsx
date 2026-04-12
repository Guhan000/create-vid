import { AiStockVideosForm } from "../components/AiStockVideosForm";

export default function CreateVideoPage(): React.ReactElement {
  return (
    <div className="relative min-h-full">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: "var(--cv-gradient-hero)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `linear-gradient(var(--cv-grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--cv-grid-line) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-cv-bg-deep to-transparent" />
      </div>

      <div className="relative z-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <AiStockVideosForm />
      </div>
    </div>
  );
}
