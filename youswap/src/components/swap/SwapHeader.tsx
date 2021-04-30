import React from 'react'
import styled from 'styled-components'
import Settings from '../Settings'
import { RowBetween } from '../Row'
import { RowFlex } from '../Row'
import { TYPE } from '../../theme'
import { useTranslation } from 'react-i18next'

const StyledSwapHeader = styled.div`
  padding: 12px 1rem 0px 1.5rem;
  margin-bottom: -4px;
  width: 100%;
  color: ${({ theme }) => theme.text2};
`

export default function SwapHeader() {
  const { t } = useTranslation()
  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFlex>
          <TYPE.black fontWeight={600}>{t('swap')}</TYPE.black>
          <TYPE.black fontWeight={500} fontSize={14} marginTop={1}>{t('rapidExchange')}</TYPE.black>
        </RowFlex>
        <Settings />
      </RowBetween>
    </StyledSwapHeader>
  )
}
