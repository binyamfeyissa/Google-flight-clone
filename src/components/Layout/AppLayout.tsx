"use client"

import type React from "react"
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Flight as FlightIcon,
  Hotel as HotelIcon,
  DirectionsCar as CarIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material"
import { useAppDispatch, useAppSelector } from "@/store"
import { setActiveTab, toggleSidebar } from "@/store/slices/uiSlice"
import ThemeModeToggle from "./ThemeModeToggle"

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const dispatch = useAppDispatch()
  const { activeTab, sidebarOpen } = useAppSelector((state) => state.ui)

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    dispatch(setActiveTab(newValue as "flights" | "hotels" | "cars"))
  }

  const handleDrawerToggle = () => {
    dispatch(toggleSidebar())
  }

  const navigationItems = [
    { id: "flights", label: "Flights", icon: <FlightIcon /> },
    { id: "hotels", label: "Hotels", icon: <HotelIcon /> },
    { id: "cars", label: "Cars", icon: <CarIcon /> },
  ]

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
        Google Flights Clone
        </Typography>
      </Toolbar>
      <List>
        {navigationItems.map((item) => (
          <ListItem
            key={item.id}
            onClick={() => {
              dispatch(setActiveTab(item.id as "flights" | "hotels" | "cars"))
              if (isMobile) dispatch(toggleSidebar())
            }}
            sx={{
              cursor: "pointer",
              backgroundColor: activeTab === item.id ? "primary.light" : "transparent",
              color: activeTab === item.id ? "primary.contrastText" : "text.primary",
              "&:hover": {
                backgroundColor: activeTab === item.id ? "primary.main" : "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "background.default" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: "background.paper",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
          Google Flights Clone
          </Typography>
          {!isMobile && (
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ ml: 4 }}>
              {navigationItems.map((item) => (
                <Tab
                  key={item.id}
                  value={item.id}
                  label={item.label}
                  icon={item.icon}
                  iconPosition="start"
                  sx={{ minHeight: 64, textTransform: "none", fontWeight: 600 }}
                />
              ))}
            </Tabs>
          )}
          <IconButton color="inherit" sx={{ ml: 2 }}>
            <SettingsIcon />
          </IconButton>
          <ThemeModeToggle />
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          minHeight: "100vh",
        }}
      >
        <Container sx={{ py: 3, maxWidth: "1248px!important" }}>
          {children}
        </Container>
      </Box>
    </Box>
  )
}

export default AppLayout
