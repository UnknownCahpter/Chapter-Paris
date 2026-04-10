import { useEffect, useRef } from 'react';

const ParisLogo = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const image = new Image();
    image.src = '/paris-header-art.png';

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      context.clearRect(0, 0, image.width, image.height);
      context.drawImage(image, 0, 0);

      const frame = context.getImageData(0, 0, image.width, image.height);
      const { data } = frame;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = (r + g + b) / 3;

        // Remove the pale square background/glow so the page background shows through.
        if (r > 198 && g > 188 && b > 174) {
          const whiteness = Math.max(0, Math.min(1, (avg - 198) / 57));
          const keepAlpha = Math.max(0, 1 - whiteness * 1.18);
          data[i + 3] = Math.round(data[i + 3] * keepAlpha * keepAlpha * keepAlpha);
        }
      }

      context.putImageData(frame, 0, 0);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="city-logo"
      aria-label="Paris header illustration"
      role="img"
    />
  );
};

export default ParisLogo;
