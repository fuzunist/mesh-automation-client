import { useEffect, useState } from "react";

const useWindowWidth = () => {
  const [widthSize, setWidthSize] = useState(undefined);

  useEffect(() => {
    const handleResize = () => setWidthSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return widthSize;
};

export default useWindowWidth;
