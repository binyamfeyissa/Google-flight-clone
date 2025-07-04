"use client"

import type React from "react"
import { useState } from "react"
import { IconButton, Menu, MenuItem, FormControlLabel, Checkbox, Typography, Divider, Box } from "@mui/material"
import { ViewColumn as ColumnIcon } from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "@/store"
import { setVisibleColumns } from "@/store/slices/uiSlice"

const availableColumns = [
  { id: "airline", label: "Airline" },
  { id: "departure", label: "Departure" },
  { id: "arrival", label: "Arrival" },
  { id: "duration", label: "Duration" },
  { id: "stops", label: "Stops" },
  { id: "price", label: "Price" },
  { id: "tags", label: "Tags" },
  { id: "actions", label: "Actions" },
]

const ColumnCustomization: React.FC = () => {
  const dispatch = useAppDispatch()
  const { visibleColumns } = useAppSelector((state) => state.ui)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleColumnToggle = (columnId: string) => {
    const newVisibleColumns = visibleColumns.includes(columnId)
      ? visibleColumns.filter((id) => id !== columnId)
      : [...visibleColumns, columnId]

    dispatch(setVisibleColumns(newVisibleColumns))
  }

  return (
    <>
      <IconButton onClick={handleClick} title="Customize Columns">
        <ColumnIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 200 },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Show/Hide Columns
          </Typography>
        </Box>
        <Divider />
        {availableColumns.map((column) => (
          <MenuItem key={column.id} onClick={() => handleColumnToggle(column.id)}>
            <FormControlLabel
              control={<Checkbox checked={visibleColumns.includes(column.id)} size="small" />}
              label={column.label}
              sx={{ width: "100%", m: 0 }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default ColumnCustomization
