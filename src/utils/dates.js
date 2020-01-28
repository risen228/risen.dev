const formatters = {
  fullDate: new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }),
}

export const fullDate = date => {
  return formatters.fullDate.format(new Date(date))
}
