import { NextRequest, NextResponse } from "next/server"
import { requireAuthAndRole } from "@/lib/api-helpers"
import { prisma } from "@/lib/prisma"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]
const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

// POST — upload / replace hospital logo
export async function POST(req: NextRequest) {
  const { error, hospitalId } = await requireAuthAndRole(["ADMIN"])
  if (error || !hospitalId) {
    return error || NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, GIF and SVG images are allowed" },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 2 MB limit" },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: `dental-erp/${hospitalId}`,
      public_id: "logo",
      overwrite: true,
    })

    const logoUrl = result.secure_url

    await prisma.hospital.update({
      where: { id: hospitalId },
      data: { logo: logoUrl },
    })

    return NextResponse.json({ success: true, logo: logoUrl })
  } catch (err: any) {
    console.error("Logo upload error:", err)
    return NextResponse.json(
      { error: err.message || "Failed to upload logo" },
      { status: 500 }
    )
  }
}

// DELETE — remove hospital logo
export async function DELETE() {
  const { error, hospitalId } = await requireAuthAndRole(["ADMIN"])
  if (error || !hospitalId) {
    return error || NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    // Delete from Cloudinary
    await cloudinary.uploader.destroy(`dental-erp/${hospitalId}/logo`)

    await prisma.hospital.update({
      where: { id: hospitalId },
      data: { logo: null },
    })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("Logo delete error:", err)
    return NextResponse.json(
      { error: err.message || "Failed to delete logo" },
      { status: 500 }
    )
  }
}
