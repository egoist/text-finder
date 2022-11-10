import Tippy from "@tippyjs/react"
import { NextSeo } from "next-seo"
import React, { useEffect, useRef, useState } from "react"
import { Page } from "tesseract.js"
import { Footer } from "../components/Footer"
import { TablerBrandGithub, TablerSettings } from "../components/icons"
import { SettingsModal } from "../components/SettingsModal"
import { extractText } from "../lib/extract-text"

export default function Home() {
  const [data, setData] = useState<Page | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle")
  const fileInputEl = useRef<HTMLInputElement | null>(null)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files
    if (files) {
      await processFiles([...files])
    }
  }

  const processFiles = async (files: File[]) => {
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl)
        }
        setImageUrl(URL.createObjectURL(file))

        setStatus("loading")
        try {
          const data = await extractText(file)
          console.log(data)
          setData(data)
          setStatus("success")
        } catch (error) {
          console.error(error)
          setStatus("error")
        }
        return
      }
    }
  }

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
    }
    const handleDrop = async (e: DragEvent) => {
      e.preventDefault()

      if (!e.dataTransfer) return
      await processFiles([...e.dataTransfer.files])
    }

    document.addEventListener("dragover", handleDragOver)
    document.addEventListener("drop", handleDrop)

    return () => {
      document.removeEventListener("dragover", handleDragOver)
      document.removeEventListener("drop", handleDrop)
    }
  }, [])

  return (
    <>
      <NextSeo
        title="Text Finder"
        description="OCR app that works offline"
        twitter={{ cardType: "summary", site: "egoistlol" }}
      />
      <div className="">
        <header className="fixed z-10 top-0 left-0 right-0 h-14 md:h-20 border-b text-center font-bold  backdrop-blur-lg bg-zinc-900/75">
          <div className="mx-auto flex justify-between h-full items-center px-5 md:px-10">
            <div className="text-xl md:text-2xl text-white">
              <h1 className="cursor-pointer" onClick={() => setImageUrl(null)}>
                Text Finder
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-zinc-500">
              <Tippy content="Settings">
                <button
                  type="button"
                  className="hover:text-white h-12 w-12 rounded-xl inline-flex items-center justify-center hover:bg-zinc-700"
                  onClick={() => setIsSettingsModalOpen(true)}
                >
                  <TablerSettings className="h-7 w-7" />
                </button>
              </Tippy>
              <Tippy content="Star me on GitHub">
                <a
                  type="button"
                  className="hover:text-white h-12 w-12 rounded-xl inline-flex items-center justify-center hover:bg-zinc-700"
                  href="https://github.com/egoist/text-finder"
                  target="_blank"
                  rel="nofollow noopener"
                >
                  <TablerBrandGithub className="h-7 w-7" />
                </a>
              </Tippy>
            </div>
          </div>
        </header>
        <div className="mt-14 md:mt-20 py-5 md:py-10 px-5 md:px-10">
          {!imageUrl && (
            <label className="block py-20 max-w-screen-md mx-auto text-center text-4xl cursor-pointer hover:bg-zinc-800/50 rounded-xl">
              <input
                ref={fileInputEl}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileInputChange}
              />
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 256 256"
                className="mx-auto w-20 h-20"
              >
                <path
                  fill="currentColor"
                  d="M216 42H40a14 14 0 0 0-14 14v144a14 14 0 0 0 14 14h176a14 14 0 0 0 14-14V56a14 14 0 0 0-14-14ZM40 54h176a2 2 0 0 1 2 2v113.5l-32.1-32.1a14.1 14.1 0 0 0-19.8 0l-20.7 20.7a1.9 1.9 0 0 1-2.8 0l-44.7-44.7a14.1 14.1 0 0 0-19.8 0L38 153.5V56a2 2 0 0 1 2-2Zm176 148H40a2 2 0 0 1-2-2v-29.5l48.6-48.6a1.9 1.9 0 0 1 2.8 0l44.7 44.7a14.1 14.1 0 0 0 19.8 0l20.7-20.7a1.9 1.9 0 0 1 2.8 0l40.6 40.6V200a2 2 0 0 1-2 2Zm-67.1-94.9a9.9 9.9 0 0 1-2.9-7.1a10 10 0 0 1 20 0a10 10 0 0 1-10 10a9.9 9.9 0 0 1-7.1-2.9Z"
                ></path>
              </svg>
              <div className="mt-5">
                Image-to-text (OCR) app that works offline
              </div>
              <div className="mt-5">Drop an image anywhere</div>
            </label>
          )}
          {imageUrl && (
            <div className="flex flex-col space-y-10 md:flex-row md:space-y-0 md:space-x-10">
              <div className="text-right md:w-1/2">
                <img src={imageUrl} className="inline-block" />
              </div>
              <div className="md:w-1/2">
                {status === "loading" ? (
                  <div>Processing...</div>
                ) : status === "success" && data ? (
                  <pre className="whitespace-pre-wrap overflow-auto">
                    {data.text}
                  </pre>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        closeModal={() => setIsSettingsModalOpen(false)}
      />
    </>
  )
}
