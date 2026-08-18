<template>
    <div>
        <!-- Hero Section -->
        <section class="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
                <h1 class="text-4xl md:text-5xl font-light tracking-tight leading-tight mb-6">
                    {{ $t('home.hero.title1') }} <br><span class="font-semibold text-amber-900">{{ $t('home.hero.title2') }}</span>
                </h1>
                <p class="text-stone-600 mb-8 leading-relaxed">
                    {{ $t('home.hero.subtitle') }}
                </p>
                <div class="space-x-4">
                    <router-link to="/shop" class="bg-stone-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-stone-800 transition">{{ $t('home.hero.ctaShop') }}</router-link>
                    <a href="#reparatur" class="border border-stone-300 px-6 py-3 rounded-md text-sm font-medium hover:border-stone-800 transition">{{ $t('home.hero.ctaRepair') }}</a>
                </div>
            </div>
            <div class="bg-stone-200 h-96 rounded-lg flex items-center justify-center text-stone-500 font-medium shadow-inner">
                <img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80"
                     :alt="$t('home.hero.imageAlt')"
                     class="w-full h-96 object-cover rounded-lg shadow-inner">
            </div>
        </section>

        <!-- Reparatur Status Checker Modul -->
        <section id="status" class="bg-stone-100 py-16 border-y border-stone-200">
            <div class="max-w-xl mx-auto px-6 text-center">
                <h2 class="text-2xl font-medium mb-3">{{ $t('home.status.title') }}</h2>
                <p class="text-stone-600 text-sm mb-6">{{ $t('home.status.descriptionPrefix') }} <span class="font-mono bg-stone-200 px-1 py-0.5 rounded text-amber-900">REP-8492</span>{{ $t('home.status.descriptionSuffix') }}</p>

                <div class="flex gap-2">
                    <input v-model="searchQuery"
                           type="text"
                           :placeholder="$t('home.status.inputPlaceholder')"
                           class="flex-1 px-4 py-3 border border-stone-300 rounded-md text-sm focus:outline-none focus:border-stone-800 bg-white uppercase font-mono"
                           @keyup.enter="checkStatus">
                    <button @click="checkStatus"
                            class="bg-amber-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-amber-800 transition cursor-pointer">
                        {{ $t('home.status.searchButton') }}
                    </button>
                </div>

                <!-- Ergebnis-Box -->
                <div v-if="searchResult" class="mt-6 p-5 bg-white border border-stone-300 rounded-lg text-left shadow-sm">
                    <div class="flex justify-between items-center mb-2">
                        <span class="font-mono font-bold text-stone-900">{{ searchResult.id }}</span>
                        <span class="text-xs px-2.5 py-1 rounded-full font-medium" :class="statusBadgeClass">
                            {{ searchResult.status }}
                        </span>
                    </div>
                    <p class="text-sm text-stone-700"><strong>{{ $t('home.status.modelLabel') }}</strong> {{ searchResult.model }}</p>
                    <p class="text-sm text-stone-700 mt-1"><strong>{{ $t('home.status.infoLabel') }}</strong> {{ searchResult.info }}</p>
                    <p class="text-xs text-stone-400 mt-3">{{ $t('home.status.updatedLabel') }} {{ searchResult.updated }}</p>
                </div>
            </div>
        </section>

        <!-- Reparatur-Anfrage Formular -->
        <section id="reparatur" class="max-w-3xl mx-auto px-8 py-16">
            <div class="bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
                <h2 class="text-2xl font-light tracking-tight mb-2">{{ $t('home.form.title') }}</h2>
                <p class="text-stone-600 text-sm mb-6">{{ $t('home.form.description') }}</p>

                <form @submit.prevent="submitRepairRequest" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-stone-700 uppercase mb-1">{{ $t('home.form.nameLabel') }}</label>
                            <input v-model="form.name" type="text" required :placeholder="$t('home.form.namePlaceholder')" class="w-full px-4 py-2.5 border border-stone-300 rounded-md text-sm focus:outline-none focus:border-stone-800">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-stone-700 uppercase mb-1">{{ $t('home.form.emailLabel') }}</label>
                            <input v-model="form.email" type="email" required :placeholder="$t('home.form.emailPlaceholder')" class="w-full px-4 py-2.5 border border-stone-300 rounded-md text-sm focus:outline-none focus:border-stone-800">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-stone-700 uppercase mb-1">{{ $t('home.form.modelLabel') }}</label>
                            <input v-model="form.model" type="text" required :placeholder="$t('home.form.modelPlaceholder')" class="w-full px-4 py-2.5 border border-stone-300 rounded-md text-sm focus:outline-none focus:border-stone-800">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-stone-700 uppercase mb-1">{{ $t('home.form.typeLabel') }}</label>
                            <select v-model="form.type" class="w-full px-4 py-2.5 border border-stone-300 rounded-md text-sm bg-white focus:outline-none focus:border-stone-800">
                                <option value="Vollautomat">{{ $t('home.form.typeVollautomat') }}</option>
                                <option value="Siebträger">{{ $t('home.form.typeSiebtraeger') }}</option>
                                <option value="Filtermaschine">{{ $t('home.form.typeFilter') }}</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-medium text-stone-700 uppercase mb-1">{{ $t('home.form.issueLabel') }}</label>
                        <textarea v-model="form.issue" rows="3" required :placeholder="$t('home.form.issuePlaceholder')" class="w-full px-4 py-2.5 border border-stone-300 rounded-md text-sm focus:outline-none focus:border-stone-800"></textarea>
                    </div>

                    <!-- Honeypot-Feld gegen Spam-Bots: für echte Nutzer und Screenreader unsichtbar/unerreichbar,
                         Bots füllen es oft trotzdem aus, da sie das DOM statt der Darstellung auslesen -->
                    <div class="honeypot-field" aria-hidden="true">
                        <label for="website">Website</label>
                        <input v-model="form.website"
                               type="text"
                               id="website"
                               name="website"
                               tabindex="-1"
                               autocomplete="off">
                    </div>

                    <button type="submit" class="w-full bg-stone-900 text-white py-3 rounded-md text-sm font-medium hover:bg-stone-800 transition cursor-pointer">
                        {{ $t('home.form.submitButton') }}
                    </button>
                </form>

                <div v-if="formSubmitted" class="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
                    {{ $t('home.form.successPrefix') }} <strong class="font-mono">{{ generatedOrderNumber }}</strong>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import { useToast } from 'vue-toastification'
    import { useI18n } from 'vue-i18n'
    import { supabase } from '@/supabase'

    const toast = useToast()
    const { t } = useI18n()

    // Status-Checker Logik
    const searchQuery = ref('')
    const searched = ref(false)
    const foundOrder = ref(null)

    const checkStatus = async () => {
    searched.value = true
    const query = searchQuery.value.trim().toUpperCase()

    if (!query) return

    // Live-Abfrage an Supabase
    const { data, error } = await supabase
   .rpc('get_repair_status', { p_auftragsnummer: query })
   .single()

    if (error || !data) {
    foundOrder.value = null
    } else {
    foundOrder.value = {
    id: data.auftragsnummer,
    model: data.model,
    status: data.status,
    info: data.info,
    updated: new Date(data.created_at).toLocaleDateString('de-DE', { hour: '2-digit', minute: '2-digit' })
    }
    }
    }

    const searchResult = computed(() => foundOrder.value)

    const statusBadgeClass = computed(() => {
    if (!foundOrder.value) return ''
    switch (foundOrder.value.status) {
    case 'Fertig zur Abholung': return 'bg-emerald-100 text-emerald-800'
    case 'In Reparatur': return 'bg-amber-100 text-amber-800'
    default: return 'bg-blue-100 text-blue-800'
    }
    })

    // Formular & Supabase Insert Logik
    const formSubmitted = ref(false)
    const generatedOrderNumber = ref('')

    const form = ref({
    name: '',
    email: '',
    model: '',
    type: 'Vollautomat',
    issue: '',
    website: '' // Honeypot: bleibt bei echten Nutzern immer leer
    })

    const generateOrderNumber = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    return `REP-${randomNum}`
    }

    const submitRepairRequest = async () => {
    try {
    const auftragsnummer = generateOrderNumber()

    // Honeypot-Check: Ist das unsichtbare Feld ausgefüllt, war es ein Bot.
    // Wir tun nach außen hin so, als wäre alles normal gelaufen, überspringen aber den echten Insert.
    if (form.value.website.trim() !== '') {
    generatedOrderNumber.value = auftragsnummer
    formSubmitted.value = true
    toast.success(t('home.form.toastSuccess', { orderNumber: auftragsnummer }))
    form.value = { name: '', email: '', model: '', type: 'Vollautomat', issue: '', website: '' }
    return
    }

    // Datensatz in Supabase einfügen
    const { error } = await supabase
    .from('repairs')
    .insert([
    {
    auftragsnummer: auftragsnummer,
    name: form.value.name,
    email: form.value.email,
    model: form.value.model,
    type: form.value.type,
    issue: form.value.issue,
    status: 'In Diagnose',
    info: 'Deine Maschine wurde angemeldet und wartet auf Überprüfung.'
    }
    ])

    if (error) throw error

    generatedOrderNumber.value = auftragsnummer
    formSubmitted.value = true
    toast.success(t('home.form.toastSuccess', { orderNumber: auftragsnummer }))

    // Formular leeren
    form.value = { name: '', email: '', model: '', type: 'Vollautomat', issue: '', website: '' }

   } catch (error) {
      console.error('Detaillierter Supabase-Fehler:', error)
      console.error('Fehler-Nachricht:', error.message)
      console.error('Fehler-Details:', error.details)
      console.error('Fehler-Hinweis:', error.hint)
      toast.error(t('home.form.toastError', { message: error.message }))
    }
    }
</script>

<style scoped>
    .honeypot-field {
        position: absolute;
        left: -9999px;
        top: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    }
</style>