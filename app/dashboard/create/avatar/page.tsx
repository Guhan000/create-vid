import { GenerationPanel } from "../../components/GenerationPanel";

export default function AvatarCreatePage(): React.ReactElement {
  return (
    <div className="cv-scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
      <GenerationPanel variant="avatar" />
    </div>
  );
}
