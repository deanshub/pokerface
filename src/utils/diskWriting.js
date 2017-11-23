import fs from 'fs'
import request from 'request'
import mkdirp from 'mkdirp'


export const download = (uri, destDirPath, destFileName) => {
  return new Promise((resolve, reject)=>{
    mkdirp(destDirPath, function(err) {
      if (err) return reject(err)

      request.head(uri, function(err){
        if (err) return reject(err)

        request(uri).pipe(fs.createWriteStream(`${destDirPath}/${destFileName}`)).on('close', resolve)
      })
    })
  })
}
