// @flow

import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { Redirect } from 'react-router'
import Checkbox from '../../components/basic/Checkbox'
import Button from '../../components/basic/Button'
import Loader from '../../components/basic/Loader'
import Message from '../../components/basic/Message'
import PublicPageTemplate from '../../components/PublicPageTemplate'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@inject('routing')
@observer
export default class SubscriptionTopics extends Component {
  constructor(props){
    super(props)
    const {key} = props.match.params
    this.state = {
      savingInPorgress:false,
      savingSuccess: false,
      savingInFail: false,
      subscriptionTopics:[],
      userKey:key,
      loading:true,
    }
  }

  componentDidMount(){
    const {userKey, loading} = this.state
    const {auth, routing} = this.props
    auth.authenticate()
      .then(() => auth.fetchSubscriptionTopics(userKey))
      .then((subscriptionTopics) => {
        this.setState({subscriptionTopics, loading:false})
      })
      .catch(e=>{
        console.error(e)
        routing.replace('/login')
      })
  }

  onToggleSubscriptionTopic(e, {id, checked}){
    const {subscriptionTopics} = this.state

    subscriptionTopics[Number(id)].subscribe = checked
    this.setState({subscriptionTopics})
  }

  onSave(){
    const {auth} = this.props
    const {subscriptionTopics, userKey} = this.state

    this.setState({savingInPorgress:true})
    auth.setSubscriptionTopics(userKey, subscriptionTopics).then(() => {
      this.setState({savingInPorgress:false, savingSuccess: true})
    }).catch(err => {
      this.setState({
        savingInPorgress:false,
        saveFailMessage:err.message,
        savingSuccess:false,
        savingInFail:true
      })
    })
  }

  render(){
    const {
      subscriptionTopics,
      savingInPorgress,
      userKey,
      savingSuccess,
      savingInFail,
      saveFailMessage,
      loading,
    } = this.state

    const {auth} = this.props

    return (loading?
        <Loader/>
      :
        (!userKey&&!auth.isLoggedIn)?
          <Redirect to='/login?url=/settings/unsubscribe'/>
        :
          <PublicPageTemplate>
            <div className={classnames(style.container)}>
              <div className={classnames(style.title)}>
                Subjects subscribtion
              </div>
              <div className={classnames(style.form)}>
                {
                  subscriptionTopics.map(({topic, subscribe}, index) => (
                    <Checkbox
                        id={index}
                        checkboxLabel={topic}
                        checked={subscribe}
                        key={topic}
                        onChange={::this.onToggleSubscriptionTopic}
                        transparent
                    />
                  ))
                }
                <Button
                    className={style.button}
                    loading={savingInPorgress}
                    onClick={::this.onSave}
                    stretch
                    primary
                    type="submit"
                >
                  Save
                </Button>
              </div>
              {
                savingSuccess&&
                <Message message="Your actions were saved successfully" success/>
              }
              {
                savingInFail&&
                <Message error message={saveFailMessage}/>
              }
            </div>
          </PublicPageTemplate>
    )
  }
}
