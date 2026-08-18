<template>
    <div class="relative inline-flex items-center bg-stone-100 rounded-full p-1 text-xs font-semibold select-none">
        <div class="absolute top-1 bottom-1 rounded-full bg-amber-900 transition-all duration-300 ease-out"
             :style="sliderStyle"></div>

        <button v-for="lang in languages"
                :key="lang.code"
                type="button"
                @click="locale = lang.code"
                class="relative z-10 w-9 py-1 rounded-full transition-colors duration-300 cursor-pointer"
                :class="locale === lang.code ? 'text-white' : 'text-stone-600 hover:text-stone-900'">
            {{ lang.label }}
        </button>
    </div>
</template>

<script setup>
    import { computed } from 'vue'
    import { useI18n } from 'vue-i18n'

    const { locale } = useI18n()

    const languages = [
        { code: 'de', label: 'DE' },
        { code: 'en', label: 'EN' },
        { code: 'bs', label: 'BS' }
    ]

    const buttonWidth = 2.25 // rem, entspricht w-9

    const sliderStyle = computed(() => {
        const index = languages.findIndex(lang => lang.code === locale.value)
        return {
            left: '0.25rem',
            width: `${buttonWidth}rem`,
            transform: `translateX(${index * buttonWidth}rem)`
        }
    })
</script>
