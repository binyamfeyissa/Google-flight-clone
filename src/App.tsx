"use client"

import type React from "react"
import { Provider } from "react-redux"
import { store } from "@/store"
import { theme } from "@/theme"
import AppLayout from "@/components/Layout/AppLayout"
import MobileAppLayout from "@/components/Layout/MobileAppLayout"
import FlightPage from "@/components/Flight/FlightPage"
import HotelPage from "@/components/Hotel/HotelPage"
import CarPage from "@/components/Car/CarPage"
import { useAppSelector } from "@/store"
import { useServiceWorker } from "@/hooks/useServiceWorker"
import { ThemeModeProvider } from "@/theme/ThemeModeProvider"
import { CssBaseline, useMediaQuery } from "@mui/material"

const AppContent: React.FC = () => {
  const { activeTab } = useAppSelector((state) => state.ui)
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker()

  const renderContent = () => {
    switch (activeTab) {
      case "flights":
        return <FlightPage />
      case "hotels":
        return <HotelPage />
      case "cars":
        return <CarPage />
      default:
        return <FlightPage />
    }
  }

  const Layout = isMobile ? MobileAppLayout : AppLayout

  return (
    <>
      <Layout>{renderContent()}</Layout>
      {isUpdateAvailable && (
        <div
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            background: "#1976d2",
            color: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            cursor: "pointer",
            zIndex: 9999,
          }}
          onClick={updateServiceWorker}
        >
          Update Available - Click to Refresh
        </div>
      )}
    </>
  )
}

function App() {
  return (
    <Provider store={store}>
      <ThemeModeProvider>
        <CssBaseline />
        <AppContent />
      </ThemeModeProvider>
    </Provider>
  )
}

export default App
