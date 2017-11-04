import ReactGA from 'react-ga'

ReactGA.initialize('UA-106222738-1')
let fields = {}
const environment = process.env.NODE_ENV

const logger = {
  logPageView(page){
    logger.setField({page})
    ReactGA.pageview(page)
  },
  logModalView(modal){
    // logger.setField({modal})
    ReactGA.modalview(modal)
  },
  setField(obj){
    fields = {...fields, ...obj}
    ReactGA.set(obj)
    console.log(fields)
  },
  logEvent(obj){
    if (obj && typeof(obj.category)==='string' && typeof(obj.action)==='string'){
      const {
        category,
        action,
        label,
        value,
        nonInteraction,
        transport,
      } = obj
      console.log(obj)
      ReactGA.event({
        category,
        action,
        label,
        value,
        nonInteraction,
        transport,
      })
    }
  },
  error(description, fatal){
    ReactGA.exception({
      description,
      fatal,
    })
  },
  getGA(){
    return ReactGA
  },
}

logger.setField({environment})

export default logger
