import React from "react"
import TextField from "@material-ui/core/TextField"
import Autocomplete from "@material-ui/lab/Autocomplete"

export default function ComboBox() {
  return (
    <Autocomplete
      id="combo-box-demo"
      options={stateList}
      getOptionLabel={option => option}
      style={{
        width: 150,
        background: "white",
        borderRadius: "5px",
        boxShadow: "2px 6px 6px 0px rgba(0,0,0,0.75)",
        MozBoxShadow: "2px 6px 6px 0px rgba(0,0,0,0.75)",
        WebkitBoxShadow: "2px 6px 6px 0px rgba(0,0,0,0.75)",
      }}
      renderInput={params => (
        <TextField {...params} label="Location" variant="outlined" />
      )}
    />
  )
}

let stateList = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttarakhand",
  "Uttar Pradesh",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Lakshadweep",
  "Puducherry",
]
