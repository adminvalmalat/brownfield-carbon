import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import { CardThing } from '../components/CardThing.jsx'
import BigButton from '../components/BigButton.jsx'
import UseCaseBrief from '../components/UseCaseBrief.jsx'

const integrations = [
  { name: 'Slack', status: 'Connected', detail: '#ops-alerts', needsAttention: false },
  { name: 'Zapier', status: '2 zaps', detail: 'Last run 1h ago', needsAttention: false },
  { name: 'Segment', status: 'Paused', detail: 'Needs API key', needsAttention: true },
]

export default function IntegrationsPage() {
  const navigate = useNavigate()
  const [showNeedsAttention, setShowNeedsAttention] = useState(false)
  const visibleIntegrations = showNeedsAttention
    ? integrations.filter((integration) => integration.needsAttention)
    : integrations

  return (
    <div className="min-h-screen bg-[#EFF6FF]">
      <NavBar brand="Acme" />
      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="mb-2 text-[22px] font-bold text-[#1E40AF]">Integrations & webhooks</h1>
        <p className="mb-6 text-sm text-[#6B7280]">
          Connect tools, then pipe metrics into reports or billing alerts.
        </p>

        <UseCaseBrief
          audience="Operations and data admins responsible for connected workflows."
          value="Shows connection health and where product signals are being delivered."
          objective="Verify active connections, resolve a paused source, and choose an output workflow."
        />

        <div className="my-5 flex items-center justify-between gap-4">
          <p className="m-0 text-sm font-semibold text-[#1E40AF]">
            {showNeedsAttention ? 'Needs attention' : 'All integrations'}
          </p>
          <BigButton variant="ghost" onClick={() => setShowNeedsAttention((current) => !current)}>
            {showNeedsAttention ? 'Show all' : 'Show needs attention'}
          </BigButton>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleIntegrations.map((integration) => (
            <CardThing
              key={integration.name}
              stat={integration.name}
              subtext={integration.status}
              footerNote={integration.detail}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <BigButton variant="ghost" onClick={() => navigate('/empty')}>
            View report pipeline
          </BigButton>
          <BigButton variant="primary" extraStyle={{ fontSize: 13 }} onClick={() => navigate('/team')}>
            Pick notify channel (team)
          </BigButton>
        </div>

        <p className="mt-4 text-xs text-[#9CA3AF]">
          API tokens live in{' '}
          <Link to="/settings" className="text-[#2563EB] no-underline hover:underline">
            workspace settings
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
