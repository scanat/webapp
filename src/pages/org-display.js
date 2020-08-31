import React, { useEffect, useState } from "react"
import styled from "styled-components"
import axios from "axios"
import BasicListCard from "./admin/components/card-layouts/basic-card"

const OrgDisplay = () => {
  const [list, setList] = useState([])
  const [orgName, setOrgName] = useState("")

  useEffect(() => {
    const fullUrl = window.location.href
    const param = fullUrl.split("?org=")[1]
    const rparam = param.split("").reverse().join("")
    const id = rparam.slice(0, 5) + rparam.slice(-5)

    const dashReplace = param.split("-")
    const tracedOrgName = dashReplace[1].split("%20").join(" ")
    setOrgName(tracedOrgName)

    getAllData(id)
  }, [])

  const getAllData = async id => {
    try {
      const params = {
        phoneNumber: id,
      }
      const res = await axios.post(
        `https://dn5kjkew1c.execute-api.ap-south-1.amazonaws.com/beta/items/get`,
        params
      )
      alert(res.data.msg)
      setList(res.data.item)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
        <OrgName>{orgName}</OrgName>
      {list.map(item => (
        <ListItem
          key={item._id}
        >
          <BasicListCard itemName={item.itemName} itemPrice={item.itemPrice} status={item.status} />
        </ListItem>
      ))}
    </Container>
  )
}

const Container = styled.section`
    width: 100%;
    background: transparent;
    text-align: center;
  `,
  ListItem = styled.li``,
  OrgName = styled.h1`
    color: #169188;
  `

export default OrgDisplay
