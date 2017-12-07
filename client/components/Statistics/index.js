import React, { Component } from 'react'
// import PropTypes from 'prop-types'
// import classnames from 'classnames'
// import style from './style.css'
import { Grid, Statistic, Icon } from 'semantic-ui-react'
import { observer, inject } from 'mobx-react'
import WinningsChart from '../WinningsChart'
import PlayingChart from '../PlayingChart'

const statisticalItems = [
  { label: 'Games', value: '0' },
  { label: 'Winings', value: '0' },
  { label: 'Avarage Buy-ins', value: '0' },
  { label: 'Avarage Win', value: '0' },
  { label: 'Position', value: '1' },
]

const winningsChartData = []

const playingChartData = [{
  subject: 'Bluffing',
  A: 50,
  B: 90,
  fullMark: 100,
},{
  subject: 'Aggresive',
  A: 50,
  B: 30,
  fullMark: 100,
},{
  subject: 'Smart',
  A: 50,
  B: 70,
  fullMark: 100,
},{
  subject: 'Predictive',
  A: 50,
  B: 100,
  fullMark: 100,
},{
  subject: 'Agile',
  A: 50,
  B: 90,
  fullMark: 100,
},{
  subject: 'Non-Emotional',
  A: 50,
  B: 85,
  fullMark: 100,
}]

@inject('auth')
@observer
export default class ProfileStatistics extends Component {
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
    const {auth} = this.props

    return (
      <Grid columns={3} >
        <Grid.Row>
          <Grid.Column>
            <WinningsChart
                data={winningsChartData}
            />
          </Grid.Column>

          <Grid.Column>
            <Statistic.Group widths={1}>
              <Statistic size="large">
                <Statistic.Value>
                  {statisticalItems[4].value}
                  <Icon name="child" />
                </Statistic.Value>
                <Statistic.Label>{statisticalItems[4].label}</Statistic.Label>
              </Statistic>
            </Statistic.Group>
            <Statistic.Group widths={2}>
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
              <Statistic>
                <Statistic.Value>
                  {statisticalItems[3].value}
                  <Icon name="dollar" />
                </Statistic.Value>
                <Statistic.Label>{statisticalItems[3].label}</Statistic.Label>
              </Statistic>
            </Statistic.Group>
          </Grid.Column>

          <Grid.Column>
            <PlayingChart
                data={playingChartData}
                player={auth.user}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
