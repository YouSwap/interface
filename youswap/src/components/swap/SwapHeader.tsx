import React from 'react'
import styled from 'styled-components'
import Settings from '../Settings'
import { RowBetween, RowFlex } from '../Row'
import { TYPE } from '../../theme'
import { useTranslation } from 'react-i18next'
// import RewardIcon from '../../assets/images/liwu.png'
import RightIcon from '../../assets/images/arrow-right-icon.png'

const StyledSwapHeader = styled.div`
  padding: 12px 1rem 0px 1.5rem;
  margin-bottom: -4px;
  width: 100%;
  color: ${({ theme }) => theme.text2};
`

const RowColumnCenter = styled.div`
  display: flex;
  align-items: center;
  margin-top: 4px;
  cursor: pointer;
`

const TextInner = styled.span`
  max-width: 320px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #06263C;
  line-height: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 14px;
  `};
`

const TextGreen = styled.span`
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #35BDB1;
  line-height: 20px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    font-size: 12px;
  `};
`

// const RightArrow = styled.div`
//   width: 8px;
//   height: 8px;
//   border-top: 2px solid #35BDB1;
//   border-right: 2px solid #35BDB1;
//   transform: rotate(45deg);
//   margin-left: 8px;
// `

export default function SwapHeader() {
  const { t } = useTranslation()
  const handleLinkDeal = function () {
    window.open(process.env.REACT_APP_DEALPOOL_URL, '_self')
  }
  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFlex>
          <TYPE.black fontWeight={600}>{t('dealTitle')}</TYPE.black>
          {/* <TYPE.black fontWeight={500} fontSize={14} marginTop={1}>{t('rapidExchange')}</TYPE.black> */}
          <RowColumnCenter onClick={handleLinkDeal}>
            {/* <img style={{ width: '20px', marginRight: '12px' }} src={RewardIcon} alt="" /> */}
            <TextInner>
              APY <TextGreen>160,000%+</TextGreen>{t('dealPoolDes')}
            </TextInner>
            {/* <RightArrow /> */}
            <img style={{ width: '14px', height: '14px', marginLeft: '4px' }} src={RightIcon} alt="" />
          </RowColumnCenter>
        </RowFlex>
        <Settings />
      </RowBetween>
    </StyledSwapHeader>
  )
}
