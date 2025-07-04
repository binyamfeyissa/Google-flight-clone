"use client"

import type React from "react"
import { useMemo } from "react"
import { Card, CardContent, Typography, Box, Button, Skeleton } from "@mui/material"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts"
import { CalendarMonth as CalendarIcon } from "@mui/icons-material"
import * as dayjs from "dayjs"

interface PriceCalendarProps {
  selectedDate?: string
  onDateSelect?: (date: string) => void
  loading?: boolean
}

// Mock price calendar data
const generateMockPriceData = (baseDate: string) => {
  const data = []
  const base = dayjs(baseDate)

  for (let i = -7; i <= 7; i++) {
    const date = base.add(i, "day")
    const basePrice = 299
    const variation = Math.random() * 200 - 100 // Random variation ±$100
    const price = Math.max(150, Math.round(basePrice + variation))

    data.push({
      date: date.format("YYYY-MM-DD"),
      displayDate: date.format("MMM DD"),
      price,
      isSelected: i === 0,
      dayOfWeek: date.format("ddd"),
    })
  }

  return data
}

const PriceCalendar: React.FC<PriceCalendarProps> = ({
  selectedDate = dayjs().format("YYYY-MM-DD"),
  onDateSelect,
  loading = false,
}) => {
  const priceData = useMemo(() => generateMockPriceData(selectedDate), [selectedDate])

  const selectedPrice = priceData.find((d) => d.isSelected)?.price || 0
  const minPrice = Math.min(...priceData.map((d) => d.price))
  const maxPrice = Math.max(...priceData.map((d) => d.price))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <Box
          sx={{
            backgroundColor: "background.paper",
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {data.dayOfWeek}, {data.displayDate}
          </Typography>
          <Typography variant="h6" color="primary">
            ${data.price}
          </Typography>
        </Box>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <CalendarIcon color="primary" />
            <Typography variant="h6">Price Calendar</Typography>
          </Box>
          <Skeleton variant="rectangular" height={200} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CalendarIcon color="primary" />
            <Typography variant="h6">Price Calendar</Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Selected Date
            </Typography>
            <Typography variant="h6" color="primary">
              ${selectedPrice}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ height: 200, width: "100%", mb: 2 }}>
          <ResponsiveContainer>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                x={priceData.find((d) => d.isSelected)?.displayDate}
                stroke="#1976d2"
                strokeDasharray="2 2"
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#1976d2"
                strokeWidth={3}
                dot={{ fill: "#1976d2", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#1976d2", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Lowest price: <strong>${minPrice}</strong> • Highest: <strong>${maxPrice}</strong>
          </Typography>
          
        </Box>
      </CardContent>
    </Card>
  )
}

export default PriceCalendar
