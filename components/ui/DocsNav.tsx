import Link from 'next/link'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import RightArrowSvg from '../../public/svg/right-arrow.svg'
import { useState, useMemo, useEffect } from 'react'
import { DynamicLink } from './DynamicLink'

import { LinkNav } from './LinkNav'

interface NavSection {
  id: string
  slug: string
  title: string
  items: NavSection[]
}

export const NavSection = (section: NavSection) => {
  const router = useRouter()
  const currentPath = router.asPath
  const isCurrentPage = useMemo(() => {
    if (section.slug && currentPath.includes(section.slug)) {
      return true
    }
  }, [section.slug, currentPath])
  const [expanded, setExpanded] = useState(menuIsActive(section, currentPath))
  const highlighted = isCurrentPage || expanded

  useEffect(() => {
    setExpanded(menuIsActive(section, currentPath))
  }, [currentPath])

  return (
    <NavItem key={section.slug} open={highlighted}>
      <NavItemHeader>
        {section.slug ? (
          <DynamicLink href={section.slug} passHref>
            <NavSectionTitle as="a" open={highlighted}>
              {section.title}
            </NavSectionTitle>
          </DynamicLink>
        ) : (
          <NavSectionTitle
            open={highlighted}
            onClick={() => setExpanded(!expanded)}
          >
            {section.title}
          </NavSectionTitle>
        )}
        {section.items && section.items.length > 0 && <RightArrowSvg />}
      </NavItemHeader>
      {section.items && section.items.length > 0 && (
        <SubNav>
          {(section.items || []).map(item => (
            <NavSection key={section.id} {...item} />
          ))}
        </SubNav>
      )}
    </NavItem>
  )
}

const menuIsActive = (section: NavSection, currentPath: string) => {
  return (
    section.items &&
    section.items.reduce((isActive, section) => {
      if (section.slug && currentPath.includes(section.slug)) {
        return true
      }
      return isActive
    }, false)
  )
}

export const DocsNav = styled(({ open, navItems, ...styleProps }) => {
  return (
    <ul {...styleProps}>
      <MobileMainNav>
        <LinkNav />
      </MobileMainNav>
      {navItems &&
        navItems.map(section => <NavSection key={section.id} {...section} />)}
      <li>
        <iframe
          src="https://ghbtns.com/github-btn.html?user=tinacms&repo=tinacms&type=star&count=true&size=large"
          frameBorder="0"
          scrolling="0"
          width="145px"
          height="30px"
        ></iframe>
      </li>
    </ul>
  )
})`
  font-family: var(--font-tuner);
  list-style-type: none;
  background-color: var(--color-light);
  overflow-x: hidden;
  overflow-y: auto;
  line-height: 1.25;
  box-shadow: inset -1px 0 0 var(--color-light-dark);
  padding: 6rem 0 1rem 0;
  grid-area: nav;

  ::-webkit-scrollbar {
    display: none;
  }

  iframe {
    margin: 1.5rem 3.5rem 0.5rem 1.5rem;
    display: block;
  }

  @media (max-width: 999px) {
    position: fixed;
    z-index: 250;
    left: 0;
    top: 0;
    width: calc(50% + 2.25rem);
    height: 100%;
    z-index: 250;
    transform: translate3d(-100%, 0, 0);
    transition: all 140ms ease-in;
    padding: 0 0 1rem 0;

    ${props =>
      props.open &&
      css`
        transition: all 240ms ease-out;
        transform: translate3d(0, 0, 0);
      `};
  }
`

const MobileMainNav = styled.li`
  padding-top: 5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-light-dark);
  background-color: white;

  ul {
  }

  li {
    margin: 0;
  }

  a {
    display: block;
    padding: 0.5rem 3.5rem 0.5rem 1.5rem;
    color: var(--color-primary);
    margin: 0;
  }

  @media (min-width: 1000px) {
    display: none;
  }
`

const NavItemHeader = styled.div`
  position: relative;
`

interface NavSectionTitleProps {
  open: boolean
}

const NavSectionTitle = styled.span<NavSectionTitleProps>`
  display: block;
  padding: 0.5rem 3.5rem 0.5rem 1.5rem;
  color: var(--color-secondary);
  text-decoration: none;
  transition: all 180ms ease-out;

  &:hover,
  &:focus {
    color: var(--color-primary);
  }

  ${props =>
    props.open &&
    css`
      color: var(--color-primary);
    `};
`

const SubNav = styled.ul`
  list-style-type: none;
  margin: 0px;
  background: white;
  padding: 0;
  overflow: hidden;
  transition: all 180ms ease-out;
  box-shadow: inset 0 1px 0 var(--color-light-dark),
    inset 0 -1px 0 var(--color-light-dark);

  ${NavSectionTitle} {
    font-size: 0.9375rem;
    padding: 0.375rem 1.5rem 0.375rem 2rem;
  }

  li:first-child {
    ${NavSectionTitle} {
      padding-top: 1rem;
    }
  }

  li:last-child {
    padding-bottom: 1rem;
  }
`

interface NavItemProps {
  open: boolean
}

const NavItem = styled.li<NavItemProps>`
  position: relative;
  cursor: pointer;
  user-select: none;

  svg {
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform: translate3d(0, -50%, 0);
    width: 1.25rem;
    height: auto;
    fill: var(--color-grey);
    transition: all 180ms ease-out;
  }

  ${SubNav} {
    max-height: 0;
  }

  ${props =>
    props.open &&
    css`
      ${SubNav} {
        max-height: 40rem;
        transition: all 180ms ease-in;
      }

      svg {
        transform: translate3d(0, -50%, 0) rotate(90deg);
      }
    `};
`
