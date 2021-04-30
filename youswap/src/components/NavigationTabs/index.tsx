import React from 'react'
import styled from 'styled-components'
import { darken } from 'polished'
import { useTranslation } from 'react-i18next'
import { NavLink, Link as HistoryLink } from 'react-router-dom'

import { ArrowLeft } from 'react-feather'
import { RowBetween, RowStart, RowFlex } from '../Row'
// import QuestionHelper from '../QuestionHelper'
import Settings from '../Settings'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'state'
import { resetMintState } from 'state/mint/actions'
import { TYPE } from '../../theme'


const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
  justify-content: space-evenly;
`

const NavWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text3};
  font-size: 20px;

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 500;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const StyledArrowLeft = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

export function SwapPoolTabs({ active }: { active: 'swap' | 'pool' }) {
  const { t } = useTranslation()
  return (
    <Tabs style={{ marginBottom: '20px', display: 'none' }}>
      <StyledNavLink id={`swap-nav-link`} to={'/swap'} isActive={() => active === 'swap'}>
        {t('swap')}
      </StyledNavLink>
      <StyledNavLink id={`pool-nav-link`} to={'/pool'} isActive={() => active === 'pool'}>
        {t('pool')}
      </StyledNavLink>
    </Tabs>
  )
}

export function FindPoolTabs() {
  const { t } = useTranslation()
  return (
    <NavWrapper>
      <RowStart style={{ padding: '1rem 1rem 0 1rem' }}>
        <HistoryLink to="/pool">
          <StyledArrowLeft />
        </HistoryLink>
        <RowFlex style={{marginLeft: 10}}>
          <TYPE.black fontWeight={500} fontSize={18}>{t('Import Pool')}</TYPE.black>
          <TYPE.black fontWeight={400} fontSize={12} marginTop='6px'>{t('importPoolTips')}</TYPE.black>
        </RowFlex>
      </RowStart>
    </NavWrapper>
  )
}

export function AddRemoveTabs({ adding, creating }: { adding: boolean; creating: boolean }) {
  // reset states on back
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  return (
    <Tabs>
      <RowBetween style={{ padding: '1rem 1rem 0 1rem' }}>
        <HistoryLink
          to="/pool"
          onClick={() => {
            adding && dispatch(resetMintState())
          }}
        >
          <StyledArrowLeft />
        </HistoryLink>
        <ActiveText>{creating ? t('Create a pair') : adding ? 'Add Liquidity' : t('removeLiquidity')}</ActiveText>
        {/* <QuestionHelper text="xxxx"/> */}
        <Settings />
      </RowBetween>
    </Tabs>
  )
}
