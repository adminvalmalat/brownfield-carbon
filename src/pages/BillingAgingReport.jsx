import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, InlineNotification, Modal, Select, SelectItem, Tile } from '@carbon/react'
import { ArrowLeft, ArrowRight } from '@carbon/icons-react'
import PageLayout from '../components/PageLayout.jsx'
import CarbonTable from '../components/CarbonTable.jsx'
import StatusTag from '../components/StatusTag.jsx'

const buckets = [
  { id: 'current', label: 'Current', amount: '$18,400', count: 6 },
  { id: '1-30', label: '1–30 days', amount: '$3,200', count: 3 },
  { id: '31-60', label: '31–60 days', amount: '$890', count: 1 },
  { id: '61-plus', label: '61+ days', amount: '$120', count: 1 },
]

const agingInvoices = [
  {
    id: 'INV-2403',
    invoice: 'INV-2403',
    customer: 'Fabrikam',
    bucket: '61-plus',
    due: 'May 30',
    balance: '$120',
    status: 'Overdue',
  },
  {
    id: 'INV-2398',
    invoice: 'INV-2398',
    customer: 'Contoso',
    bucket: '31-60',
    due: 'Apr 28',
    balance: '$890',
    status: 'Overdue',
  },
]

const headers = [
  { key: 'invoice', header: 'Invoice' },
  { key: 'customer', header: 'Customer' },
  { key: 'due', header: 'Due date' },
  { key: 'balance', header: 'Outstanding' },
  { key: 'status', header: 'Status' },
]

export default function BillingAgingReport() {
  const navigate = useNavigate()
  const [bucket, setBucket] = useState('all')
  const [detail, setDetail] = useState(null)
  const filteredInvoices = useMemo(
    () => (bucket === 'all' ? agingInvoices : agingInvoices.filter((invoice) => invoice.bucket === bucket)),
    [bucket],
  )

  return (
    <PageLayout
      eyebrow="Finance / Accounts receivable"
      title="Aging report"
      description="USD receivables as of Jun 24, 2026 · source: Acme billing ledger."
      brief={{
        audience: 'AR managers and finance leads planning collection activity.',
        value: 'Turns outstanding balances into clear age-based collection priorities.',
        objective: 'Inspect a bucket, identify the invoices behind it, and return without losing scope.',
      }}
    >
      <InlineNotification
        kind="info"
        title="Shared reporting scope"
        subtitle="Every total below uses the same as-of date, currency, and ledger source."
        hideCloseButton
        lowContrast
      />

      <div className="report-grid section-stack">
        {buckets.map((item) => (
          <Tile key={item.id} className="detail-tile">
            <p className="tile-kicker">{item.label}</p>
            <p className="metric-tile__value">{item.amount}</p>
            <p className="supporting-copy">{item.count} invoices</p>
            <Button kind="ghost" size="sm" onClick={() => setBucket(item.id)}>
              Inspect bucket
            </Button>
          </Tile>
        ))}
      </div>

      <div className="section-stack">
        <div className="section-heading">
          <Select
            id="aging-scope"
            labelText="Aging bucket"
            value={bucket}
            onChange={(event) => setBucket(event.target.value)}
          >
            <SelectItem value="all" text="All overdue invoices" />
            {buckets.slice(1).map((item) => (
              <SelectItem key={item.id} value={item.id} text={item.label} />
            ))}
          </Select>
          <Button kind="tertiary" renderIcon={ArrowLeft} onClick={() => navigate('/billing')}>
            Back to invoices
          </Button>
        </div>
        <CarbonTable
          title="Bucket breakdown"
          description={`${filteredInvoices.length} actionable overdue invoices`}
          headers={headers}
          rows={filteredInvoices}
          renderCell={(cell, row) => {
            if (cell.info.header === 'status') return <StatusTag status={cell.value} />
            if (cell.info.header === 'invoice') {
              return (
                <span
                  className="table-link"
                  role="button"
                  tabIndex={0}
                  onClick={() => setDetail(agingInvoices.find((invoice) => invoice.id === row.id))}
                  onKeyDown={(event) =>
                    event.key === 'Enter' &&
                    setDetail(agingInvoices.find((invoice) => invoice.id === row.id))
                  }
                >
                  {cell.value}
                </span>
              )
            }
            return cell.value
          }}
        />
      </div>

      <Modal
        open={Boolean(detail)}
        modalHeading={detail ? `${detail.invoice} · ${detail.customer}` : 'Invoice detail'}
        primaryButtonText="Continue to payment"
        secondaryButtonText="Close"
        onRequestClose={() => setDetail(null)}
        onRequestSubmit={() => navigate('/billing')}
      >
        {detail && (
          <div className="field-stack">
            <div className="modal-summary">
              <div>
                <p className="tile-kicker">Due date</p>
                <p>{detail.due}</p>
              </div>
              <div>
                <p className="tile-kicker">Outstanding balance</p>
                <p>{detail.balance} USD</p>
              </div>
            </div>
            <Tile>
              <p className="tile-kicker">Payment history</p>
              <p>No payments recorded for this invoice.</p>
            </Tile>
            <Tile>
              <p className="tile-kicker">Collection context</p>
              <p>Last reminder sent Jun 17. Account owner: Jordan Lee.</p>
            </Tile>
            <Button kind="ghost" renderIcon={ArrowRight} onClick={() => navigate('/billing')}>
              Open payment workflow
            </Button>
          </div>
        )}
      </Modal>
    </PageLayout>
  )
}
