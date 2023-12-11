import html2canvas from "html2canvas";

export const toggleSort = (sortKey) => {
  setSortOrder((prevOrder) => {
    const newOrder = prevOrder === "desc" ? "asc" : "desc";
    // Sort the combinedKesmeCalculations array
    const sortedData = [...combinedKesmeCalculations].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (newOrder === "desc") {
        return aValue < bValue ? 1 : -1; // Assuming you want to sort by the first diameter
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
    setCombinedKesmeCalculations(sortedData);
    return newOrder;
  });
};

import "react-tabs/style/react-tabs.css";

export const printTable = (setIsPrinting) => {
  setIsPrinting(true);

  // Function to change background color
  const changeBackgroundColor = (color) => {
    document
      .querySelectorAll(
        "#kesmeTable tr, .bg-table-blue-first-line, .bg-table-blue-second-line, .bg-table-blue-third-line, .bg-table-green-first-line, .bg-table-green-second-line, .bg-table-green-third-line, .bg-red-500, .bg-red-200"
      )
      .forEach((el) => (el.style.backgroundColor = color));
  };

  // Remove background color before capturing
  changeBackgroundColor("transparent");

  setTimeout(() => {
    const table = document.getElementById("kesmeTable");
    html2canvas(table).then((canvas) => {
      // Revert background color after capturing
      changeBackgroundColor("");

      const newWindow = window.open("", "_blank");

      // Add a style tag for landscape orientation
      const style = newWindow.document.createElement("style");
      style.textContent = `
        @media print {
          @page { size: landscape; }
        }
      `;
      newWindow.document.head.appendChild(style);

      newWindow.document.body.appendChild(canvas);
      newWindow.document.title = "KESME BİLGİLERİ TABLOSU";
      newWindow.print();
      newWindow.close();

      setIsPrinting(false);
    });
  }, 100);
};
