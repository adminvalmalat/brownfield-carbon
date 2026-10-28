import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import BigButton from '../components/BigButton.jsx'
import UseCaseBrief from '../components/UseCaseBrief.jsx'

const buckets = [
  { label: 'Current', amount: '$18,400', color: '#10B981' },
  { label: '1–30 days', amount: '$3,200', color: '#3B82F6' },
  { label: '31–60 days', amount: '$890', color: '#9CA3AF' },
  { label: '61+ days', amount: '$120', color: '#EF4444' },
]

export default function BillingAgingReport() {
  const navigate = useNavigate()
  const [showPastDueOnly, setShowPastDueOnly] = useState(false)
  const visibleBuckets = showPastDueOnly ? buckets.slice(1) : buckets

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <NavBar brand="Acme" />
      <div className="mx-auto max-w-xl px-6 py-8">
        <p className="mb-3 text-sm">
          <Link to="/billing" className="text-[#2563EB] no-underline hover:underline">
            Billing
          </Link>
          <span className="text-[#9CA3AF]"> / </span>
          <span className="text-[#6B7280]">Aging</span>
        </p>

        <h1 className="mb-2 text-2xl font-bold text-[#374151]">Accounts receivable aging</h1>
        <p className="mb-6 text-sm text-[#6B7280]">Snapshot only — not wired to a live ledger.</p>

        <UseCaseBrief
          audience="AR managers and finance leads planning collection activity."
          value="Turns outstanding balances into clear age-based collection priorities."
          objective="Understand exposure, isolate past-due balances, and return to the invoice workflow."
        />

        <div className="my-5 flex items-center justify-between gap-4">
          <p className="m-0 text-sm font-semibold text-[#374151]">
            {showPastDueOnly ? 'Past-due balances' : 'All receivables'}
          </p>
          <BigButton variant="ghost" onClick={() => setShowPastDueOnly((current) => !current)}>
            {showPastDueOnly ? 'Show all' : 'Show past due only'}
          </BigButton>
        </div>

        <div className="flex flex-col gap-3">
          {visibleBuckets.map((b) => (
            <div
              key={b.label}
              className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white p-4 text-[15px]"
              style={{ borderLeftWidth: 4, borderLeftColor: b.color }}
            >
              <span className="font-semibold text-[#374151]">{b.label}</span>
              <span className="font-semibold text-[#111827]">{b.amount}</span>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <BigButton variant="ghost" onClick={() => navigate('/billing')}>
            ← Back to invoices
          </BigButton>
        </div>
      </div>
    </div>
  )
}
