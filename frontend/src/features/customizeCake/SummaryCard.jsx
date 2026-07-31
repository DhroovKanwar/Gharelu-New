/**
 * Read-only summary of everything entered in the multi-step form. Shown on
 * the final step so the customer can review before submitting.
 */
const Row = ({ label, value }) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex flex-col gap-0.5 border-b border-brand-line/60 py-2.5 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-accent">
        {label}
      </span>
      <span className="text-sm text-brand-dark sm:max-w-[65%] sm:text-right">
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value}
      </span>
    </div>
  );
};

const Group = ({ title, children }) => (
  <div className="rounded-2xl border border-brand-line bg-brand-bg p-5">
    <p className="mb-1 font-heading text-lg font-extrabold tracking-tight text-brand-dark">{title}</p>
    <div>{children}</div>
  </div>
);

export const SummaryCard = ({ state }) => {
  const fullName = [state.firstName, state.lastName].filter(Boolean).join(" ").trim();
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2" data-testid="customize-cake-summary">
      <Group title="Customer Details">
        <Row label="Name" value={fullName} />
        <Row label="Phone" value={state.phone} />
        <Row label="Email" value={state.email} />
      </Group>

      <Group title="Occasion">
        <Row label="Type" value={state.occasion === "Other" ? state.otherOccasion : state.occasion} />
        <Row label="Date" value={state.occasionDate} />
        <Row
          label="Preferred Time"
          value={state.preferredTime === "Custom Time" ? state.customTime : state.preferredTime}
        />
        <Row label="Guest Count" value={state.peopleCount} />
      </Group>

      <Group title="Delivery">
        <Row label="Type" value={state.deliveryType} />
        {state.deliveryType === "Delivery" && (
          <>
            <Row
              label="Address"
              value={[state.addressLine1, state.addressLine2].filter(Boolean).join(", ")}
            />
            <Row label="City" value={state.city} />
            <Row label="State" value={state.state} />
            <Row label="Pincode" value={state.pincode} />
            <Row label="Landmark" value={state.landmark} />
          </>
        )}
      </Group>

      <Group title="Cake Preferences">
        <Row label="Flavour" value={state.flavour} />
        <Row label="Shape" value={state.shape} />
        <Row label="Theme / Design" value={state.theme} />
        <Row label="Message on Cake" value={state.cakeMessage} />
        <Row label="Eggless" value={state.eggless} />
        <Row label="Budget" value={state.budget} />
      </Group>

      {state.notes && (
        <Group title="Additional Notes">
          <p className="whitespace-pre-line text-sm text-brand-dark">{state.notes}</p>
        </Group>
      )}

      {state.referenceImage?.url && (
        <Group title="Reference Image">
          <img
            src={state.referenceImage.url}
            alt="Reference"
            className="mt-2 max-h-64 w-full rounded-xl object-cover"
          />
        </Group>
      )}
    </div>
  );
};

export default SummaryCard;
