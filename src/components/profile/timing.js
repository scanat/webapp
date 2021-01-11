import React, { useState } from "react"
import Layout from "../layout"
import timingStyles from "./timing.module.css"
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { API, graphqlOperation } from "aws-amplify"
import { getCurrentUser } from "../../utils/auth"

const Timing = () => {
  const [time, setTime] = useState({
    day1: "Mon",
    day2: "Sat",
    time1: "10:00",
    time2: "22:00",
  })
  const [happyTime, setHappyTime] = useState({
    day1: "Mon",
    day2: "Sat",
    time1: "10:00",
    time2: "22:00",
  })
  const [timeArray, setTimeArray] = useState([time, happyTime])

  const uploadTiming = async () => {
    try {
      let inputs = {
        input: {
          id: getCurrentUser()["custom:page_id"],
          businessHours: [time, happyTime],
        },
      }
      await API.graphql(graphqlOperation(updateSubscriber, inputs)).then(res =>
        console.log(res)
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <section className={timingStyles.container}>
        <section className={timingStyles.subContainer}>
          <label>Business Days</label>
          <section>
            <select
              onChange={e =>
                setTime({
                  day1: e.target.value,
                  day2: time.day2,
                  time1: time.time1,
                  time2: time.time2,
                })
              }
            >
              <option>Mon</option>
              <option>Tue</option>
              <option>Wed</option>
              <option>Thu</option>
              <option>Fri</option>
              <option>Sat</option>
              <option>Sun</option>
            </select>{" "}
            -{" "}
            <select
              onChange={e =>
                setTime({
                  day1: time.day1,
                  day2: e.target.value,
                  time1: time.time1,
                  time2: time.time2,
                })
              }
              defaultValue="Sat"
            >
              <option>Mon</option>
              <option>Tue</option>
              <option>Wed</option>
              <option>Thu</option>
              <option>Fri</option>
              <option>Sat</option>
              <option>Sun</option>
            </select>
          </section>

          <label>Business Hours</label>
          <section>
            <select
              onChange={e =>
                setTime({
                  day1: time.day1,
                  day2: time.day2,
                  time1: e.target.value,
                  time2: time.time2,
                })
              }
              defaultValue={"10:00"}
            >
              {[...Array(24).keys()].map(item => (
                <option>{item < 9 ? "0" + (item + 1) : item + 1}:00</option>
              ))}
            </select>{" "}
            -{" "}
            <select
              onChange={e =>
                setTime({
                  day1: time.day1,
                  day2: time.day2,
                  time1: time.time1,
                  time2: e.target.value,
                })
              }
              defaultValue={"22:00"}
            >
              {[...Array(24).keys()].map(item => (
                <option>{item < 9 ? "0" + (item + 1) : item + 1}:00</option>
              ))}
            </select>
          </section>
          <label
            style={{
              textAlign: "center",
            }}
          >
            Mention your regular business hours here.
          </label>
          <FontAwesomeIcon icon={faCheckCircle} color="#169188" />
        </section>

        <section className={timingStyles.subContainer}>
          <label>Business Days</label>
          <section>
            <select
              onChange={e =>
                setHappyTime({
                  day1: e.target.value,
                  day2: happyTime.day2,
                  time1: happyTime.time1,
                  time2: happyTime.time2,
                })
              }
            >
              <option>Mon</option>
              <option>Tue</option>
              <option>Wed</option>
              <option>Thu</option>
              <option>Fri</option>
              <option>Sat</option>
              <option>Sun</option>
            </select>{" "}
            -{" "}
            <select
              onChange={e =>
                setHappyTime({
                  day1: happyTime.day1,
                  day2: e.target.value,
                  time1: happyTime.time1,
                  time2: happyTime.time2,
                })
              }
              defaultValue="Sat"
            >
              <option>Mon</option>
              <option>Tue</option>
              <option>Wed</option>
              <option>Thu</option>
              <option>Fri</option>
              <option>Sat</option>
              <option>Sun</option>
            </select>
          </section>

          <label>Business Hours</label>
          <section>
            <select
              onChange={e =>
                setHappyTime({
                  day1: happyTime.day1,
                  day2: happyTime.day2,
                  time1: e.target.value,
                  time2: happyTime.time2,
                })
              }
              defaultValue={"10:00"}
            >
              {[...Array(24).keys()].map(item => (
                <option>{item < 9 ? "0" + (item + 1) : item + 1}:00</option>
              ))}
            </select>{" "}
            -{" "}
            <select
              onChange={e =>
                setHappyTime({
                  day1: happyTime.day1,
                  day2: happyTime.day2,
                  time1: happyTime.time1,
                  time2: e.target.value,
                })
              }
              defaultValue={"22:00"}
            >
              {[...Array(24).keys()].map(item => (
                <option>{item < 9 ? "0" + (item + 1) : item + 1}:00</option>
              ))}
            </select>
          </section>
          <label
            style={{
              textAlign: "center",
            }}
          >
            Mention happy hours (if any).
          </label>
          <FontAwesomeIcon icon={faCheckCircle} color="#169188" />
        </section>
        <button onClick={uploadTiming}>Upload</button>
      </section>
    </Layout>
  )
}

export default Timing

export const updateSubscriber = /* GraphQL */ `
  mutation UpdateSubscriber($input: UpdateSubscriberInput!) {
    updateSubscriber(input: $input) {
      id
    }
  }
`
