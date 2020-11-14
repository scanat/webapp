import React, { useEffect, useRef, useState } from "react"
import moduleStyles from "./modules.module.css"
import AWS from "aws-sdk"
import { getCurrentUser } from "../../utils/auth"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDown } from "@fortawesome/free-solid-svg-icons"
import Layout from "../layout"

const globalDb = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
  apiVersion: "2012-08-10",
  accessKeyId: process.env.GATSBY_GLOBAL_DB_ACCESS_ID,
  secretAccessKey: process.env.GATSBY_GLOBAL_DB_SECRET_ACCESS_KEY,
})

const subscriberDb = new AWS.DynamoDB.DocumentClient({
  region: "ap-south-1",
  apiVersion: "2012-08-10",
    accessKeyId: process.env.GATSBY_SUBSCRIBERPAGE_DB_ACCESS_ID,
    secretAccessKey: process.env.GATSBY_SUBSCRIBERPAGE_DB_SECRET_ACCESS_KEY,
})

const DetailsCard = ({ children }) => {
  return <section className={moduleStyles.card}>{children}</section>
}

const Modules = () => {
  const [modulesList, setModulesList] = useState([])
  const [selectedList, setSelectedList] = useState([])
  const modulesListRef = useRef(null)

  useEffect(() => {
    fetchAllModulesList()
  }, [])

  async function fetchAllModulesList() {
    try {
      const params = {
        TableName: "globalTable",
        Key: {
          globalId: getCurrentUser()["custom:category"],
        },
      }
      await globalDb.get(params, (err, data) => {
        setModulesList(data.Item.modules)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const addModulesToList = () => {
    let tempList = [...modulesList]
    tempList.map(item => {
      if (item.name === modulesListRef.current.value) {
        item.default = true
      }
    })
    setModulesList(tempList)
  }

  const toggleView = id => {
    if (typeof window !== "undefined") {
      const viewId = document.getElementById("desc" + id)
      viewId.style.display === "block"
        ? (viewId.style.display = "none")
        : (viewId.style.display = "block")
    }
  }

  const uploadModuleList = async () => {
    modulesList.map(item => {
      if (item.default) {
        selectedList.push(item)
        let temp = [...selectedList]
        setSelectedList(temp)
      }
    })
    console.log("Here: "+JSON.stringify(selectedList))
    try {
      const params = {
        TableName: "subscribers",
        Item: {
          phoneNumber: getCurrentUser().phone_number,
          modules: selectedList
        },
      }
      await subscriberDb.put(params, (err, data) => {
        console.log(err, data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      <h1>
        Select your modules, <u>they are free!</u>
      </h1>
      <select ref={modulesListRef} className={moduleStyles.moduleDropDown}>
        {modulesList.map((item, id) => {
          if (!item.default)
            return (
              <option key={id} value={item.name} data-id={id}>
                {item.name}
              </option>
            )
        })}
      </select>

      <button className={moduleStyles.addButton} onClick={addModulesToList}>
        Add Modules
      </button>

      <ul className={moduleStyles.selectedModuleContainer}>
        {modulesList.map((item, id) => {
          if (item.default)
            return (
              <li key={id} onClick={() => toggleView(id)}>
                {item.name}{" "}
                <FontAwesomeIcon
                  style={{ float: "right" }}
                  icon={faAngleDown}
                  color="grey"
                />
                <br />
                <label id={"desc" + id} className={moduleStyles.desc}>
                  {item.description}
                </label>
              </li>
            )
        })}
      </ul>

      <button className={moduleStyles.addButton} onClick={uploadModuleList}>
        Upload Modules
      </button>
    </Layout>
  )
}

export default Modules
