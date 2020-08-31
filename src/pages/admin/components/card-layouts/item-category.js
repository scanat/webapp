import React from "react"
import styled from "styled-components"

const ItemCategory = props => {
  return (
    <ItemHolder>
      <CategoryName>{props.categoryName}</CategoryName>
    </ItemHolder>
  )
}

const ItemHolder = styled.section`
    width: 100%;
    height: auto;
  `,
  CategoryName = styled.p`
    margin-left: 15px;
    float: left;
  `

export default ItemCategory
