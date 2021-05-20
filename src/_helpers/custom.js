/**
 * [This Funtion used for retuning the initials of any string]
 * @param  {[string]} string:string [pass any string]
 * @return {[string]} [return initials of the strring] 11 Nov 2019
 */
export const getInitials = (string: string) => {
  try {
    var names = string.split(' '),
      initials = names[0].substring(0, 1).toUpperCase()
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase()
    } else {
      initials += names[0][1].toUpperCase()
    }
    return initials
  } catch (err) {
    return false
  }
}


export const capitalizeString = (str:string) => (str) ? str.charAt(0).toUpperCase() + str.slice(1) : str

export const capitalizeWord = (str:string) => (str) ? str.toUpperCase() : str

// Convert seconds to hours, minutes and seconds format
export const secondsToHms = (d: any) => {
  d = Number(d)
  var sec_num = parseInt(d, 10) // don't forget the second param
  var hours = Math.floor(sec_num / 3600)
  var minutes = Math.floor((sec_num - hours * 3600) / 60)
  var seconds = sec_num - hours * 3600 - minutes * 60

  if (hours < 10) {
    hours = '0' + hours
  }
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return hours + ':' + minutes + ':' + seconds
}

// Returns number in specific format
export const numberFromat = (num: nummber) => {
  let numFromatted = ''
  if (num) {
    numFromatted =
      '(' + num.slice(0, 3) + ') ' + num.slice(3, 6) + '-' + num.slice(6, 15)
  }
  return numFromatted
}
