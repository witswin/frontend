"use client"

import { useController } from "react-hook-form"
import { Button } from "@nextui-org/react"
import { FC, useEffect, useMemo, useRef, useState } from "react"
import { InputBaseType } from "./types"
import { FaTimes, FaUpload } from "react-icons/fa"
import { Cropper, ReactCropperElement } from "react-cropper"
import "cropperjs/dist/cropper.css"

const MediaInput: FC<InputBaseType> = ({
  control,
  name,
  label,
  className,
  rules,
}) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cropperRef = useRef<ReactCropperElement>(null)

  const validations = useMemo(() => {
    const obj: Record<string, any> = {}

    rules?.forEach((rule) => {
      obj[rule.type] = {
        message: rule.message,
        value: rule.value,
      }
    })

    return obj
  }, [rules])

  const { field, fieldState } = useController({
    name,
    control,
    rules: validations,
  })

  const handleFile = (file: File) => {
    field.onChange(file)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  useEffect(() => {
    const file = field.value

    if (preview) return

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }, [field.value, preview])

  return (
    <>
      <p className="text-sm mb-2">
        {label} {validations.required ? "*" : ""}
      </p>
      <div
        className={`border-2 border-dashed rounded-lg p-6 bg-gray30 transition-colors ${
          isDragging ? "border-primary bg-primary/10" : "border-divider"
        } ${fieldState.invalid ? "border-error" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          ref={fileInputRef}
          aria-describedby="file-description"
        />
        {preview ? (
          <div className="relative rounded-lg overflow-hidden">
            <Cropper
              ref={cropperRef}
              src={preview}
              crop={() => {
                if (cropperRef.current) {
                  cropperRef.current.cropper
                    .getCroppedCanvas()
                    .toBlob((blob) => {
                      field.onChange(blob)
                    }, "image/png")
                }
              }}
            />

            <Button
              isIconOnly
              className="absolute top-2 right-2 rounded-full"
              onClick={handleRemove}
            >
              <FaTimes />
            </Button>
          </div>
        ) : (
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <FaUpload className="w-12 h-12 text-gray-400 mb-4" />
            <span className="text-sm font-medium text-gray-600">
              Drag & drop an image here, or click to select
            </span>
            <span id="file-description" className="text-xs text-gray-500 mt-2">
              Supports: JPG, PNG, GIF (max 5MB)
            </span>
          </label>
        )}
        {<p className="text-xs text-error mt-2">{fieldState.error?.message}</p>}
      </div>
    </>
  )
}

export default MediaInput
