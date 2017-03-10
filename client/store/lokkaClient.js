import {Lokka} from 'lokka'
import {Transport} from 'lokka-transport-http'

const client = new Lokka({
  transport: new Transport('http://localhost:9031/graphql'),
})

export default client
