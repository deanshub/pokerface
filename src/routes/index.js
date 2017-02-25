const routesConfig = [{
  name: 'signup',
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

export default Promise.all(enableModules)
