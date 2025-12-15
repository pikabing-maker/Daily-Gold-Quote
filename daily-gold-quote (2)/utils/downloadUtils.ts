export const downloadQuoteAsImage = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    // We use the globally loaded html2canvas
    if (typeof window.html2canvas !== 'function') {
      console.error('html2canvas library not loaded');
      return;
    }

    const canvas = await window.html2canvas(element, {
      scale: 2, // Higher resolution
      backgroundColor: '#0a0a0a', // Ensure background isn't transparent
      useCORS: true, // Attempt to load cross-origin images (like the texture)
      logging: false,
      scrollX: 0, // Prevent scroll offset issues
      scrollY: 0,
      width: 1080, // Force dimensions
      height: 1920,
      onclone: (documentClone, element) => {
         // Additional safety: ensure the cloned element is visible
         // (Though off-screen technique usually works without this)
         if (element) {
             element.style.opacity = '1';
         }
      }
    });

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = filename;
    link.click();
  } catch (err) {
    console.error('Error generating image:', err);
  }
};