import { saveAs } from "file-saver";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const html2Canvas = async (element) => {
  const scale = 2;
  return await html2canvas(element, {
    scale: scale,
    backgroundColor: null,
    logging: true,
    useCORS: true,
    width: element.offsetWidth,
    height: element.offsetHeight,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
    windowWidth: document.documentElement.offsetWidth,
    windowHeight: document.documentElement.offsetHeight,
  })
    .then((canvas) => {
      const logoImg = new Image();
      logoImg.src = "mongerylogo.png";
      logoImg.onload = () => {
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");

        // Desired height of the logo, maintaining 1:3 ratio
        const logoHeight = 100; // You can adjust this value
        const logoWidth = logoHeight * 3; // Maintaining the 1:3 ratio

        tempCanvas.width = logoWidth;
        tempCanvas.height = logoHeight;

        // Draw the smaller logo on the temporary canvas
        tempCtx.drawImage(logoImg, 0, 0, logoWidth, logoHeight);

        // Create the pattern from the temporary canvas
        const ctx = canvas.getContext("2d");
        const pattern = ctx.createPattern(tempCanvas, "repeat");

        if (pattern) {
          ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any previous transformation
          pattern.setTransform(ctx.getTransform()); // Align pattern with canvas
        }

        ctx.globalAlpha = 0.05; // Set transparency for the watermark
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill with the watermark pattern

        canvas.toBlob((blob) => {
          saveAs(blob, "mesh.png");
          console.log("Download triggered");
        });
      };
      logoImg.onerror = () => {
        console.error("Error loading watermark image");
      };
    })
    .catch((err) => {
      console.error("Error in capturing the div as PNG", err);
    });
};
