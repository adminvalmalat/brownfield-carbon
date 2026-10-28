export default function UseCaseBrief({ audience, value, objective }) {
  const details = [
    { label: 'Who it is for', text: audience },
    { label: 'Value', text: value },
    { label: 'User objective', text: objective },
  ]

  return (
    <section aria-label="Use case summary" className="use-case-brief">
      {details.map((detail) => (
        <div key={detail.label}>
          <p className="use-case-brief__label">{detail.label}</p>
          <p>{detail.text}</p>
        </div>
      ))}
    </section>
  )
}
