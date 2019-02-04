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
    setTimeout(()=>{
      if (this.el){
        const {scale} = this.props
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
      }
    })
  }

  ref(el){
    if (el && !this.el){
      this.el = el
    }
  }

  render(){
    const {children, className} = this.props
    const {style} = this.state

    return (
      <div
          className={className}
          ref={::this.ref}
          style={style}
      >
        {children}
      </div>
    )
  }
}