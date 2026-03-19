import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void;
}
function formatBytes(bytes: number, locale = "en-US") {
  // If the file size is zero, return "0 Bytes"
  if (bytes === 0) return "0 Bytes";

  const units = [
    "byte",
    "kilobyte",
    "megabyte",
    "gigabyte",
    "terabyte",
    "petabyte",
    "exabyte",
    "zettabyte",
    "yottabyte",
  ];
  const i = Math.floor(Math.log(bytes) / Math.log(1024)); // Determine the correct unit index

  // Calculate the value in the correct unit
  const value = bytes / Math.pow(1024, i);

  // Use Intl.NumberFormat for locale-specific formatting
  const formatter = new Intl.NumberFormat(locale, {
    style: "unit",
    unit: units[i],
    unitDisplay: "short", // or 'narrow', 'long'
    maximumFractionDigits: 2, // Adjust as needed
  });

  return formatter.format(value);
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0] || null;
      onFileSelect?.(file);

      // Do something with the files
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: { "application/pdf": [".pdf"] },
      maxSize: 20 * 1024 * 1024,
    });
  const file = acceptedFiles[0] || null;
  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="space-y-4 cursor-pointer">
          {file ? (
            <div
              className="uploader-selected-file"
              onClick={(e) => e.stopPropagation()}
            >
              <img src="/images/pdf.png" alt="" className="size-10" />

              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              <button
                className="p-2 cursor-pointer"
                onClick={(e) => onFileSelect?.(null)}
              >
                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="mx-auto w-16 h-16 flex justify-center items-center mb-2">
                <img src="/icons/info.svg" alt="" className="size-20" />
              </div>
              <p className="text-lg text-gray-500">
                <span className="font-semibold">Click to Upload</span> or Drag
                and Drop
              </p>
              <p className="text-lg text-gray-500">PDF (max 20 MB)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
