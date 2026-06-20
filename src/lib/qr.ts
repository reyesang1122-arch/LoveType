/**
 * Generate a QR code as a PNG data URL pointing at `url`.
 * Returned inline (data URL) so html-to-image can capture it with no network.
 * High error-correction so the code still scans after IG re-compresses the story.
 */
export async function makeQrDataUrl(url: string): Promise<string> {
  try {
    const QR = (await import("qrcode")).default;
    return await QR.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 1,
      scale: 8,
      color: { dark: "#1b1633ff", light: "#ffffffff" },
    });
  } catch {
    return "";
  }
}
