import React from "react"
import faqStyles from "./faqs.module.css"

const Faqs = () => {
  return (
    <section className={faqStyles.container}>
      {faqsData.map((item, id) => (
        <section key={id} className={faqStyles.faqContainer}>
          <label>{item.q}</label>
          <p>{item.a}</p>
        </section>
      ))}
    </section>
  )
}

export default Faqs

const faqsData = [
  {
    q: "What is ScanAt customer care no?",
    a: "Reach out to us on corporate.scanat.in.",
  },
  {
    q: "How do I register my business with ScanAt?",
    a:
      "Go to login or visit www.subscriber.scanat.in and register as subscriber.",
  },
  {
    q: "How can I edit my order?",
    a:
      "In order to edit your order,click on my orders and then to 'Edit my order'.Please note that your order can be edited only if the subscriber on the other side gives permission.",
  },
  {
    q: "How can I provide my feedback?",
    a:
      "Email us on corporate.scanat@in or go to feedback section in your proile.",
  },
  {
    q: "How can I cancel my order?",
    a:
      "In order to edit your order,click on my orders and then to 'Edit my order'.Please note that your order can be edited only if the subscriber on the other side gives permission.",
  },
  {
    q: "Is ScanAt accountable for the quality and quantity?",
    a:
      "ScanAt provides the digital platform to businesses to go online. We do no share responsibilities nor do we have any authority with regards to quality and quantity.",
  },
  {
    q: "What is the minimum order value?",
    a: "The minimum order value varies from service providers.",
  },
]
