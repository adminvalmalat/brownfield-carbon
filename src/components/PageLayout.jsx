import { Content, Heading } from '@carbon/react'
import NavBar from './NavBar.jsx'
import UseCaseBrief from './UseCaseBrief.jsx'

export default function PageLayout({ eyebrow, title, description, brief, children }) {
  return (
    <div className="app-shell">
      <NavBar />
      <Content id="main-content" className="app-content">
        <div className="page-heading">
          {eyebrow && <p className="page-heading__eyebrow">{eyebrow}</p>}
          <Heading className="page-heading__title">{title}</Heading>
          <p className="page-heading__description">{description}</p>
        </div>
        {brief && <UseCaseBrief {...brief} />}
        {children}
      </Content>
    </div>
  )
}
