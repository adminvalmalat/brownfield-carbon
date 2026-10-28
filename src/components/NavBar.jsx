import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Header,
  HeaderMenuButton,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  SideNav,
  SideNavItems,
  SideNavLink,
  SkipToContent,
} from '@carbon/react'

const NAV_LINKS = [
  { to: '/dashboard', text: 'Dashboard' },
  { to: '/billing', text: 'Billing' },
  { to: '/team', text: 'Team' },
  { to: '/integrations', text: 'Integrations' },
  { to: '/reports', text: 'Reports' },
  { to: '/settings', text: 'Settings' },
]

export default function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sideNavOpen, setSideNavOpen] = useState(false)

  const goTo = (path) => {
    navigate(path)
    setSideNavOpen(false)
  }

  return (
    <Header aria-label="Acme operations">
      <SkipToContent />
      <HeaderMenuButton
        aria-label={sideNavOpen ? 'Close navigation' : 'Open navigation'}
        isActive={sideNavOpen}
        onClick={() => setSideNavOpen((current) => !current)}
      />
      <HeaderName href="/dashboard" prefix="ACME">
        Operations
      </HeaderName>
      <HeaderNavigation aria-label="Primary navigation">
        {NAV_LINKS.map((item) => (
          <HeaderMenuItem
            key={item.to}
            isActive={location.pathname === item.to || (item.to === '/billing' && location.pathname.startsWith('/billing'))}
            onClick={() => goTo(item.to)}
          >
            {item.text}
          </HeaderMenuItem>
        ))}
      </HeaderNavigation>
      <SideNav
        aria-label="Mobile navigation"
        expanded={sideNavOpen}
        isPersistent={false}
        onSideNavBlur={() => setSideNavOpen(false)}
      >
        <SideNavItems>
          {NAV_LINKS.map((item) => (
            <SideNavLink
              key={item.to}
              isActive={
                location.pathname === item.to ||
                (item.to === '/billing' && location.pathname.startsWith('/billing'))
              }
              onClick={() => goTo(item.to)}
            >
              {item.text}
            </SideNavLink>
          ))}
        </SideNavItems>
      </SideNav>
    </Header>
  )
}
