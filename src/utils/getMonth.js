const getMonth = month => {
  switch (month) {
    case "01":
      return "Janvier"
    case "02":
      return "Février"
    case "03":
      return "Mars"
    case "04":
      return "Avril"
    case "05":
      return "Mai"
    case "06":
      return "Juin"
    case "07":
      return "Juillet"
    case "08":
      return "Août"
    case "09":
      return "Septembre"
    case "10":
      return "Octobre"
    case "11":
      return "Novembre"
    case "12":
      return "Décembre"
    default:
      return ""
  }
}

export default getMonth
