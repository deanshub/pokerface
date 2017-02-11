import React, { Component, PropTypes } from 'react'
// import classnames from 'classnames'
// import style from './style.css'
import { Grid, Statistic, Icon } from 'semantic-ui-react'

const statisticalItems = [
  { label: 'Games', value: '22' },
  { label: 'Winings', value: '3,200' },
  { label: 'Avarage Buy-ins', value: '250' },
]

export default class ProfileStatistic extends Component {
  static propTypes = {
  }

  constructor(props){
    super(props)
    this.state = {
    }
  }

  componentDidMount(){
  }

  render() {
    return (
      <Grid columns={3} >
        <Grid.Row>
          <Grid.Column>
            Chart
          </Grid.Column>

          <Grid.Column>
            <Statistic.Group widths="3">
              <Statistic>
                <Statistic.Value>
                  <Icon name="game" />
                  {statisticalItems[0].value}
                </Statistic.Value>
                <Statistic.Label>{statisticalItems[0].label}</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  {statisticalItems[1].value}
                  <Icon name="dollar" />
                </Statistic.Value>
                <Statistic.Label>{statisticalItems[1].label}</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  {statisticalItems[2].value}
                  <Icon name="dollar" />
                </Statistic.Value>
                <Statistic.Label>{statisticalItems[2].label}</Statistic.Label>
              </Statistic>
            </Statistic.Group>
          </Grid.Column>

          <Grid.Column>
            Something Else
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
