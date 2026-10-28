import { useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import { TableV2 } from '../components/TableV2.jsx'
import BigButton from '../components/BigButton.jsx'
import UseCaseBrief from '../components/UseCaseBrief.jsx'

const invoiceRows = {
  headers: ['Invoice', 'Customer', 'Amount', 'Status'],
  dataRows: [
    { cells: ['INV-2401', 'Northwind LLC', '$4,200', 'Paid'] },
    { cells: ['INV-2402', 'Contoso', '$890', 'Paid'] },
    { cells: ['INV-2403', 'Fabrikam', '$120', 'Overdue'] },
  ],
}

export default function BillingInvoices() {
  const [rows, setRows] = useState(invoiceRows.dataRows)
  const [isConfirming, setIsConfirming] = useState(false)
  const [notice, setNotice] = useState('')
  const overdueInvoice = rows.find((row) => row.cells[3] === 'Overdue')

  const recordPayment = () => {
    setRows((currentRows) =>
      currentRows.map((row) =>
        row.cells[0] === overdueInvoice.cells[0]
          ? { ...row, cells: [...row.cells.slice(0, 3), 'Paid'] }
          : row,
      ),
    )
    setIsConfirming(false)
    setNotice(`${overdueInvoice.cells[0]} was marked as paid in this preview.`)
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <NavBar brand="Acme" />
      <div className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-bold text-[#374151]">Billing & invoices</h1>
        <p className="mb-4 text-sm text-[#6B7280]">
          Finance flow — split charges by team or push totals to your ERP.
        </p>

        <UseCaseBrief
          audience="Finance and operations teams responsible for cash collection."
          value="Keeps invoice status and receivables follow-up in a single workspace."
          objective="Identify outstanding cash, record a payment, and prioritize overdue invoices."
        />

        <p className="my-4 text-sm">
          <Link to="/billing/aging" className="font-semibold text-[#2563EB] no-underline hover:underline">
            Open AR aging report →
          </Link>
        </p>

        <div className="mb-4 rounded-lg border border-[#E5E7EB] bg-white p-5">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[15px] font-semibold text-[#374151]">Open invoices</span>
            <BigButton
              variant="primary"
              extraStyle={{ padding: '8px 14px' }}
              onClick={() => {
                setNotice('')
                setIsConfirming(true)
              }}
            >
              Record payment
            </BigButton>
          </div>
          {notice && (
            <p role="status" className="rounded-md bg-[#ECFDF5] p-3 text-sm text-[#047857]">
              {notice}
            </p>
          )}
          {isConfirming && overdueInvoice && (
            <div className="mt-4 rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] p-4">
              <p className="m-0 text-sm font-semibold text-[#374151]">
                Record {overdueInvoice.cells[2]} for {overdueInvoice.cells[0]}?
              </p>
              <p className="mb-4 mt-1 text-sm text-[#6B7280]">
                This preview updates the invoice status locally.
              </p>
              <div className="flex flex-wrap gap-2">
                <BigButton variant="primary" onClick={recordPayment}>
                  Confirm payment
                </BigButton>
                <BigButton variant="ghost" onClick={() => setIsConfirming(false)}>
                  Cancel
                </BigButton>
              </div>
            </div>
          )}
          {!overdueInvoice && !notice && (
            <p className="rounded-md bg-[#ECFDF5] p-3 text-sm text-[#047857]">
              All listed invoices are paid.
            </p>
          )}
          <TableV2 headers={invoiceRows.headers} dataRows={rows} />
        </div>

        <p className="text-sm text-[#9CA3AF]">
          Next:{' '}
          <Link to="/team" className="text-[#2563EB] no-underline hover:underline">
            assign cost centers by team
          </Link>
          {' · '}
          <Link to="/integrations" className="text-[#2563EB] no-underline hover:underline">
            connect QuickBooks
          </Link>
        </p>
      </div>
    </div>
  )
}
