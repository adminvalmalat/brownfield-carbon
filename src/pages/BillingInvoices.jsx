import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Button,
  Dropdown,
  InlineNotification,
  Modal,
  NumberInput,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TextInput,
  Tile,
} from '@carbon/react'
import { Add, ArrowRight, Renew } from '@carbon/icons-react'
import PageLayout from '../components/PageLayout.jsx'
import CarbonTable from '../components/CarbonTable.jsx'
import StatusTag from '../components/StatusTag.jsx'

const initialInvoices = [
  { id: 'INV-2401', invoice: 'INV-2401', customer: 'Northwind LLC', amount: '$4,200', due: 'Jun 05', status: 'Paid', balance: 0 },
  { id: 'INV-2402', invoice: 'INV-2402', customer: 'Contoso', amount: '$890', due: 'Jun 18', status: 'Paid', balance: 0 },
  { id: 'INV-2403', invoice: 'INV-2403', customer: 'Fabrikam', amount: '$120', due: 'May 30', status: 'Overdue', balance: 120 },
]

const headers = [
  { key: 'invoice', header: 'Invoice' },
  { key: 'customer', header: 'Customer' },
  { key: 'amount', header: 'Original amount' },
  { key: 'due', header: 'Due date' },
  { key: 'status', header: 'Status' },
]

const paymentMethods = ['Bank transfer', 'Check', 'Cash', 'Other']

export default function BillingInvoices() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [invoices, setInvoices] = useState(initialInvoices)
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(initialInvoices[2])
  const [amount, setAmount] = useState(120)
  const [method, setMethod] = useState(paymentMethods[0])
  const [reference, setReference] = useState('')
  const [notice, setNotice] = useState('')
  const [seatModalOpen, setSeatModalOpen] = useState(false)
  const [seats, setSeats] = useState(5)

  const selectedTab = searchParams.get('view') === 'seats' ? 1 : 0
  const duplicateReference = reference.trim().toLowerCase() === 'pay-2403'
  const amountInvalid = amount <= 0 || amount > selectedInvoice.balance
  const paymentInvalid = amountInvalid || !reference.trim() || duplicateReference
  const outstandingInvoices = useMemo(() => invoices.filter((invoice) => invoice.balance > 0), [invoices])

  const submitPayment = () => {
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === selectedInvoice.id
          ? {
              ...invoice,
              balance: invoice.balance - amount,
              status: invoice.balance - amount === 0 ? 'Paid' : 'Overdue',
            }
          : invoice,
      ),
    )
    setNotice(
      `${reference} recorded once for ${selectedInvoice.id}. Remaining balance: $${selectedInvoice.balance - amount}.`,
    )
    setPaymentOpen(false)
  }

  return (
    <PageLayout
      eyebrow="Finance"
      title="Billing"
      description="Manage customer receivables separately from your Acme subscription and team seats."
      brief={{
        audience: 'Finance operators and subscription owners.',
        value: 'Keeps receivable collection and workspace capacity clear without mixing the two.',
        objective: 'Record a payment accurately or understand the cost of adding team capacity.',
      }}
    >
      {notice && (
        <InlineNotification
          kind="success"
          title="Update complete"
          subtitle={notice}
          lowContrast
          onCloseButtonClick={() => setNotice('')}
        />
      )}

      <Tabs
        selectedIndex={selectedTab}
        onChange={({ selectedIndex }) =>
          setSearchParams(selectedIndex === 1 ? { view: 'seats' } : {})
        }
      >
        <TabList aria-label="Billing views" contained>
          <Tab>Customer invoices</Tab>
          <Tab>Subscription & seats</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div className="section-stack">
              <div className="section-heading">
                <div>
                  <p className="tile-kicker">Accounts receivable</p>
                  <p className="supporting-copy">All amounts are USD. Ledger refreshed today at 09:40.</p>
                </div>
                <div className="action-row">
                  <Button kind="tertiary" renderIcon={ArrowRight} onClick={() => navigate('/billing/aging')}>
                    AR aging
                  </Button>
                  <Button
                    renderIcon={Add}
                    disabled={outstandingInvoices.length === 0}
                    onClick={() => {
                      const invoice = outstandingInvoices[0]
                      setSelectedInvoice(invoice)
                      setAmount(invoice.balance)
                      setReference('')
                      setPaymentOpen(true)
                    }}
                  >
                    Record payment
                  </Button>
                </div>
              </div>
              <CarbonTable
                title="Open invoices"
                description={`${outstandingInvoices.length} invoice needs action`}
                headers={headers}
                rows={invoices}
                renderCell={(cell) =>
                  cell.info.header === 'status' ? <StatusTag status={cell.value} /> : cell.value
                }
              />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="split-layout section-stack">
              <Tile className="detail-tile">
                <p className="tile-kicker">Acme Pro annual</p>
                <p className="metric-tile__value">{seats} / 5 seats used</p>
                <p className="supporting-copy">
                  Your team is at capacity. Additional seats are billed at $24 per member each month,
                  prorated for the current term.
                </p>
                <Button renderIcon={Add} onClick={() => setSeatModalOpen(true)}>
                  Add seat capacity
                </Button>
              </Tile>
              <Tile className="detail-tile">
                <p className="tile-kicker">Next renewal</p>
                <p className="metric-tile__value">Dec 01</p>
                <p className="supporting-copy">Current annual commitment: $1,440 before tax.</p>
              </Tile>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal
        open={paymentOpen}
        modalHeading="Record payment"
        primaryButtonText="Save payment"
        secondaryButtonText="Cancel"
        primaryButtonDisabled={paymentInvalid}
        onRequestClose={() => setPaymentOpen(false)}
        onRequestSubmit={submitPayment}
      >
        <div className="field-stack">
          <div className="modal-summary">
            <div>
              <p className="tile-kicker">Invoice</p>
              <p>{selectedInvoice.id}</p>
            </div>
            <div>
              <p className="tile-kicker">Outstanding balance</p>
              <p>${selectedInvoice.balance} USD</p>
            </div>
          </div>
          <NumberInput
            id="payment-amount"
            label="Payment amount (USD)"
            min={1}
            max={selectedInvoice.balance}
            value={amount}
            invalid={amountInvalid}
            invalidText={`Enter an amount between $1 and $${selectedInvoice.balance}.`}
            onChange={(event, { value }) => setAmount(Number(value))}
          />
          <TextInput id="payment-date" type="date" labelText="Payment date" defaultValue="2026-06-24" />
          <Dropdown
            id="payment-method"
            titleText="Payment method"
            label="Choose a method"
            items={paymentMethods}
            selectedItem={method}
            onChange={({ selectedItem }) => setMethod(selectedItem)}
          />
          <TextInput
            id="payment-reference"
            labelText="Reference"
            value={reference}
            invalid={duplicateReference}
            invalidText="This reference already exists. Enter a unique payment reference."
            onChange={(event) => setReference(event.target.value)}
            placeholder="For example, BANK-00831"
          />
        </div>
      </Modal>

      <Modal
        open={seatModalOpen}
        modalHeading="Review capacity change"
        primaryButtonText="Confirm 2 additional seats"
        secondaryButtonText="Cancel"
        onRequestClose={() => setSeatModalOpen(false)}
        onRequestSubmit={() => {
          setSeats(5)
          setNotice('Capacity increased to 7 seats. Two seats are now available for invitations.')
          setSeatModalOpen(false)
        }}
      >
        <div className="field-stack">
          <InlineNotification
            kind="info"
            title="$48.00 monthly increase"
            subtitle="$19.20 prorated charge today. New annual total: $2,016 before tax."
            hideCloseButton
            lowContrast
          />
          <p className="supporting-copy">
            Capacity will increase from 5 to 7 seats. You can return to Team and complete the
            interrupted invitation.
          </p>
          <Button kind="ghost" renderIcon={Renew} onClick={() => navigate('/team')}>
            Return to Team without changing
          </Button>
        </div>
      </Modal>
    </PageLayout>
  )
}
