import { Currency, CurrencyAmount, Fraction, Percent } from '@uniswap/sdk'
import React from 'react'
import { Text } from 'rebass'
import { ButtonPrimary } from '../../components/Button'
import { RowBetween, RowFixed, RowFlex } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'
import { TYPE } from '../../theme'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const RowWrap = styled(RowFlex)`
  padding: 16px 20px;
  background: rgba(4, 67, 163, 0.06); 
  border-radius: 10px;
`

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {

  const { t } = useTranslation()

  return (
    <>
      <RowWrap>
        <RowBetween style={{padding: '6px 0'}}>
          <TYPE.body>{currencies[Field.CURRENCY_A]?.symbol} Deposited</TYPE.body>
          <RowFixed>
            <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
            <TYPE.body>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</TYPE.body>
          </RowFixed>
        </RowBetween>
        <RowBetween style={{padding: '6px 0'}}>
          <TYPE.body>{currencies[Field.CURRENCY_B]?.symbol} Deposited</TYPE.body>
          <RowFixed>
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
            <TYPE.body>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</TYPE.body>
          </RowFixed>
        </RowBetween>
        <RowBetween style={{padding: '6px 0'}}>
          <TYPE.body>Rates</TYPE.body>
          <TYPE.body>
            {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`}
          </TYPE.body>
        </RowBetween>
        <RowBetween style={{ justifyContent: 'flex-end', padding: '6px 0' }}>
          <TYPE.body>
            {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
              currencies[Field.CURRENCY_A]?.symbol
            }`}
          </TYPE.body>
        </RowBetween>
        <RowBetween style={{padding: '6px 0'}}>
          <TYPE.body>{t('shareOfPool')}:</TYPE.body>
          <TYPE.body>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TYPE.body>
        </RowBetween>
      </RowWrap>
      <ButtonPrimary style={{ margin: '20px 0 0 0' }} onClick={onAdd}>
        <Text fontWeight={500} fontSize={20}>
          {noLiquidity ? t('CreatePoolAndSupply') : t('Confirm Supply')}
        </Text>
      </ButtonPrimary>
    </>
  )
}
