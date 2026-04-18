import { PlaceholderPanel } from "../components/PlaceholderPanel";

export default function BillingPage(): React.ReactElement {
  return (
    <div className="cv-scrollbar-dashboard min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
      <PlaceholderPanel
        title="Billing"
        description="Manage your plan, invoices, and credit balance from one place."
      />
    </div>
  );
}
