import styled from 'styled-components';

export const Island = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;

  * + * {
    margin-top: 20px;
  }
`;

export const Inline = styled.div`
  display: flex;

  * + * {
    margin-left: 10px;
  }
`;
