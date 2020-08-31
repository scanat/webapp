import React from "react"

const Layout = ({children}) => {

  return (
    <>
      <div style={{margin: 0, padding: 0}}>
        <main>{children}</main>
      </div>
    </>
  )
}

export default Layout
