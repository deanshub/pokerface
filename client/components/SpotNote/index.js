// @flow
import React from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'
import Button from '../basic/Button'

export default ()=>{
  return (
    <div className={classnames(style.container)}>
      <div className={classnames(style.header)}>
        <div className={classnames(style.text)}>
          Print this for note taking at the poker table
        </div>
        <Button onClick={()=>window.print()} primary>Print</Button>
      </div>
      <table
          cellPadding="0"
          cellSpacing="0"
          className={classnames(style.table, style.printable)}
          id="section-to-print"
      >
        <thead className={classnames(style.thead)}>
          <tr>
            <td />
            <th>Hand:</th>
            <th>Stakes:</th>
            <th>Blinds:</th>
            <th>Position:</th>
          </tr>
        </thead>
        <tbody className={classnames(style.tbody)}>
          <tr>
            <td>Pre-Flop</td>
            <td/>
            <td/>
            <td/>
            <td/>
          </tr>
          <tr>
            <td>Flop</td>
            <td/>
            <td/>
            <td/>
            <td/></tr>
          <tr>
            <td>Turn</td>
            <td/>
            <td/>
            <td/>
          <td/>
          </tr>
            <tr>
            <td>River</td>
            <td/>
            <td/>
            <td/>
            <td/>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
