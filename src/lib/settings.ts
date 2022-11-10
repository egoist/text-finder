interface SettingsData {
  langs: string
}

export const settings = {
  get(key: keyof SettingsData) {
    if (typeof localStorage === undefined) return null
    return localStorage.getItem(`settings:${key}`)
  },
  set<K extends keyof SettingsData>(key: K, value: SettingsData[K]) {
    if (typeof localStorage === "undefined") return
    localStorage.setItem(`settings:${key}`, value)
  },
}
