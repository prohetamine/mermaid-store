import styled from 'styled-components'

const Body = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 0px;
  overflow-y: scroll;
  gap: 30px;
  user-select: none;
  margin-top: 20px;
`

const Image = styled.img`
  max-width: 580px;
  width: 100%;
`

const Label = styled.div`
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #696969;
  flex: none;
  order: 0;
  flex-grow: 0;
`

const EmptyCards = ({ image, label }) => {
  return (
    <Body>
      <Label>{label}</Label>
      <Image src={image} />
    </Body>
  )
}

export default EmptyCards
