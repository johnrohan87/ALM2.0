import styled from 'styled-components';

export const BenefitsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 50px;
`;

export const BenefitItem = styled.div`
  width: 100%;
  max-width: 280px;
  margin: 15px;
  padding: 25px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 10px 30px rgba(56, 56, 56, 0.1);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 15px 45px rgba(56, 56, 56, 0.15);
  }

  h4 {
    font-size: 20px;
    font-weight: 500;
    color: #0f2137;
    margin-bottom: 10px;
  }

  p {
    font-size: 15px;
    color: #343d48cc;
    line-height: 1.75;
  }
`;