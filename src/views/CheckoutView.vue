<template>
    <div class="max-w-5xl mx-auto px-8 py-16">
        <h1 class="text-3xl font-light mb-8">{{ $t('checkout.title') }}</h1>

        <!-- Fehlende Konfiguration (Publishable Key) -->
        <div v-if="configError" class="p-6 bg-red-50 border border-red-200 dark:bg-red-950/40 dark:border-red-900 rounded-xl text-red-700 dark:text-red-300">
            {{ configError }}
        </div>

        <!-- Erfolg / Verarbeitung nach Redirect-Zahlungsmethoden -->
        <div v-else-if="succeeded" class="text-center py-16 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl">
            <h2 class="text-2xl font-medium mb-3">
                {{ isProcessing ? $t('checkout.processingTitle') : $t('checkout.successTitle') }}
            </h2>
            <p class="text-stone-500 dark:text-stone-400 mb-6">
                {{ isProcessing ? $t('checkout.processingMessage') : $t('checkout.successMessage') }}
            </p>
            <router-link to="/shop" class="bg-stone-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 transition">
                {{ $t('checkout.backToShop') }}
            </router-link>
        </div>

        <!-- Leerer Warenkorb (kurzer Moment vor dem Redirect, oder direkter Aufruf ohne Artikel) -->
        <div v-else-if="cart.items.length === 0" class="text-center py-16 border border-dashed border-stone-300 dark:border-stone-700 rounded-xl">
            <p class="text-stone-500 dark:text-stone-400 mb-6">{{ $t('checkout.emptyCartMessage') }}</p>
            <router-link to="/shop" class="bg-stone-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 transition">
                {{ $t('checkout.backToShop') }}
            </router-link>
        </div>

        <!-- Checkout-Formular -->
        <div v-else class="grid grid-cols-1 md:grid-cols-5 gap-8">
            <!-- Bestellübersicht -->
            <div class="md:col-span-2 order-2 md:order-1">
                <div class="p-6 bg-stone-50 border border-stone-200 dark:bg-stone-900 dark:border-stone-800 rounded-xl">
                    <h2 class="font-medium mb-4">{{ $t('checkout.orderSummaryTitle') }}</h2>
                    <ul class="space-y-3 mb-4">
                        <li v-for="item in cart.items" :key="item.id" class="flex justify-between text-sm gap-4">
                            <span class="text-stone-600 dark:text-stone-300 truncate">
                                {{ item.quantity }}× {{ $t(item.nameKey) }}
                            </span>
                            <span class="font-medium whitespace-nowrap">{{ (item.price * item.quantity).toFixed(2) }} €</span>
                        </li>
                    </ul>
                    <div class="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center font-semibold">
                        <span>{{ $t('checkout.totalLabel') }}</span>
                        <span class="text-amber-900 dark:text-amber-400">{{ cart.totalPrice.toFixed(2) }} €</span>
                    </div>
                </div>
                <router-link to="/warenkorb" class="inline-block mt-4 text-sm font-medium text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white transition">
                    {{ $t('checkout.backToCart') }}
                </router-link>
            </div>

            <!-- Zahlungsformular -->
            <div class="md:col-span-3 order-1 md:order-2">
                <form @submit.prevent="handleSubmit" class="p-6 border border-stone-200 dark:border-stone-800 dark:bg-stone-900 rounded-xl">
                    <label class="block text-sm font-medium mb-2" for="checkout-email">
                        {{ $t('checkout.emailLabel') }}
                    </label>
                    <input id="checkout-email"
                           v-model="email"
                           type="email"
                           required
                           :placeholder="$t('checkout.emailPlaceholder')"
                           class="w-full mb-6 px-3 py-2 rounded-md border border-stone-300 dark:border-stone-700 dark:bg-stone-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-700">

                    <div v-if="loading" class="text-sm text-stone-500 dark:text-stone-400 py-8 text-center">
                        {{ $t('checkout.loadingPayment') }}
                    </div>

                    <div v-show="!loading" ref="paymentElementTarget"></div>

                    <p v-if="errorMessage" class="mt-4 text-sm text-red-600 dark:text-red-400">
                        {{ errorMessage }}
                    </p>

                    <button type="submit"
                            :disabled="!elementReady || processing"
                            class="w-full mt-6 bg-amber-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-amber-800 dark:bg-amber-700 dark:hover:bg-amber-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        {{ processing ? $t('checkout.processingButton') : $t('checkout.payButton') }}
                    </button>

                    <p class="mt-4 text-xs text-stone-400 dark:text-stone-500 text-center">
                        {{ $t('checkout.securePaymentNote') }}
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import { loadStripe } from '@stripe/stripe-js'
    import { useToast } from 'vue-toastification'
    import { useI18n } from 'vue-i18n'
    import { useRouter } from 'vue-router'
    import { useCartStore } from '@/stores/cart'
    import { useDarkMode } from '@/composables/useDarkMode'
    import { supabase } from '@/supabase'

    const toast = useToast()
    const { t } = useI18n()
    const router = useRouter()
    const cart = useCartStore()
    const { isDark } = useDarkMode()

    const email = ref('')
    const loading = ref(false)
    const processing = ref(false)
    const elementReady = ref(false)
    const succeeded = ref(false)
    const isProcessing = ref(false)
    const errorMessage = ref('')
    const configError = ref('')

    const paymentElementTarget = ref(null)

    let stripeInstance = null
    let elementsInstance = null
    let paymentElement = null

    const RETURN_URL = () => `${window.location.origin}/checkout`

    async function initPaymentIntent() {
        loading.value = true
        errorMessage.value = ''

        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
            body: {
                items: cart.items.map(item => ({ id: item.id, quantity: item.quantity })),
                email: email.value || undefined
            }
        })

        if (error || !data?.clientSecret) {
            loading.value = false
            errorMessage.value = t('checkout.errorInit')
            return
        }

        elementsInstance = stripeInstance.elements({
            clientSecret: data.clientSecret,
            appearance: { theme: isDark.value ? 'night' : 'stripe' }
        })
        paymentElement = elementsInstance.create('payment')
        paymentElement.mount(paymentElementTarget.value)
        paymentElement.on('ready', () => {
            loading.value = false
            elementReady.value = true
        })
    }

    async function handleRedirectReturn(clientSecret) {
        loading.value = true
        const { paymentIntent } = await stripeInstance.retrievePaymentIntent(clientSecret)
        loading.value = false

        // Query-Parameter aus der URL entfernen, ohne die Komponente neu zu laden
        router.replace({ path: '/checkout', query: {} })

        switch (paymentIntent?.status) {
            case 'succeeded':
                succeeded.value = true
                cart.clearCart()
                toast.success(t('checkout.toastSuccess'))
                break
            case 'processing':
                succeeded.value = true
                isProcessing.value = true
                cart.clearCart()
                break
            case 'requires_payment_method':
                errorMessage.value = t('checkout.errorRetry')
                break
            default:
                errorMessage.value = t('checkout.errorGeneric')
        }
    }

    async function handleSubmit() {
        if (!stripeInstance || !elementsInstance) return

        processing.value = true
        errorMessage.value = ''

        const { error, paymentIntent } = await stripeInstance.confirmPayment({
            elements: elementsInstance,
            confirmParams: {
                return_url: RETURN_URL(),
                receipt_email: email.value || undefined
            },
            redirect: 'if_required'
        })

        processing.value = false

        if (error) {
            errorMessage.value = error.message || t('checkout.errorGeneric')
            return
        }

        if (paymentIntent?.status === 'succeeded') {
            succeeded.value = true
            cart.clearCart()
            toast.success(t('checkout.toastSuccess'))
        }
    }

    onMounted(async () => {
        const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
        if (!publishableKey) {
            configError.value = t('checkout.missingKeyError')
            return
        }

        stripeInstance = await loadStripe(publishableKey)
        if (!stripeInstance) {
            configError.value = t('checkout.missingKeyError')
            return
        }

        const params = new URLSearchParams(window.location.search)
        const redirectClientSecret = params.get('payment_intent_client_secret')

        if (redirectClientSecret) {
            await handleRedirectReturn(redirectClientSecret)
            return
        }

        if (cart.items.length === 0) {
            return
        }

        await initPaymentIntent()
    })

    onBeforeUnmount(() => {
        if (paymentElement) {
            paymentElement.unmount()
        }
    })
</script>
