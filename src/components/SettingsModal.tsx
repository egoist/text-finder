import { Dialog, Transition } from "@headlessui/react"
import { Fragment, useEffect } from "react"
import { useForm } from "react-hook-form"
import Select from "react-select"
import { DEFAULT_LANGS } from "../lib/extract-text"
import langs from "../lib/langs.json"
import { settings } from "../lib/settings"

export const SettingsModal = ({
  isOpen,
  closeModal,
}: {
  isOpen: boolean
  closeModal: () => void
}) => {
  const { setValue, watch, handleSubmit } = useForm<{ langs: string[] }>({
    defaultValues: {
      langs: [],
    },
  })
  const watchLangs = watch("langs")

  useEffect(() => {
    const langs = settings.get("langs")?.split("+")
    setValue("langs", langs && langs.length > 0 ? langs : DEFAULT_LANGS)
  }, [])

  const onSubmit = handleSubmit((values) => {
    settings.set("langs", values.langs.join("+"))
    closeModal()
  })

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-lg bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start pt-10 md:pt-20 justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-modal backdrop-blur-lg p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-zinc-100"
                >
                  Settings
                </Dialog.Title>
                <form onSubmit={onSubmit}>
                  <div className="mt-5">
                    <div>
                      <label htmlFor="ocr-langs" className="block mb-1 text-sm">
                        OCR languages
                      </label>
                      <Select
                        id="ocr-langs"
                        value={langs
                          .filter((lang) => {
                            return watchLangs.includes(lang[0])
                          })
                          .map((lang) => {
                            return {
                              label: lang[1],
                              value: lang[0],
                            }
                          })}
                        options={langs.map((lang) => {
                          return {
                            label: lang[1],
                            value: lang[0],
                          }
                        })}
                        onChange={(values) =>
                          setValue(
                            "langs",
                            values.map((value) => value.value)
                          )
                        }
                        isMulti
                        classNamePrefix="react-select"
                      />
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-xl border border-transparent bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 focus:outline-none focus:ring-2 ring-zinc-500"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
