export async function compressImage(
  file: File,
  { maxDimension = 1600, quality = 0.82, maxBytes = 4.5 * 1024 * 1024 } = {}
): Promise<File> {
  const bitmap = await createImageBitmap(file)
  let dimension = maxDimension
  let q = quality

  for (let attempt = 0; attempt < 4; attempt++) {
    const scale = Math.min(1, dimension / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Canvas 2D context is not available")
    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", q))
    if (blob && blob.size <= maxBytes) {
      return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" })
    }

    dimension = Math.round(dimension * 0.75)
    q = Math.max(0.5, q - 0.15)
  }

  throw new Error("Could not compress this image enough to upload")
}
