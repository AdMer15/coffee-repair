<template>
    <button type="button"
            @click="toggleDarkMode"
            :aria-label="isDark ? $t('common.switchToLight') : $t('common.switchToDark')"
            :title="isDark ? $t('common.switchToLight') : $t('common.switchToDark')"
            class="relative inline-flex items-center justify-center w-9 h-9 rounded-full text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white transition cursor-pointer">
        <!-- Sonne: sichtbar im Dark Mode (Klick schaltet zurück auf Hell) -->
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="w-5 h-5">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
        <!-- Mond: sichtbar im Hell-Modus (Klick schaltet auf Dunkel) -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
             class="w-5 h-5">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
    </button>
</template>

<script setup>
    import { useDarkMode } from '@/composables/useDarkMode'

    const { isDark, toggleDarkMode } = useDarkMode()
</script>
