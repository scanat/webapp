import React from "react"
import moduleNavigationStyles from "./moduleNavigation.module.css"

import fnb from "../../images/fnb.png"
import fnv from "../../images/fnv.png"
import stores from "../../images/stores.png"

const ModuleNavigation = () => {
  return (
      <section className={moduleNavigationStyles.container}>
        <section className={moduleNavigationStyles.navContainer}>
          <section className={moduleNavigationStyles.button}>
            <img
              className={moduleNavigationStyles.navImages}
              src={fnb}
              alt="Food and Bevarages Scan At"
            />
          </section>

          <section className={moduleNavigationStyles.button}>
            <img
              className={moduleNavigationStyles.navImages}
              src={fnv}
              alt="Food and Bevarages Scan At"
            />
          </section>

          <section className={moduleNavigationStyles.button}>
            <img
              className={moduleNavigationStyles.navImages}
              src={stores}
              alt="Food and Bevarages Scan At"
            />
          </section>
        </section>
      </section>
  )
}

export default ModuleNavigation
