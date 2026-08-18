<template>
    <div class="min-h-screen bg-stone-50 text-stone-800 font-sans antialiased flex flex-col justify-between">

        <!-- Navigation mit Router-Links -->
        <header class="flex justify-between items-center px-8 py-6 border-b border-stone-200 max-w-7xl mx-auto w-full">
            <!-- Hier machen wir den Text zu einem klickbaren Link -->
            <router-link to="/" class="text-xl font-bold tracking-tight text-amber-950 hover:opacity-80 transition">
                {{ $t('common.brand') }}
            </router-link>

            <div class="flex items-center gap-8">
                <nav class="space-x-8 text-sm font-medium">
                    <router-link to="/" class="hover:text-amber-800 transition">{{ $t('nav.home') }}</router-link>
                    <router-link to="/shop" class="hover:text-amber-800 transition">{{ $t('nav.shop') }}</router-link>
                    <router-link to="/preise" class="hover:text-amber-800 transition">{{ $t('nav.pricing') }}</router-link>
                </nav>

                <LanguageSwitcher />
            </div>
        </header>

        <!-- HIER lädt der Router dynamisch entweder die Startseite oder den Shop rein! -->
        <main class="flex-grow">
            <router-view />
        </main>

        <!-- Footer -->
        <footer class="bg-stone-900 text-stone-400 py-12 px-8 mt-20">
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                <div>
                    <div class="text-white font-bold text-base tracking-tight mb-3">{{ $t('common.brand') }}</div>
                    <p class="leading-relaxed text-stone-400">
                        {{ $t('footer.description') }}
                    </p>
                </div>
                <div>
                    <h4 class="text-white font-medium mb-3">{{ $t('footer.hoursTitle') }}</h4>
                    <p>{{ $t('footer.hoursWeekday') }}</p>
                    <p>{{ $t('footer.hoursSaturday') }}</p>
                </div>
                <div>
                    <h4 class="text-white font-medium mb-3">{{ $t('footer.contactTitle') }}</h4>
                    <p>{{ $t('footer.addressStreet') }}</p>
                    <p>{{ $t('footer.addressCity') }}</p>
                    <p class="mt-2 text-stone-300">{{ $t('footer.phone') }}</p>
                </div>
            </div>
            <div class="max-w-7xl mx-auto px-0 pt-8 mt-8 border-t border-stone-800 text-xs text-stone-500 flex flex-col md:flex-row justify-between items-center gap-4">
                <p>{{ $t('footer.copyright') }}</p>
                <nav class="space-x-4">
                    <router-link to="/impressum" class="hover:text-stone-200 transition">{{ $t('footer.impressum') }}</router-link>
                    <router-link to="/datenschutz" class="hover:text-stone-200 transition">{{ $t('footer.datenschutz') }}</router-link>
                </nav>
                <p>{{ $t('footer.credit') }}</p>
            </div>
        </footer>

    </div>
</template>

<script setup>
    import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
</script>