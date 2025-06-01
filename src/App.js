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
  ListItemIcon
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuIcon from "@mui/icons-material/Menu";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
function App() {
  const [open, setOpen] = useState(true);
  return (<>     <SessionProvider>
    <BrowserRouter>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          className={`sidebar ${open ? "sidebar-open" : "sidebar-closed"}`}
        >
          <List>
            <Toolbar>
              <IconButton onClick={() => setOpen(!open)}>
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
            </Toolbar>
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <VisibilityIcon />
              </ListItemIcon>
              {open && <ListItemText primary="View" />}
            </ListItem>
            <ListItem button component={Link} to="/create">
              <ListItemIcon>
                <AddBoxIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Create" />}
            </ListItem>
            {/* 
          <ListItem button component={Link} to="/viewScheduleDetails">
            <ListItemText primary="View automated Schedule Details" />
          </ListItem>
          */}
          </List>
        </Drawer>
        {/* Main Content */}
        <Box
          component="main"
          className={`main-content ${open ? "main-open" : "main-closed"}`}
        >
          <Routes>
            <Route path="/" element={<ViewScreen />} />
            <Route path="/create/:id" element={<CreateScreen />} />
            {/* <Route path="/viewScheduleDetails" element={<ScheduleTable />} /> */}
            <Route path="/create" element={<CreateScreen />} />
          </Routes>
        </Box>
      </Box>
    </BrowserRouter>
  </SessionProvider>
    <ToastContainer /></>

  );
}

export default App;
