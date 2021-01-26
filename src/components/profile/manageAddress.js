import { API, graphqlOperation } from "aws-amplify"
import React, { useEffect, useRef, useState } from "react"
import ReactElasticCarousel from "react-elastic-carousel"
import { getCurrentUser } from "../../utils/auth"
import mAStyles from "./manageAddress.module.css"

const ManageAddress = () => {
  const i1 = useRef(null)
  const i2 = useRef(null)
  const i3 = useRef(null)
  const i4 = useRef(null)
  const i5 = useRef(null)
  const i6 = useRef(null)
  const i7 = useRef(null)
  const [errmsg, setErrmsg] = useState()
  const [updateState, setUpdateState] = useState(null)

  const [addresses, setAddresses] = useState([
    {
      flat: "",
      building: "",
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
    },
  ])
  useEffect(() => {
    getAddress()
  }, [])

  async function getAddress() {
    try {
      let inputs = {
        id: getCurrentUser().email,
      }
      await API.graphql(graphqlOperation(getUsers, inputs)).then(res => {
        if (res.data.getUsers.address) {
          setAddresses(res.data.getUsers.address)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  async function addAddress() {
    if (
      i1.current.value !== null &&
      i2.current.value !== null &&
      i3.current.value !== null &&
      i5.current.value !== null &&
      i6.current.value !== null &&
      i7.current.value !== null
    ) {
      let temp = [...addresses]
      let data = {
        flat: i1.current.value,
        building: i2.current.value,
        street: i3.current.value,
        landmark: i4.current.value,
        city: i5.current.value,
        state: i6.current.value,
        pincode: i7.current.value,
      }
      if (updateState !== null) {
        temp[updateState] = data
      } else {
        temp.unshift()
      }
      try {
        let inputs = {
          input: {
            id: getCurrentUser().email,
            address: temp,
          },
        }
        await API.graphql(graphqlOperation(updateUsers, inputs)).then(res => {
          res.data.updateUsers && setAddresses(temp)
          i1.current.value = null
          i2.current.value = null
          i3.current.value = null
          i4.current.value = null
          i5.current.value = null
          i6.current.value = null
          i7.current.value = null
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  const updateAddress = item => {
    i1.current.value = item.flat
    i2.current.value = item.building
    i3.current.value = item.street
    i4.current.value = item.landmark
    i5.current.value = item.city
    i6.current.value = item.state
    i7.current.value = item.pincode
    addresses.forEach((element, id) => {
      if (element === item) {
        setUpdateState(id)
      }
    })
  }

  return (
    <section className={mAStyles.container}>
      <section className={mAStyles.addressContainer}>
        <input ref={i1} type="text" placeholder={"Flat Name/No."} />
        <input ref={i2} type="text" placeholder={"Building Name/No."} />
        <input ref={i3} type="text" placeholder={"Street"} />
        <input ref={i4} type="text" placeholder={"Landmark (optional)"} />
        <input ref={i5} type="text" placeholder={"City"} />
        <input ref={i6} type="text" placeholder={"State"} />
        <input ref={i7} type="text" placeholder={"Pincode"} />
      </section>

      <label className={mAStyles.errmsgBox}>{errmsg}</label>
      <button className={mAStyles.addBtn} onClick={addAddress}>
        Add Address
      </button>
      <ReactElasticCarousel
        showArrows={false}
        pagination={false}
        enableAutoPlay
        autoPlaySpeed={8000}
      >
        {addresses.map((item, id) => (
          <section key={id} className={mAStyles.addressExisting}>
            <button
              className={mAStyles.updateBtn}
              onClick={() => updateAddress(item)}
            >
              Update
            </button>
            <label>{item.flat}</label>
            <label>{item.building}</label>
            <label>{item.street}</label>
            <label>{item.landmark}</label>
            <label>{item.city}</label>
            <label>{item.state}</label>
            <label>{item.pincode}</label>
          </section>
        ))}
      </ReactElasticCarousel>
    </section>
  )
}

export default ManageAddress

export const getUsers = /* GraphQL */ `
  query GetUsers($id: ID!) {
    getUsers(id: $id) {
      address {
        flat
        building
        street
        landmark
        city
        state
        pincode
      }
    }
  }
`
export const updateUsers = /* GraphQL */ `
  mutation UpdateUsers($input: UpdateUsersInput!) {
    updateUsers(input: $input) {
      id
    }
  }
`
