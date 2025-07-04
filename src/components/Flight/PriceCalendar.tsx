"use client"

import React from "react"
import { Card, CardContent, Typography, Box, Skeleton } from "@mui/material"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { CalendarMonth as CalendarIcon } from "@mui/icons-material"

interface PriceCalendarProps {
  priceData: { date: string; price: number }[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: { date: string; price: number } }[];
}

const PriceCalendar: React.FC<PriceCalendarProps> = ({ priceData }) => {
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
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
            {data.date}
          </Typography>
          <Typography variant="h6" color="primary">
            ${data.price}
          </Typography>
        </Box>
      )
    }
    return null
  }

  if (priceData.length === 0) {
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

  const minPrice = Math.min(...priceData.map((d) => d.price));
  const maxPrice = Math.max(...priceData.map((d) => d.price));

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
              ${priceData[priceData.length - 1].price}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ height: 200, width: "100%", mb: 2 }}>
          <ResponsiveContainer>
            <LineChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
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
