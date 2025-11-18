export async function captureScreenshot(): Promise<string | undefined> {
  try {
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(document.body, {
      useCORS: true,
      logging: false,
    });
    return canvas.toDataURL("image/jpeg", 0.8);
  } catch (e) {
    console.error("Screenshot failed:", e);
    return undefined;
  }
}
