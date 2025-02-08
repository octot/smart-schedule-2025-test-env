import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CreateScreen from "./components/CreateScreen";
import ViewScreen from "./components/ViewScreen";
import { SessionProvider } from "./components/contextAPI/sessionManagementContext";
import ScheduleTable from "./components/scheduleDetails/scheduleDetails";
// import ScheduleExcelReport from "./components/scheduleDetails/scheduleExcelReport";
function App() {
  return (
    // <ScheduleExcelReport />
    <ScheduleTable />
    // <SessionProvider>
    //   <BrowserRouter>
    //     <nav>
    //       <ul>
    //         <li>
    //           <Link to="/">View</Link>
    //         </li>
    //         <li>
    //           <Link to="/create">Create</Link>
    //         </li>
    //       </ul>
    //     </nav>
    //     <Routes>
    //       <Route path="/" element={<ViewScreen />} />
    //       <Route path="/create/:id" element={<CreateScreen />} /> {/* Edit mode */}
    //       <Route path="/create" element={<CreateScreen />} />
    //     </Routes>
    //   </BrowserRouter>
    // </SessionProvider>
  );
}

export default App;
