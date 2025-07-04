import type React from "react"
import { Box } from "@mui/material"
import CarSearchForm from "./CarSearchForm"
import CarResults from "./CarResults"

const CarPage: React.FC = () => {
  return (
    <Box>
      <CarSearchForm />
      <CarResults />
    </Box>
  )
}

export default CarPage
