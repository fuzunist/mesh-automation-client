

export const generatePdfFromSvg = async (svgElement) => {
  if (!svgElement) {
      console.error("SVG Element is not found!");
      return;
  }
  console.log("SVG Element found:", svgElement);

  // Make sure SVG has a namespace
  if (!svgElement.getAttribute("xmlns")) {
      svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }

  const svgData = new XMLSerializer().serializeToString(svgElement);
  console.log("Serialized SVG data:", svgData);

  // Create a jsPDF instance
  const pdf = new jsPDF({
      orientation: "l",
      unit: "px",
      format: [svgElement.clientWidth, svgElement.clientHeight],
  });

  try {
      // Add the SVG directly to the jsPDF instance
      await pdf.svg(svgElement, {
          x: 0,
          y: 0,
          width: svgElement.clientWidth,
          height: svgElement.clientHeight,
      });

      // Save the PDF
      pdf.save("mesh.pdf");
      console.log("PDF generated and saved.");
  } catch (error) {
      console.error("Error in adding SVG to PDF", error);
  }
};
