import { useMemo, useState } from 'react'
import {
  Button,
  Dropdown,
  InlineNotification,
  Modal,
  Search,
  Tile,
} from '@carbon/react'
import { ArrowRight, Checkmark } from '@carbon/icons-react'
import PageLayout from '../components/PageLayout.jsx'
import CarbonTable from '../components/CarbonTable.jsx'
import MetricTile from '../components/MetricTile.jsx'
import StatusTag from '../components/StatusTag.jsx'

const accounts = [
  { id: 'northwind', customer: 'Northwind LLC', plan: 'Enterprise', mrr: '$4,200', status: 'Active' },
  { id: 'contoso', customer: 'Contoso', plan: 'Pro', mrr: '$890', status: 'Active' },
  { id: 'fabrikam', customer: 'Fabrikam', plan: 'Starter', mrr: '$120', status: 'At risk' },
  { id: 'adventure', customer: 'Adventure Co', plan: 'Pro', mrr: '$650', status: 'Active' },
  { id: 'tailspin', customer: 'Tailspin Toys', plan: 'Enterprise', mrr: '$12,400', status: 'Active' },
]

const headers = [
  { key: 'customer', header: 'Customer' },
  { key: 'plan', header: 'Plan' },
  { key: 'mrr', header: 'MRR' },
  { key: 'status', header: 'Status' },
]

const owners = ['Alex Rivera', 'Jordan Lee', 'Sam Patel']

export default function Dashboard() {
  const [search, setSearch] = useState('')
  const [exceptionOpen, setExceptionOpen] = useState(false)
  const [owner, setOwner] = useState('')
  const [resolution, setResolution] = useState('')

  const visibleAccounts = useMemo(
    () =>
      accounts.filter((account) =>
        Object.values(account).some((value) =>
          String(value).toLowerCase().includes(search.toLowerCase()),
        ),
      ),
    [search],
  )

  return (
    <PageLayout
      eyebrow="Business health"
      title="Overview"
      description="Revenue, customer, support, and reliability signals as of today at 09:42."
      brief={{
        audience: 'Revenue and operations leaders monitoring day-to-day performance.',
        value: 'Puts customer, revenue, support, and reliability signals in one scan.',
        objective: 'Spot a change, understand its source and period, then assign a clear follow-up.',
      }}
    >
      {resolution && (
        <InlineNotification
          kind="success"
          title="Follow-up assigned"
          subtitle={resolution}
          lowContrast
          onCloseButtonClick={() => setResolution('')}
        />
      )}

      <div className="metric-grid section-stack">
        <MetricTile label="Users" value="12,480" footer="+3.2% vs last week" />
        <MetricTile label="Revenue" value="$842k" footer="Month to date · Stripe" />
        <MetricTile label="Tickets" value="37 open" footer="SLA 94% · Zendesk" />
        <MetricTile
          label="At-risk accounts"
          value="1"
          footer="Fabrikam · health score declined"
          onClick={() => setExceptionOpen(true)}
        />
      </div>

      <div className="section-stack">
        <div className="section-heading">
          <div>
            <p className="tile-kicker">Customer portfolio</p>
            <p className="supporting-copy">Select the at-risk status to investigate the exception.</p>
          </div>
          <Search
            id="account-search"
            labelText="Search accounts"
            placeholder="Search accounts"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            size="lg"
          />
        </div>
        <CarbonTable
          title="Recent accounts"
          description={`${visibleAccounts.length} accounts shown`}
          headers={headers}
          rows={visibleAccounts}
          renderCell={(cell) =>
            cell.info.header === 'status' ? (
              <span
                className="table-link"
                onClick={() => cell.value === 'At risk' && setExceptionOpen(true)}
                onKeyDown={(event) => event.key === 'Enter' && setExceptionOpen(true)}
                role={cell.value === 'At risk' ? 'button' : undefined}
                tabIndex={cell.value === 'At risk' ? 0 : undefined}
              >
                <StatusTag status={cell.value} />
              </span>
            ) : (
              cell.value
            )
          }
        />
      </div>

      <Modal
        open={exceptionOpen}
        modalHeading="Investigate at-risk account"
        primaryButtonText="Assign follow-up"
        secondaryButtonText="Cancel"
        primaryButtonDisabled={!owner}
        onRequestClose={() => setExceptionOpen(false)}
        onRequestSubmit={() => {
          setResolution(`${owner} owns the Fabrikam renewal review. Next check: tomorrow at 10:00.`)
          setExceptionOpen(false)
        }}
      >
        <div className="field-stack">
          <InlineNotification
            kind="warning"
            title="Health score declined 18 points"
            subtitle="Fabrikam · Starter · last 7 days · Product analytics"
            lowContrast
            hideCloseButton
          />
          <Tile className="detail-tile">
            <p className="tile-kicker">Reason for concern</p>
            <p>Weekly active usage fell 31%, and two support tickets remain unresolved.</p>
          </Tile>
          <Dropdown
            id="exception-owner"
            titleText="Follow-up owner"
            label="Choose an owner"
            items={owners}
            selectedItem={owner || null}
            onChange={({ selectedItem }) => setOwner(selectedItem)}
          />
          <Button kind="tertiary" renderIcon={ArrowRight} href="/billing/aging">
            Review receivables
          </Button>
          {owner && (
            <p className="status-line">
              <Checkmark /> Outcome will remain visible on the overview.
            </p>
          )}
        </div>
      </Modal>
    </PageLayout>
  )
}
