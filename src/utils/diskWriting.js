import fs from 'fs'
import request from 'request'
import mkdirp from 'mkdirp'


export const download = (uri, destDirPath, destFileName, callback) => {

  mkdirp(destDirPath, function(err) {
    if (err) return callback(err)

    request.head(uri, function(err){
      if (err) return callback(err)

      request(uri).pipe(fs.createWriteStream(`${destDirPath}/${destFileName}`)).on('close', callback)
    })
  })

}
