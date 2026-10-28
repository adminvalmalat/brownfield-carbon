import { Tag } from '@carbon/react'

const TAG_TYPES = {
  Active: 'green',
  Paid: 'green',
  Connected: 'green',
  Ready: 'green',
  Pending: 'blue',
  Invited: 'blue',
  Paused: 'red',
  Overdue: 'red',
  'At risk': 'warm-gray',
}

export default function StatusTag({ status }) {
  return <Tag type={TAG_TYPES[status] || 'cool-gray'}>{status}</Tag>
}
