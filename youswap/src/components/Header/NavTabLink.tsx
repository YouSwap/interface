import React from 'react'
import styled from 'styled-components'
import Row from '../Row'
import { NavLink } from 'react-router-dom'
import { useTranslation } from "react-i18next"

const TabLinks = styled(Row)`
  margin-top: 26px;
  margin-bottom: 30px;
  justify-content: center;
  background-color: rgba(12, 151, 156, 0.1);
  border-radius: 18px;
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: space-between;
    margin-top: 26px;
`};
`
const activeClassName = 'ACTIVE'
const TabNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  padding: 8px 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text6};
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 4px 12px;
  `};

  &.${activeClassName} {
    border-radius: 18px;
    font-weight: 600;
    color: ${({ theme }) => theme.yellow2};
    padding: 8px 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.bg8};
  }

  :hover {
    opacity: 0.8;
  }
`

export default function Header() {
  const { t } = useTranslation()
  return (
    <TabLinks>
      <TabNavLink id={`tab-nav-link`} to={`/swap`}>{t('swap')}</TabNavLink>
      <TabNavLink id={`tab-nav-link`} to={`/create/BNB`} isActive={(match, { pathname }) =>
        Boolean(match) ||
        pathname.startsWith('/add') ||
        pathname.startsWith('/create')
      }>{t('Add liquidity.')}</TabNavLink>
      <TabNavLink id={`tab-nav-link`} to={`/pool`} isActive={(match, { pathname }) =>
        Boolean(match) ||
        pathname.startsWith('/find') ||
        pathname.startsWith('/remove')
      }>{t('MyLiquality')}</TabNavLink>
    </TabLinks>
  )
}
