"use client"

import React, { useState } from "react"
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Popover,
  FormControlLabel,
  RadioGroup,
  Radio,
  Switch,
  Checkbox,
} from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"

const filterOptions = [
  { label: "Stops", options: ["Any number of stops", "Nonstop only", "1 stop or fewer", "2 stops or fewer"] },
  { label: "Airlines", options: ["Select all airlines", "Oneworld", "SkyTeam", "Star Alliance"] },
  { label: "Bags", options: ["Any", "1 bag", "2+ bags"] },
  { label: "Price", options: ["Any", "$0-$200", "$200-$500", "$500+"] },
  { label: "Times", options: ["Any", "Morning", "Afternoon", "Evening", "Night"] },
  { label: "Emissions", options: ["Any", "Low emissions only"] },
  { label: "Connecting airports", options: ["Any", "Direct only"] },
  { label: "Duration", options: ["Any", "< 4h", "4-8h", "> 8h"] },
]

const FlightFilters: React.FC = () => {
  const [anchorEls, setAnchorEls] = useState<(null | HTMLElement)[]>(Array(filterOptions.length).fill(null))
  const [allFiltersAnchor, setAllFiltersAnchor] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (index: number, event: React.MouseEvent<HTMLElement>) => {
    const newAnchors = [...anchorEls]
    newAnchors[index] = event.currentTarget
    setAnchorEls(newAnchors)
  }

  const handleMenuClose = (index: number) => {
    const newAnchors = [...anchorEls]
    newAnchors[index] = null
    setAnchorEls(newAnchors)
  }

  const handleAllFiltersOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAllFiltersAnchor(event.currentTarget)
  }

  const handleAllFiltersClose = () => {
    setAllFiltersAnchor(null)
  }

  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      py: 1,
      px: 2,
      bgcolor: "background.paper",
      borderRadius: 2,
      boxShadow: 1,
      mb: 2, // Add margin bottom to separate from table
      position: "relative",
      zIndex: 1, // Ensure it stays above the table
      width: "fit-content", // Prevent stretching across the page
      minWidth: 0,
      maxWidth: "100%"
    }}>
      <Button
        startIcon={<FilterListIcon />}
        sx={{ color: "#1967d2", fontWeight: 500, textTransform: "none" }}
        onClick={handleAllFiltersOpen}
      >
        All filters
      </Button>
      <Popover
        open={Boolean(allFiltersAnchor)}
        anchorEl={allFiltersAnchor}
        onClose={handleAllFiltersClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filters
          </Typography>
          {/* Example: Stops filter */}
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Stops
          </Typography>
          <RadioGroup defaultValue="Any number of stops">
            <FormControlLabel value="Any number of stops" control={<Radio />} label="Any number of stops" />
            <FormControlLabel value="Nonstop only" control={<Radio />} label="Nonstop only" />
            <FormControlLabel value="1 stop or fewer" control={<Radio />} label="1 stop or fewer" />
            <FormControlLabel value="2 stops or fewer" control={<Radio />} label="2 stops or fewer" />
          </RadioGroup>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Airlines
          </Typography>
          <FormControlLabel control={<Switch defaultChecked />} label="Select all airlines" />
          <Box sx={{ pl: 2 }}>
            <FormControlLabel control={<Checkbox />} label="Oneworld" />
            <FormControlLabel control={<Checkbox />} label="SkyTeam" />
            <FormControlLabel control={<Checkbox />} label="Star Alliance" />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Button fullWidth variant="outlined" color="primary" sx={{ mt: 1 }}>
            Clear all
          </Button>
        </Box>
      </Popover>
      {filterOptions.map((filter, idx) => (
        <React.Fragment key={filter.label}>
          <Button
            variant="outlined"
            sx={{ borderRadius: 3, textTransform: "none", fontWeight: 500, bgcolor: "#fff", color: "#444", borderColor: "#e0e0e0", minWidth: 90 }}
            onClick={(e) => handleMenuOpen(idx, e)}
          >
            {filter.label}
          </Button>
          <Menu
            anchorEl={anchorEls[idx]}
            open={Boolean(anchorEls[idx])}
            onClose={() => handleMenuClose(idx)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          >
            {filter.options.map((option) => (
              <MenuItem key={option}>{option}</MenuItem>
            ))}
          </Menu>
        </React.Fragment>
      ))}
    </Box>
  )
}

export default FlightFilters
