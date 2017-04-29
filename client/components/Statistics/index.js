import React, { Component, PropTypes } from 'react'
// import classnames from 'classnames'
// import style from './style.css'
import { Grid, Statistic, Icon } from 'semantic-ui-react'
import WinningsChart from '../WinningsChart'
import PlayingChart from '../PlayingChart'

const statisticalItems = [
  { label: 'Games', value: '22' },
  { label: 'Winings', value: '3,200' },
  { label: 'Avarage Buy-ins', value: '250' },
  { label: 'Avarage Win', value: '250' },
  { label: 'Position', value: '2' },
]

const winningsChartData = [{
  startDate: new Date(),
  winSum: 1000,
  location: 'Raanana',
},{
  startDate: new Date(),
  winSum: 200,
  location: 'Herzelia',
},{
  startDate: new Date(),
  winSum: 1700,
  location: 'Ramat Hasharon',
},{
  startDate: new Date(),
  winSum: 3400,
  location: 'Rishon Lezion',
}]

const playingChartData = [{
  subject: 'Bluffing',
  A: 100,
  B: 90,
  fullMark: 100,
},{
  subject: 'Aggresive',
  A: 88,
  B: 30,
  fullMark: 100,
},{
  subject: 'Smart',
  A: 86,
  B: 70,
  fullMark: 100,
},{
  subject: 'Predictive',
  A: 27,
  B: 100,
  fullMark: 100,
},{
  subject: 'Agile',
  A: 85,
  B: 90,
  fullMark: 100,
},{
  subject: 'Non-Emotional',
  A: 65,
  B: 85,
  fullMark: 100,
}]

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
                player={{name:'Dean Shub'}}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
