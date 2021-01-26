import { faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { API, graphqlOperation } from "aws-amplify"
import React, { useRef, useState } from "react"
import { getCurrentUser } from "../../utils/auth"
import feedbackStyles from "./feedback.module.css"

const Feedback = () => {
  const [rating, setRating] = useState(1)
  const msgRef = useRef(null)
  const responsemsg = useRef(null)

  async function sendFeedback() {
    try {
      let inputs = {
        input: {
          sentFrom: getCurrentUser().email,
          message: msgRef.current.value,
          rating: rating,
          type: "USER",
        },
      }
      await API.graphql(graphqlOperation(createFeedback, inputs)).then(res =>
        res && (responsemsg.current.style.display = "block")
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className={feedbackStyles.container}>
      <label className={feedbackStyles.headLabel}>
        Let us know how you feel about our service.
      </label>
      <textarea
        className={feedbackStyles.messageBox}
        placeholder="Share your opinion..."
        maxLength={500}
        ref={msgRef}
      />
      <section>
        {[...Array(5).keys()].map((item, id) => (
          <FontAwesomeIcon
            icon={faStar}
            color={id < rating ? "#ffc400" : "grey"}
            onClick={() => setRating(id + 1)}
            style={{ margin: "0 2px" }}
          />
        ))}
      </section>

      <button className={feedbackStyles.submitBtn} onClick={sendFeedback}>
        Submit
      </button>
      <p ref={responsemsg} className={feedbackStyles.donemsg}>
        Your opinion helps us improve, thankyou!
      </p>
    </section>
  )
}

export default Feedback

export const createFeedback = /* GraphQL */ `
  mutation CreateFeedback($input: CreateFeedbackInput!) {
    createFeedback(input: $input) {
      id
    }
  }
`
