import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const DownloadExcel = ({ schedule }) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Schedule");

    // Define columns
    worksheet.columns = [
      { header: "_id", key: "_id", width: 30 },
      { header: "Tuition ID", key: "tuitionId", width: 15 },
      { header: "Trigger Date", key: "triggerDate", width: 25 },
      { header: "Session Date", key: "sessionDate", width: 15 },
      { header: "Tutor Name", key: "tutorName", width: 20 },
      { header: "Session Start Time", key: "sessionStartTime", width: 20 },
      { header: "Session End Time", key: "sessionEndTime", width: 20 },
      { header: "Record Selected", key: "recordSelected", width: 15 },
      { header: "Created At", key: "createdAt", width: 25 },
    ];

    // Add schedule Rows with Background Color
    schedule.forEach((item) => {
      const row = worksheet.addRow(item);
      const bgColor = item.recordSelected ? "00FF00" : "FF0000"; // Red for true, Green for false

      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: bgColor },
        };
      });
    });

    // Write and Save the Excel File
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Schedule.xlsx");
  };

  return (
    <button
      onClick={exportToExcel}
      style={{ padding: "10px", fontSize: "16px" }}
    >
      Download scheduleDetails
    </button>
  );
};

export default DownloadExcel;
