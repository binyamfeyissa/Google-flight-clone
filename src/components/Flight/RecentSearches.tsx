"use client"

import type React from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Button,
} from "@mui/material"
import {
  History as HistoryIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon,
  Flight as FlightIcon,
} from "@mui/icons-material"
import { useState } from "react"
import { loadRecentSearches, clearRecentSearches, type RecentSearch } from "@/utils/localStorage"
import { formatDate } from "@/utils/formatters"

interface RecentSearchesProps {
  onSearchSelect: (search: RecentSearch) => void
}

const RecentSearches: React.FC<RecentSearchesProps> = ({ onSearchSelect }) => {
  const [expanded, setExpanded] = useState(false)
  const [searches, setSearches] = useState<RecentSearch[]>(loadRecentSearches())

  const handleClearAll = () => {
    clearRecentSearches()
    setSearches([])
  }

  if (searches.length === 0) {
    return null
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ pb: expanded ? 2 : 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HistoryIcon color="action" fontSize="small" />
            <Typography variant="subtitle2" color="text.secondary">
              Recent Searches
            </Typography>
          </Box>
          <Box>
            {expanded && (
              <Button size="small" onClick={handleClearAll} startIcon={<ClearIcon />}>
                Clear All
              </Button>
            )}
            <IconButton size="small" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        <Collapse in={expanded}>
          <List dense sx={{ mt: 1 }}>
            {searches.map((search) => (
              <ListItem
                key={search.id}
                sx={{
                  cursor: "pointer",
                  borderRadius: 1,
                  "&:hover": { backgroundColor: "action.hover" },
                }}
                onClick={() => onSearchSelect(search)}
              >
                <FlightIcon fontSize="small" color="primary" sx={{ mr: 2 }} />
                <ListItemText
                  primary={`${search.origin} → ${search.destination}`}
                  secondary={
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 0.5 }}>
                      <Chip label={formatDate(search.date)} size="small" variant="outlined" />
                      {search.returnDate && (
                        <Chip label={`Return ${formatDate(search.returnDate)}`} size="small" variant="outlined" />
                      )}
                      <Chip
                        label={search.tripType}
                        size="small"
                        variant="outlined"
                        color={search.tripType === "round-trip" ? "primary" : "default"}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Collapse>

        {!expanded && (
          <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
            {searches.slice(0, 3).map((search) => (
              <Chip
                key={search.id}
                label={`${search.origin} → ${search.destination}`}
                size="small"
                variant="outlined"
                onClick={() => onSearchSelect(search)}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentSearches
