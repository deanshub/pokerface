import staticRoutes from './staticRoutes'

const routesConfig = [{
  name: 'signup',
  // disabled: true,
},{
  name:'avatarGenerator',
  // disabled: true,
},{
  name:'boomTranslator',
  // disabled: true,
},{
  name:'spotGif',
  // disabled: true,
}]

const enableModules = routesConfig
  .filter(route=>route.disabled!==true)
  .map(route=>{
    // import(`./${route.name}`).then(routeModule=>{
    //   return routeModule
    // })
    return Promise.resolve(require(`./${route.name}`).default)
  })

export default {
  apiRoutes: Promise.all(enableModules),
  staticRoutes,
}
