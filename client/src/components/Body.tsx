import React from 'react'
import { Outlet } from 'react-router'
import styles from "./css/Body.module.css"
import Header from './Header'

const Body = () => {
  return (
    <div className={`${styles.container}`}>
        <Header/>
        <Outlet />
    </div>
  )
}

export default Body
