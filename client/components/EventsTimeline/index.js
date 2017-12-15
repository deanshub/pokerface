import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import style from './style.css'

export default class EventsTimeline extends Component {
  static propTypes = {
    color: PropTypes.string,
    currentIndex: PropTypes.number,
    emptyColor: PropTypes.string,
    events: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string })).isRequired,
    onClick: PropTypes.func.isRequired,
  }

  static defaultProps = {
    color: '#f2f2f2',
    currentIndex: 0,
    emptyColor: '#535168',
  }

  constructor(props) {
    super(props)
    this.handlePointClick = this.handlePointClick.bind(this)
  }

  getRight(index) {
    const eventsAmount = this.props.events.length
    const gap = 100 / eventsAmount
    const halfGap = gap / 2
    const multiplyBy = eventsAmount - index

    const right = (gap * multiplyBy) - halfGap
    return right
  }

  handlePointClick(currentIndex) {
    const { onClick, events } = this.props

    if (onClick) {
      onClick(events[currentIndex])
    }
  }

  mapItems() {
    const { events } = this.props

    return events.map((item, index) => {
      const onClick = () => this.handlePointClick(index)
      const key = `event-${index}`
      const rangeBorder = index===0 || index===events.length-1

      return (
        <li
            className={classnames(style.eventsTimelineEvent)}
            key={key}
            onClick={onClick}
        >
          { item.title && <span className={classnames(style.eventTitle)}>{item.title}</span> }
          <button
              className={classnames({
                [style.untitledEvent]:!item.title ,
                [style.rangeBorder]:rangeBorder,
              })}
          />
        </li>
      )
    })
  }

  getLineStyle() {
    const { events } = this.props
    const percent = 100/events.length
    const left = `${percent/2}%`
    const right = left
    const width = `${100 - percent}%`
    return { left, right, width }
  }

  getFilledLineStyle() {
    const { currentIndex } = this.props
    const right = `calc(${this.getRight(currentIndex)}% - 5px)`
    return {
      right,
    }
  }

  render() {
    const lineStyle = this.getLineStyle()
    const filledLineStyle = this.getFilledLineStyle()
    return (
      <div className={classnames(style.eventsTimelineComponent)}>
        <ul className={classnames(style.eventsTimelineContainer)}>
          <span className={classnames(style.eventsTimelineLine)} style={lineStyle} />
          <span
              className={classnames(style.eventsTimelineLine, style.eventsTimelineFilled)}
              style={filledLineStyle}
          />
          { this.mapItems() }
        </ul>
      </div>
    )
  }
}
