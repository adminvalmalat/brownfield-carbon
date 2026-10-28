import { useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import { CardThing } from '../components/CardThing.jsx'
import { TableV2 } from '../components/TableV2.jsx'
import { InputField } from '../components/InputField.jsx'
import UseCaseBrief from '../components/UseCaseBrief.jsx'
import styles from './Dashboard.module.css'

const tableStuff = {
  headers: ['Customer', 'Plan', 'MRR', 'Status'],
  dataRows: [
    { cells: ['Northwind LLC', 'Enterprise', '$4,200', 'Active'] },
    { cells: ['Contoso', 'Pro', '$890', 'Active'] },
    { cells: ['Fabrikam', 'Starter', '$120', 'At risk'] },
    { cells: ['Adventure Co', 'Pro', '$650', 'Active'] },
    { cells: ['Tailspin Toys', 'Enterprise', '$12,400', 'Active'] },
  ],
}

export default function Dashboard() {
  const [accountSearch, setAccountSearch] = useState('')
  const visibleAccounts = tableStuff.dataRows.filter((row) =>
    row.cells.some((cell) => cell.toLowerCase().includes(accountSearch.toLowerCase())),
  )

  return (
    <div className={styles.pageWrap}>
      <NavBar brand="Acme" />
      <main className={styles.mainArea}>
        <h1 className={styles.sectionTitle}>Overview</h1>
        <p className="mt-2 text-sm text-[#6B7280]">Last updated 2 minutes ago · internal only</p>

        <div className="mt-4">
          <UseCaseBrief
            audience="Revenue and operations leaders monitoring day-to-day performance."
            value="Puts customer, revenue, support, and reliability signals in one scan."
            objective="Spot a change quickly, then move into the workflow that needs attention."
          />
        </div>

        <div className="mt-4 rounded-lg border border-[#E5E7EB] bg-white p-4 text-sm text-[#6B7280]">
          <span className="font-semibold text-[#374151]">Other flows:</span>{' '}
          <Link to="/billing" className="font-medium text-[#2563EB] no-underline hover:underline">
            Billing
          </Link>
          <span className="text-[#D1D5DB]"> · </span>
          <Link to="/team" className="font-medium text-[#2563EB] no-underline hover:underline">
            Team
          </Link>
          <span className="text-[#D1D5DB]"> · </span>
          <Link to="/integrations" className="font-medium text-[#2563EB] no-underline hover:underline">
            Integrations
          </Link>
        </div>

        <div className={styles.gridStats}>
          <CardThing stat="Users" subtext="12,480" footerNote="+3.2% vs last week" />
          <CardThing stat="Revenue" subtext="$842k" footerNote="MTD" />
          <CardThing stat="Tickets" subtext="37 open" footerNote="SLA 94%" />
          <CardThing stat="Uptime" subtext="99.98%" footerNote="30d rolling" />
        </div>

        <div className={styles.cardPanel}>
          <h2 className="m-0 text-[17px] font-semibold text-[#374151]">Recent accounts</h2>
          <p className="mb-0 mt-2 text-[13px] text-[#9CA3AF]">Hardcoded preview data — do not use in prod</p>
          <div className="mt-4 max-w-sm">
            <InputField
              labelText="Find an account"
              id="account-search"
              value={accountSearch}
              onChange={(event) => setAccountSearch(event.target.value)}
              placeholder="Search customer, plan, revenue, or status"
            />
          </div>
          {visibleAccounts.length > 0 ? (
            <TableV2 headers={tableStuff.headers} dataRows={visibleAccounts} />
          ) : (
            <p className="rounded-lg bg-[#F9FAFB] p-4 text-sm text-[#6B7280]">
              No accounts match “{accountSearch}”.
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
