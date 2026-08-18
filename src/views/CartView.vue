<template>
    <div class="max-w-4xl mx-auto px-8 py-16">
        <h1 class="text-3xl font-light mb-8">{{ $t('cart.title') }}</h1>

        <!-- Leerer Warenkorb -->
        <div v-if="cart.items.length === 0" class="text-center py-16 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl">
            <p class="text-stone-500 dark:text-stone-400 mb-6">{{ $t('cart.emptyMessage') }}</p>
            <router-link to="/shop" class="bg-stone-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 transition">
                {{ $t('cart.emptyCta') }}
            </router-link>
        </div>

        <!-- Artikel-Liste -->
        <div v-else class="space-y-4">
            <div v-for="item in cart.items"
                 :key="item.id"
                 class="flex items-center gap-4 border border-stone-200 dark:border-stone-800 dark:bg-stone-900 rounded-lg p-4">
                <img :src="item.image" :alt="$t(item.nameKey)" class="w-20 h-20 object-cover rounded-md bg-stone-100 dark:bg-stone-800 flex-shrink-0">

                <div class="flex-1 min-w-0">
                    <h2 class="font-medium truncate">{{ $t(item.nameKey) }}</h2>
                    <p class="text-stone-500 dark:text-stone-400 text-sm">{{ item.price.toFixed(2) }} €</p>
                </div>

                <!-- Mengensteuerung -->
                <div class="flex items-center gap-2">
                    <button @click="cart.decreaseQuantity(item.id)"
                            :aria-label="$t('cart.decreaseAriaLabel')"
                            class="w-8 h-8 flex items-center justify-center rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-sm font-medium transition cursor-pointer">
                        −
                    </button>
                    <span class="w-6 text-center text-sm font-medium">{{ item.quantity }}</span>
                    <button @click="cart.increaseQuantity(item.id)"
                            :aria-label="$t('cart.increaseAriaLabel')"
                            class="w-8 h-8 flex items-center justify-center rounded-md bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-sm font-medium transition cursor-pointer">
                        +
                    </button>
                </div>

                <!-- Zwischensumme der Zeile -->
                <div class="w-20 text-right text-sm font-medium hidden sm:block">
                    {{ (item.price * item.quantity).toFixed(2) }} €
                </div>

                <button @click="cart.removeFromCart(item.id)"
                        class="text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition cursor-pointer">
                    {{ $t('cart.removeButton') }}
                </button>
            </div>

            <!-- Gesamtsumme & Checkout -->
            <div class="mt-8 p-6 bg-stone-50 border border-stone-200 dark:bg-stone-900 dark:border-stone-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-lg font-semibold">
                    {{ $t('cart.totalLabel') }} <span class="text-amber-900 dark:text-amber-400">{{ cart.totalPrice.toFixed(2) }} €</span>
                </div>
                <div class="flex items-center gap-4">
                    <router-link to="/shop" class="text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition">
                        {{ $t('cart.continueShoppingCta') }}
                    </router-link>
                    <button @click="checkout"
                            class="bg-amber-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-amber-800 dark:bg-amber-700 dark:hover:bg-amber-600 transition cursor-pointer">
                        {{ $t('cart.checkoutButton') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { useToast } from 'vue-toastification'
    import { useI18n } from 'vue-i18n'
    import { useCartStore } from '@/stores/cart'

    const toast = useToast()
    const { t } = useI18n()
    const cart = useCartStore()

    // Simulierter Checkout: keine echte Zahlung, nur Erfolgsmeldung + Warenkorb leeren
    const checkout = () => {
        toast.success(t('cart.toastCheckoutSuccess'))
        cart.clearCart()
    }
</script>
