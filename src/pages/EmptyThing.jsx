import { useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import BigButton from '../components/BigButton.jsx'
import { CardThing } from '../components/CardThing.jsx'
import UseCaseBrief from '../components/UseCaseBrief.jsx'
import { useState } from 'react'

export default function EmptyThing() {
  const navigate = useNavigate()
  const [isSampleLoaded, setIsSampleLoaded] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <NavBar brand="Acme" />
      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="mb-3 mt-7 text-2xl font-semibold text-[#374151]">No reports yet</h1>
        <p className="mb-6 text-[15px] leading-relaxed text-[#6B7280]">
          Connect a data source or load a sample to see how a report will look.
        </p>

        <UseCaseBrief
          audience="Analysts and operations leads turning source data into a shared view."
          value="Creates a repeatable reporting destination for metrics from connected tools."
          objective="Choose a data source, validate the report shape, and publish the first useful view."
        />

        {isSampleLoaded ? (
          <div className="mt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="m-0 text-lg font-semibold text-[#374151]">Pipeline health sample</h2>
                <p className="mb-0 mt-1 text-sm text-[#6B7280]">Illustrative data for report planning.</p>
              </div>
              <BigButton variant="ghost" onClick={() => setIsSampleLoaded(false)}>
                Clear sample
              </BigButton>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <CardThing stat="Events processed" subtext="48.2k" footerNote="+8% this week" />
              <CardThing stat="Delivery rate" subtext="99.4%" footerNote="Across 3 sources" />
              <CardThing stat="Needs attention" subtext="1" footerNote="Segment is paused" />
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-8 text-center">
            <p className="m-0 text-sm font-semibold text-[#374151]">Start with a source or a safe preview</p>
            <p className="mb-5 mt-2 text-sm text-[#6B7280]">
              Connected data will appear here once a report is configured.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <BigButton variant="primary" onClick={() => navigate('/integrations')}>
                Connect a data source
              </BigButton>
              <BigButton variant="ghost" onClick={() => setIsSampleLoaded(true)}>
                Load sample report
              </BigButton>
            </div>
          </div>
        )}

        <div className="mt-6">
          <BigButton variant="ghost" onClick={() => navigate('/dashboard')}>
            Back to dashboard
          </BigButton>
        </div>
      </div>
    </div>
  )
}
