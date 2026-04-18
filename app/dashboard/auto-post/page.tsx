import { PlaceholderPanel } from "../components/PlaceholderPanel";

export default function AutoPostPage(): React.ReactElement {
  return (
    <div className="cv-scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
      <PlaceholderPanel
        title="Auto post"
        description="Schedule publishing across platforms when your pipeline is ready."
      />
    </div>
  );
}
