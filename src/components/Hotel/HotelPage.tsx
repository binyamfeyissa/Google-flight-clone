import type React from "react"
import { Box } from "@mui/material"
import HotelSearchForm from "./HotelSearchForm"
import HotelResults from "./HotelResults"

const HotelPage: React.FC = () => {
  return (
    <Box>
      <HotelSearchForm />
      <HotelResults />
    </Box>
  )
}

export default HotelPage
