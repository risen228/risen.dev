const monthMapRu = {
  0: 'января',
  1: 'февраля',
  2: 'марта',
  3: 'апреля',
  4: 'мая',
  5: 'июня',
  6: 'июля',
  7: 'августа',
  8: 'сентября',
  9: 'октября',
  10: 'ноября',
  11: 'декабря',
}

const monthMapEn = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
}

const formatters = {
  ru: date => {
    const d = new Date(date)

    const day = d.getDate()
    const month = d.getMonth()
    const year = d.getFullYear()

    const monthLong = monthMapRu[month]

    return `${day} ${monthLong} ${year} г.`
  },
  en: date => {
    const d = new Date(date)

    const day = d.getDate()
    const month = d.getMonth()
    const year = d.getFullYear()

    const monthLong = monthMapEn[month]

    return `${day} ${monthLong} ${year}`
  },
}

export const fullDate = (date, langKey) => {
  return formatters[langKey](date)
}
