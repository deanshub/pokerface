function getClosestRounding(number){
  const numberStringed = String(number)
  const firstDigit = Number(numberStringed.charAt(0))
  const secondDigit = Number(numberStringed.charAt(0))

  const oneFiveNumber = 15*Math.pow(10, numberStringed.length-2)
  const fiveNumber = 5*Math.pow(10, numberStringed.length-1)
  if (firstDigit===1 && secondDigit<=5 && oneFiveNumber>number){
    return oneFiveNumber
  }else if (firstDigit<=5 && fiveNumber>number){
    return fiveNumber
  }else{
    return 1*Math.pow(10, numberStringed.length)
  }
}

function getMaxUpsRepetition(previousBlinds){
  let repetitions = 1
  let maxRepetitions = 1
  let lastUp = previousBlinds[1] - previousBlinds[0]

  previousBlinds.forEach((cur, index, previousBlinds)=>{
    if (index>1){
      const up = cur - previousBlinds[index-1]
      if (up===lastUp){
        repetitions++
        if (maxRepetitions<repetitions){
          maxRepetitions = repetitions
        }
      }else{
        lastUp = up
        repetitions = 1
      }
    }
  })

  return maxRepetitions
}

function getCurrentUpsRepetition(previousBlinds){
  let index = previousBlinds.length-1
  const lastUp = previousBlinds[index] - previousBlinds[index-1]
  index--
  let currentUp = previousBlinds[index] - previousBlinds[index-1]
  let repetions = 1
  while (lastUp===currentUp && index>0){
    repetions++
    currentUp = previousBlinds[index] - previousBlinds[index-1]
    index--
  }
  return repetions
}

function shouldUpTheUpping(earlyStage, reachedMaxRepetition, closestRoundingHightUp, uppingToClosestRatio){
  if (reachedMaxRepetition){
    return true
  }else if (earlyStage && closestRoundingHightUp){
    if (uppingToClosestRatio<1.6){
      return true
    }
  }else if (closestRoundingHightUp){
    if (uppingToClosestRatio<2){
      return true
    }
  }
  return false
}

function guessNextBlind(previousBlinds){
  if (previousBlinds.length===0){
    return 2
  }

  const lastBlind = previousBlinds[previousBlinds.length-1]

  if (previousBlinds.length===1){
    return 2*lastBlind
  }else{
    const closestRounding = getClosestRounding(lastBlind)
    const lastUpping = lastBlind - previousBlinds[previousBlinds.length-2]
    const uppingToClosestRounding = closestRounding - lastBlind
    if (previousBlinds.length===2 && uppingToClosestRounding<lastUpping && uppingToClosestRounding*2>=lastUpping){
      return lastBlind + uppingToClosestRounding
    }

    const earlyStage = previousBlinds.length<4
    const maxUpsRepetition = getMaxUpsRepetition(previousBlinds)
    const currentUpsRepetition = getCurrentUpsRepetition(previousBlinds)
    if (shouldUpTheUpping(earlyStage, maxUpsRepetition>3 && maxUpsRepetition<=currentUpsRepetition, uppingToClosestRounding>lastUpping, uppingToClosestRounding/lastUpping)){
      if (uppingToClosestRounding/lastUpping<3){
        return lastBlind + uppingToClosestRounding
      }else{
        return lastBlind + lastUpping*2
      }
    }else{
      return lastBlind + lastUpping
    }
  }
}

export function fillBlinds(previousBlinds, amountToFill){
  let newBlinds = [...previousBlinds]
  while (newBlinds.length<amountToFill){
    newBlinds = [...newBlinds, guessNextBlind(newBlinds)]
  }
  return newBlinds
}
