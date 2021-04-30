import { ChainId, TokenAmount } from '@uniswap/sdk'
import React, { useState } from 'react'
import { Text } from 'rebass'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import styled from 'styled-components'

import Logo from '../../assets/svg/youlogo.svg'
import LogoMobile from '../../assets/images/logo@2x.png'
import { useActiveWeb3React } from '../../hooks'
// import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances, useAggregateUniBalance } from '../../state/wallet/hooks'
import { CardNoise } from '../earn/styled'
import { CountUp } from 'use-count-up'
import { TYPE, ExternalLink } from '../../theme'

import { YellowCard } from '../Card'
// import { Moon, Sun } from 'react-feather'
// import LanguageMenu from '../LanguageMenu'

import Row, { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import ClaimModal from '../claim/ClaimModal'
import { useToggleSelfClaimModal, useShowClaimPopup } from '../../state/application/hooks'
import { useUserHasAvailableClaim } from '../../state/claim/hooks'
import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
import { Dots } from '../swap/styleds'
import Modal from '../Modal'
import UniBalanceContent from './UniBalanceContent'
import usePrevious from '../../hooks/usePrevious'
import BgIcon from '../../assets/images/top-bg.png'
import BgIconMobile from '../../assets/images/bg@2x.png'
// import YouSwapTextIcon from '../../assets/images/youswap_text@2x.png'
// import Slogn from '../../assets/images/slogn.png'
import { isMobile } from 'react-device-detect'
import i18n from 'i18n'
import { useCookies } from 'react-cookie'

const HeaderWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 360px;
  background: url(${BgIcon}) center no-repeat;
  background-size: 100% 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    height: 210px;
    width: 100%;
    background: url(${BgIconMobile}) center no-repeat;
    background-size: 100% 100%;
  `};
`

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  height: 68px;
  top: 0;
  position: relative;
  padding: 0 30px;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    width: calc(100%);
    height: fit-content;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0 0 20px;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: flex;
    align-items: center;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    width: 100%;
    max-width: 960px;
    padding: 1rem;
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100%;
    z-index: 99;
    height: 72px;
    border-radius: 12px 12px 0 0;
    background-color: ${({ theme }) => theme.bg1};
  `};
`

const LanguageBtn = styled.div`
  width: 38px;
  height: 38px;
  margin-left: 10px;
  border-radius: 10px;
  font-size: 18px;
  color: #06263C;
  background-color: #FFFDFA;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    background: #F1F2F5;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  display: flex;
  align-items: flex-end;
  height: 30px;
  margin-top: 15px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: flex;
    align-items: flex-end;
    height: 20px;
  `};
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    justify-content: flex-end;
    padding-left: 4px;
`};
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

const UNIAmount = styled(AccountElement)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #35BDB1 0%, #2172e5 100%), #edeef2;
`

const UNIWrapper = styled.span`
  display: none;
  width: fit-content;
  position: relative;
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }

  :active {
    opacity: 0.9;
  }
`

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `};
`

const NetworkCard = styled(YellowCard)`
  border-radius: 6px;
  padding: 8px 12px;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const Title = styled.a`
  height: 30px;
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 20px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 20px;
    justify-self: center;
    margin-right: 0;
  `};
  :hover {
    cursor: pointer;
  }
`

const UniIcon = styled.div`
  height: 30px;
  transition: transform 0.3s ease;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 20px;
  `};
  :hover {
    transform: rotate(-5deg);
  }
`

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text10};
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC !important;
  width: fit-content;
  padding: 0 20px;
  font-weight: 500;
  white-space: nowrap;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: 16px!important;
    font-size: 12px;
    font-family: PingFangSC-Medium,PingFang SC!important;
    font-weight: 500;
    color: #bfc6cb;
    line-height: 17px;
    padding: 0;
    white-space: nowrap;
  `};

  &.${activeClassName} {
    border-radius: 12px;
    color: ${({ theme }) => theme.text7};
  }

  :hover {
    color: ${({ theme }) => theme.text7};
  }

  :focus {
    color: ${({ theme }) => theme.text7};
  }
`

const StyledExternalLink = styled(ExternalLink).attrs({
  activeClassName
}) <{ isActive?: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text10};
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC !important;
  width: fit-content;
  padding: 0 20px;
  font-weight: 500;
  white-space: nowrap;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    margin-left: 16px!important;
    font-size: 12px;
    font-family: PingFangSC-Medium,PingFang SC!important;
    font-weight: 500;
    color: #bfc6cb;
    line-height: 17px;
    padding: 0;
    white-space: nowrap;
  `};

  &.${activeClassName} {
    border-radius: 12px;
    color: ${({ theme }) => theme.text7};
  }

  :hover {
    color: ${({ theme }) => theme.text7};
  }

  :focus {
    color: ${({ theme }) => theme.text7};
  }
`

// ${({ theme }) => theme.mediaWidth.upToExtraSmall`
// display: none;
// `} 

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 69px;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 50px;
    font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 69px;
    display: flex;
    flex-direction: column;
  `};
`

const TextBlock1 = styled.div`
  font-size: 40px;
  font-family: Futura-Medium, Futura;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 50px;
  display: flex;
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 24px;
    font-family: Futura-Medium, Futura;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 32px;
  `};
`

const TextBlock2 = styled.div`
  margin-top: 30px;
  font-size: 20px;
  font-family: Alibaba-PuHuiTi-B, Alibaba-PuHuiTi;
  font-weight: normal;
  color: #92A0A5;
  line-height: 50px;
  white-space: nowrap;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 300px;
    margin-top: 10px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #92A0A5;
    line-height: 22px;
    white-space: normal;
    display: flex;
    justify-content: center;
  `};
`

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan'
}

export default function Header() {
  const [cookies, setCookie] = useCookies(['lang'])
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  // const [isDark] = useDarkModeManager()
  // const [darkMode, toggleDarkMode] = useDarkModeManager()

  const toggleClaimModal = useToggleSelfClaimModal()

  const availableClaim: boolean = useUserHasAvailableClaim(account)

  const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  const aggregateBalance: TokenAmount | undefined = useAggregateUniBalance()

  const [showUniBalanceModal, setShowUniBalanceModal] = useState(false)
  const showClaimPopup = useShowClaimPopup()

  const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  const toggleLanguage = function () {
    if (cookies.lang) {
      if (cookies.lang === 'EN') {
        i18n.changeLanguage('zh-CN')
        setCookie('lang', 'ZH', { domain: process.env.REACT_APP_DOMAIN })
      } else {
        i18n.changeLanguage('en')
        setCookie('lang', 'EN', { domain: process.env.REACT_APP_DOMAIN })
      }
    } else {
      i18n.changeLanguage('zh-CN')
      setCookie('lang', 'ZH', { domain: process.env.REACT_APP_DOMAIN })
    }
  }

  return (
    <HeaderWrapper>
      <IconWrapper>
        <TextBlock1>YouSwap</TextBlock1>
        <TextBlock2>{t('titleDesc')}</TextBlock2>
      </IconWrapper>
      <HeaderFrame>
        <ClaimModal />
        <Modal isOpen={showUniBalanceModal} onDismiss={() => setShowUniBalanceModal(false)}>
          <UniBalanceContent setShowUniBalanceModal={setShowUniBalanceModal} />
        </Modal>
        <HeaderRow>
          <Title>
            <UniIcon>
              <img height={isMobile ? '20px' : '30px'} src={isMobile ? LogoMobile : Logo} alt="logo" />
            </UniIcon>
          </Title>
          <HeaderLinks>
            <StyledExternalLink id={`stake-nav-link`} href={`${process.env.REACT_APP_HOME_URL}`}>
              {t('home page')}
            </StyledExternalLink>
            <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
              {t('swap')}
            </StyledNavLink>
            <StyledNavLink
              id={`pool-nav-link`}
              to={'/pool'}
              isActive={(match, { pathname }) =>
                Boolean(match) ||
                pathname.startsWith('/add') ||
                pathname.startsWith('/remove') ||
                pathname.startsWith('/create') ||
                pathname.startsWith('/find')
              }
            >
              {t('flowd')}
            </StyledNavLink>
            <StyledExternalLink id={`stake-nav-link`} href={`${process.env.REACT_APP_DIG_URL}`}>
              {t('flowd-mining')}
            </StyledExternalLink>
            {/* <StyledNavLink id={`stake-nav-link`} to={'/vote'}>
            {t('flowd-mining')}
            </StyledNavLink> */}
            {/* <span style={{ fontSize: '11px' }}>↗</span> */}
            <StyledExternalLink id={`stake-nav-link`} href={`${process.env.REACT_APP_CHART_URL}`}>
              {t('quotatios')}
            </StyledExternalLink>
            {/* <StyledExternalLink id={`stake-nav-link`} href={`${process.env.REACT_APP_IDO_URL}`}>
              {t('IDO')} 
            </StyledExternalLink> */}
            <StyledExternalLink id={`stake-nav-link`} href={`${process.env.REACT_APP_BRIDGE_URL}`}>
              {t('Bridge')}
            </StyledExternalLink>
          </HeaderLinks>
        </HeaderRow>
        <HeaderControls>
          <HeaderElement>
            <HideSmall>
              {/* 当前网络 */}
              {chainId && NETWORK_LABELS[chainId] && (
                <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
              )}
            </HideSmall>
            {availableClaim && !showClaimPopup && (
              <UNIWrapper onClick={toggleClaimModal}>
                <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                  <TYPE.white padding="0 2px">
                    {claimTxn && !claimTxn?.receipt ? <Dots>Claiming UNI</Dots> : 'Claim UNI'}
                  </TYPE.white>
                </UNIAmount>
                <CardNoise />
              </UNIWrapper>
            )}
            {!availableClaim && aggregateBalance && (
              <UNIWrapper onClick={() => setShowUniBalanceModal(true)}>
                <UNIAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                  {account && (
                    <HideSmall>
                      <TYPE.white
                        style={{
                          paddingRight: '.4rem'
                        }}
                      >
                        <CountUp
                          key={countUpValue}
                          isCounting
                          start={parseFloat(countUpValuePrevious)}
                          end={parseFloat(countUpValue)}
                          thousandsSeparator={','}
                          duration={1}
                        />
                      </TYPE.white>
                    </HideSmall>
                  )}
                  UNI
                </UNIAmount>
                <CardNoise />
              </UNIWrapper>
            )}
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} BNB
                </BalanceText>
              ) : null}
              <Web3Status />
            </AccountElement>
          </HeaderElement>
          <HeaderElementWrap>
            {/* <StyledMenuButton onClick={() => toggleDarkMode()}>
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            </StyledMenuButton> */}
            <LanguageBtn onClick={() => toggleLanguage()}>{cookies.lang === 'ZH' ? 'ZH' : 'EN'}</LanguageBtn>
            {/* <LanguageMenu /> */}
          </HeaderElementWrap>
        </HeaderControls>
      </HeaderFrame>
    </HeaderWrapper>
  )
}
