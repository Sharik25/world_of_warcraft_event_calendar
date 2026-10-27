/**
 * Saves text as a file via a Blob + <a download>. For `.ics` on iOS Safari this opens the
 * Calendar import sheet; elsewhere it downloads the file.
 */
export function downloadText(
  fileName: string,
  content: string,
  type = 'text/calendar;charset=utf-8',
) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a moment to start the download before releasing the blob.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
