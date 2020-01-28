const monthMap = {
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

export const fullDate = date => {
  const d = new Date(date)

  const day = d.getDate()
  const month = d.getMonth()
  const year = d.getFullYear()

  const monthLong = monthMap[month]

  return `${day} ${monthLong} ${year} г.`
}
