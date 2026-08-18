<script setup>
    import { ref, computed } from 'vue'

    // Zustände für die Auswahl des Kunden
    const machineType = ref('vollautomat') // 'vollautomat' oder 'siebtraeger'
    const selectedService = ref('standard') // 'standard', 'grosstor', oder 'diagnose'

    // Preislogik je nach Auswahl
    const calculatedPrice = computed(() => {
    if (machineType.value === 'vollautomat') {
    if (selectedService.value === 'standard') return 89
    if (selectedService.value === 'grosstor') return 149
    if (selectedService.value === 'diagnose') return 35
    } else { // Siebträger
    if (selectedService.value === 'standard') return 119
    if (selectedService.value === 'grosstor') return 189
    if (selectedService.value === 'diagnose') return 45
    }
    return 0
    })
</script>

<template>
    <section class="p-6 bg-white rounded-xl shadow-md max-w-2xl mx-auto my-8 dark:bg-stone-900 dark:shadow-none dark:border dark:border-stone-800">
        <h2 class="text-2xl font-bold mb-4 text-stone-800 dark:text-stone-100">{{ $t('pricing.title') }}</h2>
        <p class="text-stone-600 dark:text-stone-400 mb-6">{{ $t('pricing.subtitle') }}</p>

        <!-- 1. Maschinentyp wählen -->
        <div class="mb-6">
            <label class="block font-semibold mb-2 text-stone-700 dark:text-stone-300">{{ $t('pricing.step1Label') }}</label>
            <div class="grid grid-cols-2 gap-4">
                <button @click="machineType = 'vollautomat'"
                        :class="machineType === 'vollautomat' ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200'"
                        class="p-3 rounded-lg font-medium transition">
                    {{ $t('pricing.machineVollautomat') }}
                </button>
                <button @click="machineType = 'siebtraeger'"
                        :class="machineType === 'siebtraeger' ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200'"
                        class="p-3 rounded-lg font-medium transition">
                    {{ $t('pricing.machineSiebtraeger') }}
                </button>
            </div>
        </div>

        <!-- 2. Leistung wählen -->
        <div class="mb-6">
            <label class="block font-semibold mb-2 text-stone-700 dark:text-stone-300">{{ $t('pricing.step2Label') }}</label>
            <div class="flex flex-col gap-3">
                <label class="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border cursor-pointer hover:bg-stone-100 dark:bg-stone-800 dark:border-stone-700 dark:hover:bg-stone-700">
                    <input type="radio" value="standard" v-model="selectedService" name="service">
                    <div>
                        <span class="font-semibold block">{{ $t('pricing.serviceStandardTitle') }}</span>
                        <span class="text-sm text-stone-500 dark:text-stone-400">{{ $t('pricing.serviceStandardDesc') }}</span>
                    </div>
                </label>

                <label class="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border cursor-pointer hover:bg-stone-100 dark:bg-stone-800 dark:border-stone-700 dark:hover:bg-stone-700">
                    <input type="radio" value="grosstor" v-model="selectedService" name="service">
                    <div>
                        <span class="font-semibold block">{{ $t('pricing.serviceGrosstorTitle') }}</span>
                        <span class="text-sm text-stone-500 dark:text-stone-400">{{ $t('pricing.serviceGrosstorDesc') }}</span>
                    </div>
                </label>

                <label class="flex items-center gap-3 p-3 bg-stone-50 rounded-lg border cursor-pointer hover:bg-stone-100 dark:bg-stone-800 dark:border-stone-700 dark:hover:bg-stone-700">
                    <input type="radio" value="diagnose" v-model="selectedService" name="service">
                    <div>
                        <span class="font-semibold block">{{ $t('pricing.serviceDiagnoseTitle') }}</span>
                        <span class="text-sm text-stone-500 dark:text-stone-400">{{ $t('pricing.serviceDiagnoseDesc') }}</span>
                    </div>
                </label>
            </div>
        </div>

        <!-- Preisausgabe -->
        <div class="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between dark:bg-amber-950/30 dark:border-amber-900">
            <div>
                <span class="text-sm text-amber-900 dark:text-amber-400 block">{{ $t('pricing.priceLabel') }}</span>
                <span class="text-3xl font-extrabold text-amber-800 dark:text-amber-400">{{ $t('pricing.pricePrefix') }} {{ calculatedPrice }} €</span>
            </div>
            <a href="#kontakt" class="bg-amber-700 hover:bg-amber-800 text-white px-5 py-2.5 rounded-lg font-medium transition">
                {{ $t('pricing.ctaButton') }}
            </a>
        </div>
    </section>
</template>