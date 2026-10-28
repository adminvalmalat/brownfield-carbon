import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  FileUploaderDropContainer,
  InlineLoading,
  InlineNotification,
  Modal,
  ProgressBar,
  RadioButton,
  RadioButtonGroup,
  Tile,
} from '@carbon/react'
import { ArrowRight, DataBase, DocumentImport } from '@carbon/icons-react'
import PageLayout from '../components/PageLayout.jsx'
import MetricTile from '../components/MetricTile.jsx'

export default function EmptyThing() {
  const navigate = useNavigate()
  const [setupOpen, setSetupOpen] = useState(false)
  const [route, setRoute] = useState('source')
  const [fileName, setFileName] = useState('')
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [reportReady, setReportReady] = useState(false)

  const processReport = () => {
    setProcessing(true)
    setProgress(35)
    window.setTimeout(() => setProgress(72), 400)
    window.setTimeout(() => {
      setProgress(100)
      setProcessing(false)
      setReportReady(true)
      setSetupOpen(false)
    }, 850)
  }

  return (
    <PageLayout
      eyebrow="Analytics"
      title={reportReady ? 'Pipeline health' : 'Reports'}
      description={
        reportReady
          ? 'A first useful report with explicit source, reporting period, and freshness.'
          : 'Connect a source or import a CSV to create your first decision-ready report.'
      }
      brief={{
        audience: 'Managers and analysts turning source data into a shared operational view.',
        value: 'Creates a repeatable reporting destination with visible data readiness.',
        objective: 'Choose a setup route, validate the data, and open the first useful report.',
      }}
    >
      {reportReady ? (
        <>
          <InlineNotification
            kind="success"
            title="Report ready"
            subtitle={`Source: ${route === 'source' ? 'Segment production' : fileName} · Jun 17–24, 2026 · refreshed just now`}
            hideCloseButton
            lowContrast
          />
          <div className="report-grid section-stack">
            <MetricTile label="Events processed" value="48.2k" footer="+8% vs previous period" />
            <MetricTile label="Delivery rate" value="99.4%" footer="Across 3 destinations" />
            <MetricTile label="Needs attention" value="1" footer="One delayed destination" />
          </div>
          <div className="split-layout section-stack">
            <Tile className="detail-tile">
              <p className="tile-kicker">Decision signal</p>
              <p className="metric-tile__value">Healthy</p>
              <p className="supporting-copy">
                Delivery recovered after the Segment credential update. No sustained data loss is
                visible in the reporting period.
              </p>
            </Tile>
            <Tile className="detail-tile">
              <p className="tile-kicker">Data readiness</p>
              <p className="supporting-copy">48,219 valid rows · 12 rejected rows · 99.98% complete.</p>
              <Button kind="tertiary" onClick={() => setSetupOpen(true)}>
                Replace source
              </Button>
            </Tile>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <DataBase size={32} />
          <div>
            <p className="metric-tile__value">No reports yet</p>
            <p className="supporting-copy">
              Start here instead of leaving the page to discover how reporting is configured.
            </p>
          </div>
          <div className="action-row">
            <Button renderIcon={ArrowRight} onClick={() => setSetupOpen(true)}>
              Create first report
            </Button>
            <Button kind="tertiary" onClick={() => navigate('/integrations')}>
              Review integrations
            </Button>
          </div>
        </div>
      )}

      <Modal
        open={setupOpen}
        modalHeading="Create your first report"
        primaryButtonText={processing ? 'Processing…' : 'Validate & create report'}
        primaryButtonDisabled={processing || (route === 'csv' && !fileName)}
        secondaryButtonText="Cancel"
        onRequestClose={() => !processing && setSetupOpen(false)}
        onRequestSubmit={processReport}
      >
        <div className="field-stack">
          <RadioButtonGroup
            legendText="Setup route"
            name="report-route"
            valueSelected={route}
            onChange={(value) => setRoute(value)}
          >
            <RadioButton
              id="route-source"
              labelText="Connect Segment production"
              value="source"
            />
            <RadioButton id="route-csv" labelText="Import a CSV file" value="csv" />
          </RadioButtonGroup>

          {route === 'source' ? (
            <Tile>
              <p className="tile-kicker">Connected source</p>
              <p>Segment production · authorized · events scope</p>
            </Tile>
          ) : (
            <FileUploaderDropContainer
              labelText="Drag and drop a CSV here or click to browse"
              name="report-file"
              accept={['.csv']}
              multiple={false}
              onAddFiles={(_, { addedFiles }) => setFileName(addedFiles[0]?.name || '')}
            />
          )}

          {fileName && (
            <InlineNotification
              kind="info"
              title={fileName}
              subtitle="Required fields detected: event, timestamp, source, status."
              hideCloseButton
              lowContrast
            />
          )}

          {processing && (
            <>
              <InlineLoading description="Validating rows and preparing metrics…" />
              <ProgressBar label="Report processing" value={progress} />
            </>
          )}
          <p className="status-line">
            <DocumentImport /> Both setup routes converge on the same validation and readiness checks.
          </p>
        </div>
      </Modal>
    </PageLayout>
  )
}
