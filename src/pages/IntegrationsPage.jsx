import { useState } from 'react'
import {
  Button,
  Checkbox,
  Dropdown,
  InlineLoading,
  InlineNotification,
  Modal,
  PasswordInput,
  TextInput,
  Tile,
} from '@carbon/react'
import { Add, Renew, Settings, TestTool } from '@carbon/icons-react'
import PageLayout from '../components/PageLayout.jsx'
import StatusTag from '../components/StatusTag.jsx'

const baseIntegrations = [
  { id: 'slack', name: 'Slack', status: 'Connected', detail: '#ops-alerts', action: 'Configure delivery' },
  { id: 'zapier', name: 'Zapier', status: 'Connected', detail: '2 zaps · last run 1h ago', action: 'View connection' },
  { id: 'segment', name: 'Segment', status: 'Paused', detail: 'Credential expired', action: 'Repair connection' },
  { id: 'quickbooks', name: 'QuickBooks', status: 'Ready', detail: 'Not yet authorized', action: 'Connect accounting' },
]

const slackChannels = ['#ops-alerts', '#finance', '#customer-health']
const eventOptions = [
  { id: 'overdue', label: 'Invoice overdue' },
  { id: 'risk', label: 'Account becomes at risk' },
  { id: 'sync', label: 'Integration sync fails' },
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(baseIntegrations)
  const [activeFlow, setActiveFlow] = useState(null)
  const [credential, setCredential] = useState('')
  const [channel, setChannel] = useState(slackChannels[0])
  const [events, setEvents] = useState(['overdue', 'risk'])
  const [testing, setTesting] = useState(false)
  const [notice, setNotice] = useState('')
  const [mapping, setMapping] = useState('Acme Operations')

  const finishTest = (message, integrationId, detail) => {
    setTesting(true)
    window.setTimeout(() => {
      setTesting(false)
      setIntegrations((current) =>
        current.map((item) =>
          item.id === integrationId ? { ...item, status: 'Connected', detail } : item,
        ),
      )
      setNotice(message)
      setActiveFlow(null)
    }, 700)
  }

  const renderFlow = () => {
    if (activeFlow === 'segment') {
      return (
        <div className="field-stack">
          <InlineNotification
            kind="warning"
            title="Segment credential expired"
            subtitle="Data flow paused Jun 23 at 18:16. Owner: Workspace admin."
            hideCloseButton
            lowContrast
          />
          <PasswordInput
            id="segment-key"
            labelText="Segment write key"
            helperText="Requires Source admin permission. The key is validated before it is saved."
            value={credential}
            onChange={(event) => setCredential(event.target.value)}
          />
          {testing && <InlineLoading description="Validating credential and sending a test event…" />}
        </div>
      )
    }

    if (activeFlow === 'slack') {
      return (
        <div className="field-stack">
          <Dropdown
            id="slack-channel"
            titleText="Delivery channel"
            label="Choose a channel"
            items={slackChannels}
            selectedItem={channel}
            onChange={({ selectedItem }) => setChannel(selectedItem)}
          />
          <div>
            <p className="tile-kicker">Events</p>
            {eventOptions.map((event) => (
              <Checkbox
                key={event.id}
                id={`event-${event.id}`}
                labelText={event.label}
                checked={events.includes(event.id)}
                onChange={(_, { checked }) =>
                  setEvents((current) =>
                    checked ? [...current, event.id] : current.filter((item) => item !== event.id),
                  )
                }
              />
            ))}
          </div>
          <InlineNotification
            kind="info"
            title="Workspace scope"
            subtitle="Alerts will be sent for all teams in Acme Ops. Slack has permission to post in this channel."
            hideCloseButton
            lowContrast
          />
          {testing && <InlineLoading description="Saving preferences and sending a test notification…" />}
        </div>
      )
    }

    return (
      <div className="field-stack">
        <InlineNotification
          kind="info"
          title="Authorize QuickBooks"
          subtitle="This preview validates the entity mapping and demonstrates the sync result."
          hideCloseButton
          lowContrast
        />
        <TextInput
          id="quickbooks-company"
          labelText="QuickBooks company"
          value={mapping}
          onChange={(event) => setMapping(event.target.value)}
        />
        <Dropdown
          id="income-account"
          titleText="Invoice income account"
          label="Choose an account"
          items={['Services revenue', 'Subscription revenue', 'Other income']}
          selectedItem="Subscription revenue"
        />
        <Dropdown
          id="customer-mapping"
          titleText="Customer mapping"
          label="Choose a mapping"
          items={['Match by company name', 'Match by external ID']}
          selectedItem="Match by company name"
        />
        {testing && <InlineLoading description="Authorizing and previewing 3 invoice records…" />}
      </div>
    )
  }

  const submitFlow = () => {
    if (activeFlow === 'segment') {
      finishTest(
        'Segment recovered. A test event was received successfully moments ago.',
        'segment',
        'Test event received just now',
      )
      return
    }
    if (activeFlow === 'slack') {
      finishTest(
        `Notification settings saved. Test delivered to ${channel}.`,
        'slack',
        `${channel} · ${events.length} events`,
      )
      return
    }
    finishTest(
      'QuickBooks sync preview completed: 3 records ready, 0 exceptions.',
      'quickbooks',
      `${mapping} · 3 records ready`,
    )
  }

  const primaryDisabled =
    testing ||
    (activeFlow === 'segment' && credential.trim().length < 8) ||
    (activeFlow === 'slack' && events.length === 0) ||
    (activeFlow === 'quickbooks' && !mapping.trim())

  return (
    <PageLayout
      eyebrow="Data operations"
      title="Integrations & delivery"
      description="Monitor connection health, recover paused data flow, and configure where operational alerts are delivered."
      brief={{
        audience: 'Operations and data admins responsible for connected workflows.',
        value: 'Shows verified connection and delivery outcomes instead of status labels alone.',
        objective: 'Repair a paused source, configure notifications, or connect accounting with clear test results.',
      }}
    >
      {notice && (
        <InlineNotification
          kind="success"
          title="Verified result"
          subtitle={notice}
          lowContrast
          onCloseButtonClick={() => setNotice('')}
        />
      )}

      <div className="integration-grid section-stack">
        {integrations.map((integration) => (
          <Tile key={integration.id} className="integration-tile">
            <div className="status-line">
              <p className="metric-tile__value">{integration.name}</p>
              <StatusTag status={integration.status} />
            </div>
            <p className="supporting-copy">{integration.detail}</p>
            {integration.id !== 'zapier' && (
              <Button
                kind={integration.status === 'Paused' ? 'primary' : 'tertiary'}
                size="sm"
                renderIcon={integration.status === 'Paused' ? Renew : Settings}
                onClick={() => {
                  setNotice('')
                  setActiveFlow(integration.id)
                }}
              >
                {integration.action}
              </Button>
            )}
          </Tile>
        ))}
        <Tile className="integration-tile">
          <p className="tile-kicker">Additional source</p>
          <p className="metric-tile__value">Connect data</p>
          <p className="supporting-copy">Add a supported provider for reporting and operational signals.</p>
          <Button kind="ghost" size="sm" renderIcon={Add}>
            Browse catalog
          </Button>
        </Tile>
      </div>

      <Modal
        open={Boolean(activeFlow)}
        modalHeading={
          activeFlow === 'segment'
            ? 'Repair Segment connection'
            : activeFlow === 'slack'
              ? 'Configure Slack delivery'
              : 'Connect QuickBooks'
        }
        primaryButtonText={
          activeFlow === 'segment'
            ? 'Validate & reconnect'
            : activeFlow === 'slack'
              ? 'Save & test delivery'
              : 'Authorize & preview sync'
        }
        primaryButtonDisabled={primaryDisabled}
        secondaryButtonText="Cancel"
        onRequestClose={() => !testing && setActiveFlow(null)}
        onRequestSubmit={submitFlow}
      >
        {renderFlow()}
      </Modal>
    </PageLayout>
  )
}
