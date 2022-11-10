import { createWorker } from "tesseract.js"
import { settings } from "./settings"

const worker = createWorker()

export const DEFAULT_LANGS = ["eng", "chi_sim"]

export const extractText = async (image: File) => {
  const langs = settings.get("langs") || DEFAULT_LANGS.join("+")
  await worker.load()
  await worker.loadLanguage(langs)
  await worker.initialize(langs)
  const result = await worker.recognize(image)
  return result.data
}
