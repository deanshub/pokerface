import React, { Component } from 'react'

export default class OnBlur extends Component {
  constructor(props){
    super(props)
    this.state = {
      open: props.open,
    }

    this.closeFn = this.close.bind(this)
  }

  componentWillReceiveProps(props){
    if (props.open!=this.state.open){
      this.setState({
        open: props.open,
        // open: !this.state.open,
      })
    }
  }

  close(){
    this.setState({
      open: false,
    })
  }

  componentWillUnmount(){
    window.removeEventListener('click', this.closeFn , false)
  }

  render(){
    const {children} = this.props
    const {open} = this.state

    if (open){
      window.addEventListener('click', this.closeFn, false)
    }else{
      window.removeEventListener('click', this.closeFn , false)
    }
    return children(open)
  }
}
