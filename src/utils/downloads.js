import { jsPDF } from "jspdf";
import { html2Canvas } from "@/utils/html2Canvas";
import "react-tabs/style/react-tabs.css";

export const downloadAsPng = async (divRef) => {
  const pngDataUrl = await generatePngDataUrl(divRef);
  if (pngDataUrl) {
    const downloadLink = document.createElement("a");
    downloadLink.href = pngDataUrl;
    downloadLink.download = "mesh.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
};

const generatePngDataUrl = async (divRef) => {
  const element = divRef.current;
  if (!element) {
    console.error("Div element is not found!");
    return null;
  }
  try {
    const canvas = await html2Canvas(element);
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Error generating PNG data URL:", error);
  }
};
export const downloadAsPdf = async (divRef) => {
  const pngDataUrl = await generatePngDataUrl(divRef);
  if (pngDataUrl) {
    // Define the page size and margins
    const pageWidth = 842; // A4 landscape width in pixels
    const pageHeight = 595; // A4 landscape height in pixels
    const margin = 20; // Margin around the image

    // Create a new PDF in landscape orientation
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [pageWidth, pageHeight],
    });

    // Load the image
    const img = new Image();
    img.src = pngDataUrl;
    img.onload = () => {
      // Calculate the aspect ratio
      const aspectRatio = img.width / img.height;

      // Calculate the dimensions to fit the image within the PDF page
      let pdfImageWidth = pageWidth - 2 * margin;
      let pdfImageHeight = pdfImageWidth / aspectRatio;

      // Check if the calculated height exceeds the page height
      if (pdfImageHeight > pageHeight - 2 * margin) {
        pdfImageHeight = pageHeight - 2 * margin;
        pdfImageWidth = pdfImageHeight * aspectRatio;
      }

      // Calculate position to center the image
      const xPosition = (pageWidth - pdfImageWidth) / 2;
      const yPosition = (pageHeight - pdfImageHeight) / 2;

      // Add the image to the PDF
      pdf.addImage(
        pngDataUrl,
        "PNG",
        xPosition,
        yPosition,
        pdfImageWidth,
        pdfImageHeight
      );
      pdf.save("mesh.pdf");
    };
  }
};
