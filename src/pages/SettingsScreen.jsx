import { useState } from 'react'
import {
  Button,
  InlineNotification,
  Select,
  SelectItem,
  TextInput,
  Tile,
  Toggle,
} from '@carbon/react'
import { Save } from '@carbon/icons-react'
import PageLayout from '../components/PageLayout.jsx'

export default function SettingsScreen() {
  const [workspaceName, setWorkspaceName] = useState('Acme Ops')
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [betaFeatures, setBetaFeatures] = useState(false)
  const [region, setRegion] = useState('us-east')
  const [savedMessage, setSavedMessage] = useState('')

  return (
    <PageLayout
      eyebrow="Administration"
      title="Workspace settings"
      description="Organization-wide identity, notification, feature-access, and data-residency defaults."
      brief={{
        audience: 'Workspace admins configuring organization-wide defaults.',
        value: 'Centralizes high-impact preferences with explicit scope and save feedback.',
        objective: 'Review workspace preferences, make a controlled change, and save with confidence.',
      }}
    >
      {savedMessage && (
        <InlineNotification
          kind="success"
          title="Settings saved"
          subtitle={savedMessage}
          lowContrast
          onCloseButtonClick={() => setSavedMessage('')}
        />
      )}

      <div className="split-layout section-stack">
        <Tile className="detail-tile">
          <div className="field-stack">
            <TextInput
              id="workspace-name"
              labelText="Workspace name"
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
            />
            <Select
              id="data-region"
              labelText="Data region"
              helperText="Changing region may affect data-processing terms."
              value={region}
              onChange={(event) => setRegion(event.target.value)}
            >
              <SelectItem value="us-east" text="US East" />
              <SelectItem value="eu-west" text="EU West" />
              <SelectItem value="apac" text="Asia Pacific" />
            </Select>
          </div>
        </Tile>

        <Tile className="detail-tile">
          <div className="field-stack">
            <Toggle
              id="email-notifications"
              labelText="Admin email digest"
              labelA="Disabled"
              labelB="Enabled"
              toggled={notifyEmail}
              onToggle={setNotifyEmail}
            />
            <Toggle
              id="beta-features"
              labelText="Beta features"
              labelA="Disabled"
              labelB="Enabled"
              toggled={betaFeatures}
              onToggle={setBetaFeatures}
            />
          </div>
        </Tile>
      </div>

      <div className="action-row section-stack">
        <Button
          renderIcon={Save}
          disabled={!workspaceName.trim()}
          onClick={() =>
            setSavedMessage(
              `${workspaceName} now uses ${region === 'us-east' ? 'US East' : region === 'eu-west' ? 'EU West' : 'Asia Pacific'} with ${notifyEmail ? 'admin digests enabled' : 'admin digests disabled'}.`,
            )
          }
        >
          Save changes
        </Button>
        <p className="supporting-copy">Changes apply to this workspace.</p>
      </div>
    </PageLayout>
  )
}
