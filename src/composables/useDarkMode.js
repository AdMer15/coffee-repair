import { ref } from 'vue'

const STORAGE_KEY = 'theme'

// Modul-weiter State: alle Komponenten, die useDarkMode() aufrufen, teilen sich
// denselben reaktiven Wert, statt jeweils eine eigene Kopie zu halten.
const isDark = ref(document.documentElement.classList.contains('dark'))

function applyTheme(dark) {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
}

function toggleDarkMode() {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
}

export function useDarkMode() {
    return { isDark, toggleDarkMode }
}
