export const getYandexUrl = (search: string, page: number): string => {
  return `https://yandex.com/search/?text=${search}&p=${page}`
}
