import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

export const html2Canvas = (element) => {
  const scale = 2;
  return new Promise((resolve, reject) => {
    html2canvas(element, {
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
      logoImg.src = "mongerylogo.png"; // Make sure this path is correct
      logoImg.onload = () => {
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");

        const logoHeight = 100; // Height of the logo
        const logoWidth = logoHeight * 3; // Width of the logo (maintaining a 1:3 ratio)

        tempCanvas.width = logoWidth;
        tempCanvas.height = logoHeight;
        
        tempCtx.drawImage(logoImg, 0, 0, logoWidth, logoHeight);
        
        const ctx = canvas.getContext("2d");
        const pattern = ctx.createPattern(tempCanvas, "repeat");

        if (pattern) {
          ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset any previous transformation
          pattern.setTransform(ctx.getTransform()); // Align pattern with canvas
          ctx.globalAlpha = 0.05; // Set transparency for the watermark
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill with the watermark pattern
        }

        resolve(canvas); // Resolve the promise with the canvas
      };
      logoImg.onerror = reject; // Reject the promise if there's an error loading the image
    })
    .catch(reject); // Reject the promise if html2canvas fails
  });
};
