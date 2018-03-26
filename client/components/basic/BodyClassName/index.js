import React,{Component} from 'react'
import PropTypes from 'prop-types'

export default class BodyClassName extends Component {
  static propTypes = {
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  componentDidMount() {
    this.props.className.split(' ').forEach(className=>{
      document.body.classList.toggle(className, true)
    })
  }

  componentWillReceiveProps(nextProps) {
    const currentClasses = this.props.className.split(' ')
    const futureClasses = nextProps.className.split(' ')

    const removeClasses = currentClasses.filter(className=>!futureClasses.includes(className))
    const addClasses = futureClasses.filter(className=>!currentClasses.includes(className))

    removeClasses.forEach(className=>{
      document.body.classList.toggle(className, false)
    })
    addClasses.forEach(className=>{
      document.body.classList.toggle(className, true)
    })
  }

  componentWillUnmount() {
    this.props.className.split(' ').forEach(className=>{
      document.body.classList.remove(className)
    })
  }
  
  render() {
    return this.props.children
  }
}
