<template>
    <div class="min-h-screen bg-stone-50 text-stone-800 dark:bg-stone-950 dark:text-stone-200 font-sans antialiased flex flex-col justify-between transition-colors">

        <!-- Navigation mit Router-Links -->
        <header class="flex justify-between items-center px-8 py-6 border-b border-stone-200 dark:border-stone-800 max-w-7xl mx-auto w-full">
            <!-- Hier machen wir den Text zu einem klickbaren Link -->
            <router-link to="/" class="text-xl font-bold tracking-tight text-amber-950 dark:text-amber-400 hover:opacity-80 transition">
                {{ $t('common.brand') }}
            </router-link>

            <div class="flex items-center gap-6">
                <nav class="space-x-8 text-sm font-medium">
                    <router-link to="/" class="hover:text-amber-800 dark:hover:text-amber-400 transition">{{ $t('nav.home') }}</router-link>
                    <router-link to="/shop" class="hover:text-amber-800 dark:hover:text-amber-400 transition">{{ $t('nav.shop') }}</router-link>
                    <router-link to="/preise" class="hover:text-amber-800 dark:hover:text-amber-400 transition">{{ $t('nav.pricing') }}</router-link>
                </nav>

                <div class="flex items-center gap-2">
                    <LanguageSwitcher />
                    <DarkModeToggle />
                    <router-link to="/warenkorb"
                                 :aria-label="$t('common.cartAriaLabel', { count: cart.itemCount })"
                                 class="relative inline-flex items-center justify-center w-9 h-9 rounded-full text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white transition">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             class="w-5 h-5">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <span v-if="cart.itemCount > 0"
                              class="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] px-1 flex items-center justify-center rounded-full bg-amber-900 dark:bg-amber-600 text-white text-[0.65rem] font-semibold leading-none">
                            {{ cart.itemCount }}
                        </span>
                    </router-link>
                </div>
            </div>
        </header>

        <!-- HIER lädt der Router dynamisch entweder die Startseite oder den Shop rein! -->
        <main class="flex-grow">
            <router-view />
        </main>

        <!-- Footer -->
        <footer class="bg-stone-900 text-stone-400 dark:bg-black py-12 px-8 mt-20">
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
            <div class="max-w-7xl mx-auto px-0 pt-8 mt-8 border-t border-stone-800 dark:border-stone-800 text-xs text-stone-500 flex flex-col md:flex-row justify-between items-center gap-4">
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
    import DarkModeToggle from '@/components/DarkModeToggle.vue'
    import { useCartStore } from '@/stores/cart'

    const cart = useCartStore()
</script>