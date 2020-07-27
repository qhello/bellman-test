export const getCondoSizeDb = condoSize => {
  if (condoSize < 10) return '<10'
  if (condoSize < 50) return '11-49'
  if (condoSize <= 200) return '50-200'
  return '>200'
}

export const getServiceStringFromCombination = ({ heating, employee, elevator }) => {
  if (!heating && !employee && !elevator) return 'service_none'
  if (heating && !employee && !elevator) return 'service_heater'
  if (!heating && !employee && elevator) return 'service_elevator'
  if (heating && !employee && elevator) return 'service_elevator_heater'
  if (heating && employee && !elevator) return 'service_elevator_heater_employee'
  return null
}

export const computeMeanForCombination = (combination, stats) => {
  console.log(combination, stats)

  const newStats = { ...stats }

  // Convert all service_ to int!
  Object.keys(newStats).forEach(key => {
    if (key.startsWith('service_')) newStats[key] = parseInt(newStats[key], 10)
  })

  console.log(newStats)

  // First let's see if the answer is obvious ! (If we already have it)
  const serviceString = getServiceStringFromCombination(combination)

  if (serviceString && newStats[serviceString] > 0)
    return {
      mean: newStats[serviceString],
      std: newStats[`${serviceString}_std`],
    }

  // Result it's obvious, let's compute depending on condo size!
  // Please beware, everything under here is experimental and totally not accurate! Quite ashamed of it

  const serviceIncrements = {}

  // Horrible assignments under here, please don't judge me!
  if (['<10', '11-49'].includes(newStats.condo_size)) {
    serviceIncrements.elevator = {
      mean: newStats.service_elevator - newStats.service_none,
      std: Math.abs(newStats.service_elevator_std - newStats.service_none_std),
    }
    serviceIncrements.heating = {
      mean: newStats.service_heater - newStats.service_none,
      std: Math.abs(newStats.service_heater_std - newStats.service_none_std),
    }
  } else {
    serviceIncrements.elevator = {
      mean: newStats.service_elevator - newStats.service_none,
      std: Math.abs(newStats.service_elevator_std - newStats.service_none_std),
    }
    serviceIncrements.heating = {
      mean: newStats.service_elevator_heater - newStats.service_elevator,
      std: Math.abs(newStats.service_elevator_heater_std - newStats.service_elevator_std),
    }
    serviceIncrements.employee = {
      mean: newStats.service_elevator_heater_employee - newStats.service_elevator_heater,
      std: Math.abs(
        newStats.service_elevator_heater_employee_std - newStats.service_elevator_heater_std
      ),
    }
  }

  // Using the "root" value (no services), let's add the increments we need
  let mean = newStats.service_none
  let std = newStats.service_none_std

  Object.keys(combination).forEach(param => {
    if (combination[param]) {
      mean += serviceIncrements[param].mean
      std += serviceIncrements[param].std
    }
  })

  return { mean, std }
}
