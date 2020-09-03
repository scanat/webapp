import React from "react"
import SearchBar from "../elements/searchBar"
import AutocompleteLocation from "../elements/autoComplete"
import TextField from "@material-ui/core/TextField"
import searchStyles from "./search.module.css"

const Search = () => {
  return (
    <section className={searchStyles.container}>
      <AutocompleteLocation />
      <TextField
        style={{
          flex: 1,
          background: "white",
          borderRadius: "5px",
          marginLeft: "10px",
          boxShadow: "2px 6px 6px 0px rgba(0,0,0,0.75)",
          MozBoxShadow: "2px 6px 6px 0px rgba(0,0,0,0.75)",
          WebkitBoxShadow: "2px 6px 6px 0px rgba(0,0,0,0.75)",
        }}
        id="outlined-basic"
        label="Search"
        variant="outlined"
      />
    </section>
  )
}

export default Search
