import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import style from './style.css'

@inject('auth')
@observer
export default class PostEditor extends Component {
  static defaultProps = {
    readOnly: true,
  }

  static propTypes = {
    id: PropTypes.string.isRequired,
    // onChange: PropTypes.function,
    // onSelect: PropTypes.function,
    readOnly: PropTypes.bool,
    // answers: PropTypes.array,
  }

  constructor(props){
    super(props)
    this.state = {
      answers: props.answers,
    }
  }

  changeAnswer(index, userAnswer){
    const { answers } = this.state
    const { auth, onSelect } = this.props
    if (userAnswer!==index && auth.user.username!==undefined){
      const newAnswers = [...answers]
      if (newAnswers[userAnswer]){
        newAnswers[userAnswer].votes = newAnswers[userAnswer].votes.filter((vote)=>vote!==auth.user.username)
      }
      newAnswers[index].votes.push(auth.user.username)
      this.setState({
        userAnswer: index,
        answers: newAnswers,
      })
      if (onSelect){
        onSelect(index)
      }
    }
  }

  renderAnswer(answer, index, countVotes, userAnswer=-1){
    const { id, auth } = this.props
    let percentage = countVotes===0?0:answer.votes.length/countVotes*100
    percentage = percentage%1?percentage.toFixed(2):percentage
    const percentageText = userAnswer===-1?'':`(${percentage}%)`
    const right = userAnswer===-1?'100%':`${100-percentage}%`

    return (
      <div
          className={classnames(style.option, {[style.disabled]:auth.user.username===undefined})}
          key={index}
          onClick={()=>this.changeAnswer(index, userAnswer)}
      >
        <input
            checked={userAnswer===index}
            id={`${id}.${index}`}
            name={id}
            readOnly
            type="radio"
        />
        <label className={classnames(style.textContainer)} htmlFor={`${id}.${index}`}>
          <span className={classnames(style.radio)}/>
          <span className={classnames(style.label)}>
            <div className={classnames(style.percentage)} style={{right}}/>
            {answer.text} {percentageText}
          </span>
        </label>
      </div>
    )
  }

  render(){
    const { answers } = this.state
    const { auth } = this.props
    const countVotes = answers.reduce((res,cur)=>{
      return res + cur.votes.length
    },0)

    const userAnswer = answers.findIndex((answer)=>{
      return answer.votes.includes(auth.user.username)
    })

    return (
      <form className={classnames(style.poll)}>
        {answers.map((answer, index)=>this.renderAnswer(answer, index, countVotes, userAnswer))}
      </form>
    )
  }
}
