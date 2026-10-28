import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar.jsx'
import BigButton from '../components/BigButton.jsx'
import { InputField } from '../components/InputField.jsx'
import UseCaseBrief from '../components/UseCaseBrief.jsx'

const people = [
  { id: '1', name: 'Alex Rivera', role: 'Admin' },
  { id: '2', name: 'Jordan Lee', role: 'Editor' },
  { id: '3', name: 'Sam Patel', role: 'Viewer' },
  { id: '4', name: 'Riley Chen', role: 'Editor' },
]

export default function TeamMembersScreen() {
  const navigate = useNavigate()
  const [members, setMembers] = useState(people)
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  const [notice, setNotice] = useState('')

  const inviteMember = () => {
    const email = inviteEmail.trim()
    if (!email) return

    setMembers((currentMembers) => [
      ...currentMembers,
      { id: `invite-${email}`, name: email, role: 'Viewer · Invited' },
    ])
    setInviteEmail('')
    setIsInviting(false)
    setNotice(`Invitation prepared for ${email}.`)
  }

  return (
    <div className="min-h-screen bg-white">
      <NavBar brand="Acme" />
      <div className="max-w-xl px-6 py-8">
        <h1 className="mb-2 text-2xl font-semibold text-[#374151]">Team & access</h1>
        <p className="mb-6 text-sm text-[#6B7280]">
          Invite members, then wire billing and integrations from the header nav.
        </p>

        <UseCaseBrief
          audience="Workspace admins managing membership and permissions."
          value="Makes access visible and connects seat ownership to billing."
          objective="Invite a teammate, review their role, and understand the impact on paid seats."
        />

        {notice && (
          <p role="status" className="mt-5 rounded-md bg-[#ECFDF5] p-3 text-sm text-[#047857]">
            {notice}
          </p>
        )}

        <ul className="mt-5 list-none p-0">
          {members.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3 text-sm"
            >
              <span className="font-semibold text-[#374151]">{p.name}</span>
              <span className="text-[#6B7280]">{p.role}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <BigButton
            variant="ghost"
            onClick={() => {
              setNotice('')
              setIsInviting(true)
            }}
          >
            Invite user
          </BigButton>
          <BigButton variant="primary" onClick={() => navigate('/billing')}>
            Open billing for seats
          </BigButton>
        </div>

        {isInviting && (
          <div className="mt-4 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <InputField
              labelText="Teammate email"
              id="invite-email"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
              placeholder="name@company.com"
            />
            <div className="flex flex-wrap gap-2">
              <BigButton variant="primary" onClick={inviteMember}>
                Send invitation
              </BigButton>
              <BigButton variant="ghost" onClick={() => setIsInviting(false)}>
                Cancel
              </BigButton>
            </div>
          </div>
        )}

        <p className="mt-6 text-sm text-[#9CA3AF]">
          Also try the{' '}
          <Link to="/integrations" className="text-[#3B82F6] no-underline hover:underline">
            integrations hub
          </Link>{' '}
          for Slack notifications.
        </p>
      </div>
    </div>
  )
}
