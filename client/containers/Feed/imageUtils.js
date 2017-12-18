export default {
  newCanvas(postElement, bgColor='#ffffff'){
    let canvas = document.createElement('canvas')
    canvas.width =  parseFloat(getComputedStyle(postElement).width)
    canvas.height = parseFloat(getComputedStyle(postElement).height)
    let ctx = canvas.getContext('2d')
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    return canvas
  },
  toImage(svgElement, canvas){
    return new Promise((resolve, reject)=>{
      const svgString = new XMLSerializer().serializeToString(svgElement).replace(/#/g, '%23').replace(/\n/g, '%0A')
      const dataUri = `data:image/svg+xml;charset=utf-8,${svgString}`
      // const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'})
      // const DOMURL = window.URL || window.webkitURL || window
      // const dataUri = DOMURL.createObjectURL(svgBlob)

      const img = new Image()
      img.onload = ()=>{
        canvas.getContext('2d').drawImage(img,0,0)
        const png = canvas.toDataURL('image/png')
        resolve(png)
      }
      img.onerror = reject
      img.src = dataUri
    })
  },
}
