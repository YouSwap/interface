import React, { useMemo, useContext } from 'react'
import styled from 'styled-components'
import { Pair, JSBI } from '@uniswap/sdk'
import { SwapPoolTabs } from '../../components/NavigationTabs'

import FullPositionCard from '../../components/PositionCard'
import { useUserHasLiquidityInAllTokens } from '../../data/V1'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { StyledInternalLink, TYPE } from '../../theme'
import { Text } from 'rebass'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { Dots } from '../../components/swap/styleds'
import { useStakingInfo } from '../../state/stake/hooks'
import { BIG_INT_ZERO } from '../../constants'
import { useTranslation } from 'react-i18next'
import AppBody from '../AppBody'
import SwapHeader from '../../components/Pool/SwapHeader'
import { ThemeContext } from 'styled-components'
import { AutoRow } from 'components/Row'

// const PageWrapper = styled(AutoColumn)`
//   max-width: 640px;
//   width: 100%;
// `

export const Wrapper = styled.div`
  position: relative;
  padding: 1rem;
`

const EmptyProposals = styled.div`
  border: none;
  height: 48px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  background-color: #F0F4FA;
`

const LineWrapper = styled.div`
  height: 1px;
  border-bottom: 1px dashed #06263C
  opacity: 0.08;
  margin-top: 30px;
`

export default function Pool() {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const theme = useContext(ThemeContext)

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const hasV1Liquidity = useUserHasLiquidityInAllTokens()

  // show liquidity even if its deposited in rewards contract
  const stakingInfo = useStakingInfo()
  const stakingInfosWithBalance = stakingInfo?.filter(pool => JSBI.greaterThan(pool.stakedAmount.raw, BIG_INT_ZERO))
  const stakingPairs = usePairs(stakingInfosWithBalance?.map(stakingInfo => stakingInfo.tokens))

  // remove any pairs that also are included in pairs with stake in mining pool
  const v2PairsWithoutStakedAmount = allV2PairsWithLiquidity.filter(v2Pair => {
    return (
      stakingPairs
        ?.map(stakingPair => stakingPair[1])
        .filter(stakingPair => stakingPair?.liquidityToken.address === v2Pair.liquidityToken.address).length === 0
    )
  })

  return (
    <>
      <AppBody>
        <SwapHeader />
        <Wrapper>
          <SwapPoolTabs active={'pool'} />
          <LineWrapper />
            <AutoColumn gap={'md'}>
              {!account ? (
                <EmptyProposals>
                  <TYPE.body color="#06263C" fontWeight={500} style={{opacity: 0.5}} textAlign="center">
                    {t('Connect to a wallet to view your liquidity')}
                  </TYPE.body>
                </EmptyProposals>
              ) : v2IsLoading ? (
                <EmptyProposals>
                  <TYPE.body color="#06263C" fontWeight={500} style={{opacity: 0.5}} textAlign="center">
                    <Dots>{t('Loading')}</Dots>
                  </TYPE.body>
                </EmptyProposals>
              ) : allV2PairsWithLiquidity?.length > 0 || stakingPairs?.length > 0 ? (
                <>
                  {/* <ButtonSecondary>
                    <RowBetween>
                      <ExternalLink href={'https://uniswap.info/account/' + account}>
                        Account analytics and accrued fees
                      </ExternalLink>
                      <span> ↗</span>
                    </RowBetween>
                  </ButtonSecondary> */}
                  {v2PairsWithoutStakedAmount.map(v2Pair => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                  ))}
                  {stakingPairs.map(
                    (stakingPair, i) =>
                      stakingPair[1] && ( // skip pairs that arent loaded
                        <FullPositionCard
                          key={stakingInfosWithBalance[i].stakingRewardAddress}
                          pair={stakingPair[1]}
                          stakedBalance={stakingInfosWithBalance[i].stakedAmount}
                        />
                      )
                  )}
                </>
              ) : (
                <EmptyProposals>
                  <TYPE.body color="#06263C" fontWeight={500} style={{opacity: 0.5}} textAlign="center">
                    {t('No liquidity found.')}
                  </TYPE.body>
                </EmptyProposals>
              )}

              <AutoColumn justify={'flex-start'} gap="md">
                <AutoRow>
                  <Text textAlign="left" fontSize={14} style={{ padding: '.5rem 0 .5rem 0' }} color={theme.text9} opacity={0.5}>
                    {hasV1Liquidity ? 'Uniswap V1 liquidity found!' : t("NoPoolFound")}{' '}
                  </Text>
                  <StyledInternalLink id="import-pool-link" to={hasV1Liquidity ? '/migrate/v1' : '/find'}>
                      {hasV1Liquidity ? 'Migrate now.' : t('Import it.')}
                  </StyledInternalLink>
                </AutoRow>
                <Text textAlign="left" fontSize={12} style={{margin: '-1rem 0 0 0', color: theme.text9}} opacity={0.5}>{t('FLIP')}</Text>
              </AutoColumn>
            </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  )
}
