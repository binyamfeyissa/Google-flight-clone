import * as dayjs from "dayjs"

export const formatTime = (dateString: string): string => {
  return dayjs(dateString).format("HH:mm")
}

export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format("MMM DD")
}

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export const formatPrice = (amount: number, currency = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}
