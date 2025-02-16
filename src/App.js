import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CreateScreen from "./components/CreateScreen";
import ViewScreen from "./components/ViewScreen";
import { SessionProvider } from "./components/contextAPI/sessionManagementContext";
import ScheduleTable from "./components/scheduleDetails/scheduleDetails";
import { Drawer, List, ListItem, ListItemText, CssBaseline, Box } from "@mui/material";

const drawerWidth = 180;

function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          {/* Sidebar */}
          <Drawer
            variant="permanent"
            sx={{
            
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
            }}
          >
            <List>
              <ListItem button component={Link} to="/">
                <ListItemText primary="View" />
              </ListItem>
              <ListItem button component={Link} to="/create">
                <ListItemText primary="Create" />
              </ListItem>
              <ListItem button component={Link} to="/viewScheduleDetails">
                <ListItemText primary="View automated Schedule Details" />
              </ListItem>
            </List>
          </Drawer>
          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1, p: 1, ml: `${drawerWidth}px`, width: `calc(100% - ${drawerWidth}px)` }}>
            <Routes>
              <Route path="/" element={<ViewScreen />} />
              <Route path="/create/:id" element={<CreateScreen />} />
              <Route path="/viewScheduleDetails" element={<ScheduleTable />} />
              <Route path="/create" element={<CreateScreen />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </SessionProvider>
  );
}

export default App;
