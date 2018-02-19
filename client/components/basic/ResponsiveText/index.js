import React, { Component } from 'react'
export default class ResponsiveText extends Component {
  static defaultProps = {
    scale: 1,
  }
  constructor(props) {
    super(props)
    this.state = {
      style: undefined,
    }
    this.resizeHandler = this.resizeHandler.bind(this)
  }

  componentDidMount(){
    window.addEventListener('resize', this.resizeHandler)
    this.resizeHandler()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeHandler)
  }

  resizeHandler() {
    const {scale} = this.props
    setTimeout(()=>{
      const parent = getComputedStyle(this.el.parentElement)

      this.el.style.fontSize=''
      const fontSize = Math.min(parseFloat(parent.width)/4, parseFloat(parent.height)) * scale
      if ((!this.state.style)||(this.state.style&&this.state.style.fontSize&&this.state.style.fontSize!==fontSize)){
        this.setState({
          style:{fontSize},
        })
      }else{
        this.el.style.fontSize=`${fontSize}px`
      }
    })
  }

  render(){
    const {children} = this.props
    const {style} = this.state

    return (
      <div ref={el=>this.el = el} style={style}>
        {children}
      </div>
    )
  }
}
