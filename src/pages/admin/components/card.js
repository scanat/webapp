import React from "react";
import cardStyles from './card.module.css'

const Card = (props) => {
  return <section className={cardStyles.card}>{props.children}</section>;
};


export default Card;
