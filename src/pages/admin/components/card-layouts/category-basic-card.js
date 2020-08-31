import React from "react";
import styled from "styled-components";

const BasicCard = (props) => {

  if(props.status){
  return (
    <Card>
      <ItemName>{props.itemName}</ItemName>
      <ItemPrice>Rs {props.itemPrice} /-</ItemPrice>
    </Card>
  )}
  else {
    return (
      <RedCard>
        <ItemName>{props.itemName}</ItemName>
        <ItemPrice>Rs {props.itemPrice} /-</ItemPrice>
      </RedCard>
    )
  }
};

const Card = styled.li`
    position: relative;
    width: 90%;
    height: 50px;
    background: linear-gradient(315deg, #e6e6e6, #dff4d0);
    margin: 10px 5%;
    border-radius: 10px;
    box-shadow: -5px -5px 20px #d9d9d9, 7px 7px 20px #ffffff;
    list-style-type: none;
  `,
  RedCard = styled.li`
    position: relative;
    width: 90%;
    background: linear-gradient(315deg, #e6e6e6, red);
    margin: 10px 5%;
    border-radius: 10px;
    box-shadow: -5px -5px 20px red, 7px 7px 20px #ffffff;
    list-style-type: none;
  `,
  ItemName = styled.p`
    float: left;
    padding: 10px;
    margin-right: 20px;
  `,
  ItemPrice = styled.p`
    padding: 10px;
    float: right;
  `;

export default BasicCard;