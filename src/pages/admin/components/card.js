import React from "react";
import styled from 'styled-components'

const Card = (props) => {
  return <Cards>{props.children}</Cards>;
};

const Cards = styled.section`
  position: relative;
  display: flex;
  background: linear-gradient(315deg, #e6e6e6, #dff4d0);
  margin: 10px auto;
  border-radius: 10px;
  box-shadow: -5px -5px 20px #d9d9d9, 7px 7px 20px #ffffff;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: max-content;
`;

export default Card;
