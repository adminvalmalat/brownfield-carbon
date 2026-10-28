import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Dropdown,
  InlineNotification,
  Modal,
  TextInput,
  Tile,
} from '@carbon/react'
import { Add, Renew, TrashCan } from '@carbon/icons-react'
import PageLayout from '../components/PageLayout.jsx'
import CarbonTable from '../components/CarbonTable.jsx'
import StatusTag from '../components/StatusTag.jsx'

const initialMembers = [
  { id: 'alex', member: 'Alex Rivera', email: 'alex@acme.test', role: 'Admin', status: 'Active' },
  { id: 'jordan', member: 'Jordan Lee', email: 'jordan@acme.test', role: 'Editor', status: 'Active' },
  { id: 'sam', member: 'Sam Patel', email: 'sam@acme.test', role: 'Viewer', status: 'Active' },
  { id: 'riley', member: 'Riley Chen', email: 'riley@acme.test', role: 'Editor', status: 'Active' },
]

const headers = [
  { key: 'member', header: 'Member' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Actions' },
]

const roles = [
  { id: 'Admin', text: 'Admin · Manage workspace, billing, and members' },
  { id: 'Editor', text: 'Editor · Create and update operational content' },
  { id: 'Viewer', text: 'Viewer · Read-only access' },
]

export default function TeamMembersScreen() {
  const navigate = useNavigate()
  const [members, setMembers] = useState(initialMembers)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [role, setRole] = useState(roles[2])
  const [notice, setNotice] = useState('')
  const hasSeat = members.length < 5
  const invalidEmail = inviteEmail.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)
  const duplicateEmail = members.some(
    (member) => member.email.toLowerCase() === inviteEmail.trim().toLowerCase(),
  )

  const sendInvitation = () => {
    const pendingMember = {
      id: `invite-${Date.now()}`,
      member: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: role.id,
      status: 'Pending',
      actions: '',
    }
    setMembers((current) => [...current, pendingMember])
    setNotice(`Invitation sent to ${pendingMember.email} as ${pendingMember.role}.`)
    setInviteEmail('')
    setInviteOpen(false)
  }

  const updateInvitation = (id, action) => {
    if (action === 'revoke') {
      setMembers((current) => current.filter((member) => member.id !== id))
      setNotice('Pending invitation revoked.')
      return
    }
    if (action === 'accept') {
      setMembers((current) =>
        current.map((member) => (member.id === id ? { ...member, status: 'Active' } : member)),
      )
      setNotice('Invitation accepted. The member now has active access.')
      return
    }
    setNotice('Invitation resent. The pending status and assigned role were preserved.')
  }

  return (
    <PageLayout
      eyebrow="Administration"
      title="Team & access"
      description="Manage workspace membership, invitation status, permissions, and seat capacity."
      brief={{
        audience: 'Workspace admins managing membership and permissions.',
        value: 'Makes roles, invitation status, and paid-seat impact visible in one place.',
        objective: 'Invite a teammate with the intended role and retain a clear next action.',
      }}
    >
      {notice && (
        <InlineNotification
          kind="success"
          title="Team updated"
          subtitle={notice}
          lowContrast
          onCloseButtonClick={() => setNotice('')}
        />
      )}

      <div className="split-layout section-stack">
        <Tile className="detail-tile">
          <p className="tile-kicker">Seat capacity</p>
          <p className="metric-tile__value">{members.length} / 5 used</p>
          <p className="supporting-copy">
            {hasSeat ? 'A seat is available for a new invitation.' : 'Add capacity before inviting another member.'}
          </p>
          {!hasSeat && (
            <Button kind="tertiary" onClick={() => navigate('/billing?view=seats')}>
              Review seat cost
            </Button>
          )}
        </Tile>
        <Tile className="detail-tile">
          <p className="tile-kicker">Role model</p>
          <p className="supporting-copy">
            Admins manage billing and access. Editors update operational content. Viewers have
            read-only access.
          </p>
        </Tile>
      </div>

      <div className="section-stack">
        <div className="section-heading">
          <p className="supporting-copy">Pending invitations can be resent, revoked, or accepted in this preview.</p>
          <Button renderIcon={Add} disabled={!hasSeat} onClick={() => setInviteOpen(true)}>
            Invite member
          </Button>
        </div>
        <CarbonTable
          title="Workspace members"
          description={`${members.length} of 5 seats used`}
          headers={headers}
          rows={members.map((member) => ({ ...member, actions: member.status }))}
          renderCell={(cell, row) => {
            if (cell.info.header === 'status') return <StatusTag status={cell.value} />
            if (cell.info.header === 'actions' && cell.value === 'Pending') {
              return (
                <div className="inline-actions">
                  <Button
                    kind="ghost"
                    size="sm"
                    renderIcon={Renew}
                    iconDescription="Resend invitation"
                    hasIconOnly
                    onClick={() => updateInvitation(row.id, 'resend')}
                  />
                  <Button
                    kind="ghost"
                    size="sm"
                    renderIcon={TrashCan}
                    iconDescription="Revoke invitation"
                    hasIconOnly
                    onClick={() => updateInvitation(row.id, 'revoke')}
                  />
                  <Button kind="ghost" size="sm" onClick={() => updateInvitation(row.id, 'accept')}>
                    Mark accepted
                  </Button>
                </div>
              )
            }
            return cell.info.header === 'actions' ? '—' : cell.value
          }}
        />
      </div>

      <Modal
        open={inviteOpen}
        modalHeading="Invite a teammate"
        primaryButtonText="Send invitation"
        secondaryButtonText="Cancel"
        primaryButtonDisabled={!inviteEmail || invalidEmail || duplicateEmail}
        onRequestClose={() => setInviteOpen(false)}
        onRequestSubmit={sendInvitation}
      >
        <div className="field-stack">
          <TextInput
            id="invite-email"
            type="email"
            labelText="Work email"
            placeholder="name@company.com"
            value={inviteEmail}
            invalid={invalidEmail || duplicateEmail}
            invalidText={duplicateEmail ? 'This person is already a member or invited.' : 'Enter a valid email address.'}
            onChange={(event) => setInviteEmail(event.target.value)}
          />
          <Dropdown
            id="invite-role"
            titleText="Role"
            label="Choose a role"
            items={roles}
            itemToString={(item) => item?.text || ''}
            selectedItem={role}
            onChange={({ selectedItem }) => setRole(selectedItem)}
          />
          <InlineNotification
            kind="info"
            title="One seat will be reserved"
            subtitle="The seat remains assigned while this invitation is pending."
            hideCloseButton
            lowContrast
          />
        </div>
      </Modal>
    </PageLayout>
  )
}
