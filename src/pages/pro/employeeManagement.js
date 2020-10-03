import React, { useEffect, useRef, useState } from "react"
import employeeStyles from "./employeeManagement.module.css"
import Layout from "../../components/layout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { getCurrentUser } from "../../utils/auth"
import AWS from "aws-sdk"
import Loader from "../../components/loader"
import { Auth } from "aws-amplify"

const subscribersDb = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
  apiVersion: "2012-08-10",
  accessKeyId: process.env.GATSBY_SUBSCRIBER_DB_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_SUBSCRIBER_DB_SECRET_ACCESS_KEY,
})

const employeesDb = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
  apiVersion: "2012-08-10",
  accessKeyId: process.env.GATSBY_EMPLOYEES_DB_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_EMPLOYEES_DB_SECRET_ACCESS_KEY,
})

const CreateEmployee = props => {
  const employeeNameId = useRef(null)
  const employeeEmailId = useRef(null)
  const employeePhoneId = useRef(null)
  const employeeAddressId = useRef(null)
  const employeeIdSourceId = useRef(null)
  const employeeIdNumberId = useRef(null)
  const employeeLoginId = useRef(null)
  const employeePassword = useRef(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState()

  const createNewEmployee = async () => {
    if (
      employeeNameId.current.value.length > 0 &&
      employeeEmailId.current.value.length > 0 &&
      employeePhoneId.current.value.length > 0 &&
      employeeAddressId.current.value.length > 0 &&
      employeeIdSourceId.current.value.length > 0 &&
      employeeIdNumberId.current.value.length > 0
    ) {
      if (
        employeeLoginId.current.value.length > 0 &&
        employeePassword.current.value.length > 0
      ) {
        try {
          setLoading(true)
          const user = await Auth.signUp({
            username: employeeLoginId.current.value,
            password: employeePassword.current.value,
            attributes: {
              name: "",
              picture: "",
              website: "",
              email: employeeEmailId.current.value,
              phone_number: "+91" + employeePhoneId.current.value,
              address: employeeAddressId.current.value,
              "custom:nick_name": employeeNameId.current.value,
              "custom:owner": getCurrentUser().phone_number,
              "custom:idSource": employeeIdSourceId.current.value,
              "custom:idNumber": employeeIdNumberId.current.value,
            },
          })
          if (user) {
            setSubscriberEmployeeData(
              employeeLoginId.current.value,
              employeePassword.current.value
            )
          }
          setLoading(false)
        } catch (error) {
          setError(error.message)
          setLoading(false)
        }
      }
    }
  }

  async function setSubscriberEmployeeData(loginId, loginPass) {
    // Subscribers Table Update
    try {
      setLoading(true)
      const params = {
        TableName: "subscribers",
        ExpressionAttributeNames: {
          "#M": "managers",
        },
        ExpressionAttributeValues: {
          ":ml": [
            {
              loginId: loginId,
              loginPw: btoa(loginPass),
            },
          ],
          ":empty_list": [],
        },
        ReturnValues: "ALL_NEW",
        Key: {
          phoneNumber: getCurrentUser().phone_number,
        },
        UpdateExpression:
          "SET #M = list_append(if_not_exists(#M, :empty_list), :ml)",
      }
      await subscribersDb.update(params, (err, data) => {
        setLoading(false)
      })
    } catch (error) {
      setLoading(false)
    }
    // Employees Table Update
    try {
      setLoading(true)
      const params = {
        TableName: "employees",
        ExpressionAttributeNames: {
          "#M": "modules",
          "#S": "status",
        },
        ExpressionAttributeValues: {
          ":ml": ["mod-userdetails"],
          ":s": true,
          ":empty_list": [],
        },
        ReturnValues: "ALL_NEW",
        Key: {
          employeeId: loginId,
        },
        UpdateExpression:
          "SET #M = list_append(if_not_exists(#M, :empty_list), :ml), #S = :s",
      }
      await employeesDb.update(params, (err, data) => {
        setLoading(false)
      })
    } catch (error) {
      setLoading(false)
    }
    props.toggleCreateEmployee()
  }

  return (
    <section className={employeeStyles.createEmployeeContainer}>
      <Loader loading={loading} />
      <h1>Create a Manager</h1>
      <label>Employee Name*</label>
      <input ref={employeeNameId} required placeholder="Name of the employee" />
      <label>Employee Email*</label>
      <input
        ref={employeeEmailId}
        inputMode="email"
        required
        placeholder="eg. i@you.we"
      />
      <label>Employee Phone Number*</label>
      <input
        ref={employeePhoneId}
        inputMode="tel"
        placeholder="Phone Number (10)"
        maxLength={10}
      />
      <label>Employee Address</label>
      <input ref={employeeAddressId} placeholder="Full Address" />
      <label>Employee Identity Source Name*</label>
      <input
        ref={employeeIdSourceId}
        required
        placeholder="eg, Aadhaar, PAN, etc"
      />
      <label>Employee Identity Unique Number*</label>
      <input
        ref={employeeIdNumberId}
        required
        placeholder="eg. Aadhar Number, PAN Number"
      />
      <label>Login Username*</label>
      <input ref={employeeLoginId} required placeholder="Employee Login Id" />
      <label>Login Password*</label>
      <input
        ref={employeePassword}
        required
        type="password"
        placeholder="([A-Z], [a-z], [0-9], min 8)"
      />
      {error && <p className={employeeStyles.errorText}>{error}</p>}
      <button
        type="submit"
        onClick={createNewEmployee}
        className={employeeStyles.createManagerButton}
      >
        Update Employee
      </button>
    </section>
  )
}

const EmployeesList = props => {
  const [managers, setManagers] = useState([])
  useEffect(() => {
    fetchAllEmployees()
  }, [])

  async function fetchAllEmployees() {
    try {
      const params = {
        TableName: "subscribers",
        Key: {
          phoneNumber: getCurrentUser().phone_number,
        },
        AttributesToGet: ["managers"],
      }

      subscribersDb.get(params, (err, data) => {
        console.log(err, data)
        if (data) {
          setManagers(data.Item.managers)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <section className={employeeStyles.employeesContainer}>
      {managers.map((item, id) => (
        <section key={id} className={employeeStyles.card}>
          <h1 className={employeeStyles.cardTopic}>{item}</h1>
        </section>
      ))}
    </section>
  )
}

const EmployeeManagement = () => {
  const [createEmployeeVisibile, setCreateEmployeeVisibile] = useState(false)

  const createEmployeeHandler = () => {
    setCreateEmployeeVisibile(e => !e)
  }

  return (
    <Layout>
      <button
        className={employeeStyles.createManagerButton}
        onClick={createEmployeeHandler}
      >
        {createEmployeeVisibile ? (
          <FontAwesomeIcon icon={faTimes} color="whitesmoke" />
        ) : (
          "Create a Manager"
        )}
      </button>
      {createEmployeeVisibile && (
        <CreateEmployee toggleCreateEmployee={createEmployeeHandler} />
      )}
      <EmployeesList />
    </Layout>
  )
}

export default EmployeeManagement
