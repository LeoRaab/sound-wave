import { useEffect, useState } from "react";

const useTouch = () => {
  const [isTouched, setIsTouched] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('touchstart', () => setIsTouched(true))
    window.addEventListener('touchend', () => setIsTouched(false));
    window.addEventListener('mousedown', () => setIsTouched(true));
    window.addEventListener('mouseup', () => setIsTouched(false));
  }, []);

  return { isTouched }
}

export default useTouch;