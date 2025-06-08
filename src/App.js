import React, { useState } from "react";
import "./App.css"
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CreateScreen from "./components/CreateScreen";
import ViewScreen from "./components/ViewScreen";
import { SessionProvider } from "./components/contextAPI/sessionManagementContext";
import ScheduleTable from "./components/scheduleDetails/scheduleDetails";
import {
  IconButton,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Box,
  ListItemIcon,
  Typography,
  Divider
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DashboardIcon from "@mui/icons-material/Dashboard";

function App() {
  const [open, setOpen] = useState(true);
  
  const drawerWidth = 280;
  const closedDrawerWidth = 70;

  return (
    <>
      <SessionProvider>
        <BrowserRouter>
          <Box sx={{ display: "flex", minHeight: "100vh" }}>
            <CssBaseline />
            
            {/* Enhanced Sidebar */}
            <Drawer
              variant="permanent"
              sx={{
                width: open ? drawerWidth : closedDrawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: open ? drawerWidth : closedDrawerWidth,
                  boxSizing: 'border-box',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  transition: 'all 0.3s ease',
                  boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
                  border: 'none',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(255,255,255,0.3)',
                    borderRadius: '10px',
                  },
                },
              }}
            >
              {/* Header */}
              <Toolbar 
                sx={{ 
                  minHeight: '80px !important',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {open && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      <DashboardIcon sx={{ fontSize: 32, mr: 1, color: '#fff' }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700,
                          background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        Dashboard
                      </Typography>
                    </Box>
                  )}
                  <IconButton 
                    onClick={() => setOpen(!open)}
                    sx={{ 
                      ml: 'auto',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.1)',
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {open ? <ChevronLeftIcon /> : <MenuIcon />}
                  </IconButton>
                </Box>
              </Toolbar>

              <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />

              {/* Navigation Items */}
              <List sx={{ px: 1, pt: 2 }}>
                <ListItem 
                  button 
                  component={Link} 
                  to="/"
                  sx={{
                    mb: 1,
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.15)',
                      transform: 'translateX(4px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                    '&:active': {
                      transform: 'translateX(2px)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: 'white', 
                    minWidth: open ? 40 : 'auto',
                    mr: open ? 0 : 'auto',
                  }}>
                    <VisibilityIcon />
                  </ListItemIcon>
                  {open && (
                    <ListItemText 
                      primary="View" 
                      sx={{ 
                        '& .MuiTypography-root': {
                          fontWeight: 500,
                          fontSize: '15px'
                        }
                      }} 
                    />
                  )}
                </ListItem>

                <ListItem 
                  button 
                  component={Link} 
                  to="/create"
                  sx={{
                    mb: 1,
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.15)',
                      transform: 'translateX(4px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                    '&:active': {
                      transform: 'translateX(2px)',
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: 'white',
                    minWidth: open ? 40 : 'auto',
                    mr: open ? 0 : 'auto',
                  }}>
                    <AddBoxIcon />
                  </ListItemIcon>
                  {open && (
                    <ListItemText 
                      primary="Create" 
                      sx={{ 
                        '& .MuiTypography-root': {
                          fontWeight: 500,
                          fontSize: '15px'
                        }
                      }} 
                    />
                  )}
                </ListItem>
              </List>
            </Drawer>

            {/* Enhanced Main Content */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                minHeight: '100vh',
                transition: 'margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)',
                  pointerEvents: 'none',
                },
              }}
            >
              <Box 
                sx={{ 
                  position: 'relative', 
                  zIndex: 1,
                  padding: '24px',
                  maxWidth: '1400px',
                  margin: '0 auto',
                }}
              >
                <Routes>
                  <Route path="/" element={<ViewScreen />} />
                  <Route path="/create/:id" element={<CreateScreen />} />
                  <Route path="/create" element={<CreateScreen />} />
                  {/* <Route path="/viewScheduleDetails" element={<ScheduleTable />} /> */}
                </Routes>
              </Box>
            </Box>
          </Box>
        </BrowserRouter>
      </SessionProvider>
      
      {/* Enhanced Toast Container */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastStyle={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
      />
    </>
  );
}

export default App;