export default function UseCaseBrief({ audience, value, objective }) {
  const details = [
    { label: 'Who it is for', text: audience },
    { label: 'Value', text: value },
    { label: 'User objective', text: objective },
  ]

  return (
    <section
      aria-label="Use case summary"
      className="grid gap-3 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-4 sm:grid-cols-3"
    >
      {details.map((detail) => (
        <div key={detail.label}>
          <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
            {detail.label}
          </p>
          <p className="mb-0 mt-1 text-sm leading-relaxed text-[#374151]">{detail.text}</p>
        </div>
      ))}
    </section>
  )
}
