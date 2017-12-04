import React, { Component, PropTypes } from 'react'
import { Form, Input, Grid, Header, Image, Checkbox } from 'semantic-ui-react'
import { observer } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'

@observer
export default class PlayerField extends Component {
  render(){
    const {playerIndex, isDealer, user, handleAvatarClick} = this.props
    const href=`/profile/${user.username}`

    return (
        <Grid.Column width={5}>
          <div
              className={style.playerRow}
          >
            <Image
                avatar
                centered
                className={classnames(style.avatar,{[style.dealerAvatar]:isDealer})}
                href={href}
                onClick={(e)=>{handleAvatarClick(e, href, playerIndex)}}
                src={user.avatar}
                target="_blank"
            />
            <Header
                className={style.fullname}
                size="large"
            >
              {user.fullname}
            </Header>
            <Form.Field
                className={style.bank}
                control={Input}
                inline
                label="Bank"
                onChange={(e,{value})=>user.bank=parseInt(value)}
                placeholder="100"
                type="number"
                value={user.bank}
            />
            <Form.Field
                className={style.cards}
                control={Input}
                inline
                label="Cards"
                onChange={(e,{value})=>user.cards=value}
                placeholder="Ac Ah"
                value={user.cards}
            />
            <Form.Field
                checked={user.showCards}
                className={style.cardsShow}
                control={Checkbox}
                inline
                label="Show cards upfront"
                onChange={(e,{checked})=>user.showCards=checked}
            />
          </div>
        </Grid.Column>
    )
  }
}
