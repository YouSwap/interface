import React from 'react'
import styled from 'styled-components'
import { useLastTruthy } from '../../hooks/useLast'
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails'

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  width: 100%;
  background-color: rgba(4, 67, 163, 0.06);
  border-radius: 10px;
  color: ${({ theme }) => theme.text2};
  margin: 16px 0;
`

// const DetailsFooter = styled.div<{ show: boolean }>`
//   width: 100%;
//   max-width: 416px;
//   margin-top: 30px;
//   border-radius: 10px;
//   color: ${({ theme }) => theme.text2};
//   background-color: #EDEEF2;
//   z-index: -1;
//   transform: ${({ show }) => (show ? 'translateY(0%)' : 'translateY(-100%)')};
//   transition: transform 300ms ease-in-out;
// `

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade)

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  )
}
