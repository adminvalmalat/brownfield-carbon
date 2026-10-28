import { ClickableTile } from '@carbon/react'

export default function MetricTile({ label, value, footer, onClick }) {
  return (
    <ClickableTile className="metric-tile" onClick={onClick}>
      <p className="metric-tile__label">{label}</p>
      <p className="metric-tile__value">{value}</p>
      <p className="metric-tile__footer">{footer}</p>
    </ClickableTile>
  )
}
