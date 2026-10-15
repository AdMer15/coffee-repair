<template>
    <div class="max-w-7xl mx-auto px-8 py-16">
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-light">{{ $t('shop.title') }}</h1>

            <router-link to="/warenkorb" class="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700 px-4 py-2 rounded-md text-sm font-medium transition">
                {{ $t('shop.cartLabel', { count: cart.itemCount }) }}
            </router-link>
        </div>

        <!-- Filter (Kategorien) -->
        <div class="flex gap-4 mb-8 border-b border-stone-200 dark:border-stone-800 pb-4">
            <button v-for="cat in categories"
                    :key="cat"
                    @click="currentCategory = cat"
                    :class="currentCategory === cat ? 'bg-stone-900 text-white dark:bg-amber-700' : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700'"
                    class="px-4 py-2 rounded-md text-sm transition">
                {{ $t(`shop.categories.${cat}`) }}
            </button>
        </div>

        <!-- Produkt-Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="product in filteredProducts"
                 :key="product.id"
                 class="border border-stone-200 dark:border-stone-800 dark:bg-stone-900 rounded-lg p-6 flex flex-col justify-between">
                <div>
                    <!-- Das Bild (Platzhalter von Unsplash) -->
                    <img :src="product.image" :alt="$t(product.nameKey)" class="w-full h-48 object-cover rounded-md mb-4 bg-stone-100 dark:bg-stone-800">
                    <h2 class="text-lg font-medium">{{ $t(product.nameKey) }}</h2>
                    <p class="text-stone-500 dark:text-stone-400 text-sm mb-4">{{ product.price.toFixed(2) }} €</p>
                </div>

                <!-- Der wichtige Button -->
                <button @click="addToCart(product)"
                        class="w-full bg-stone-900 text-white py-2 rounded-md hover:bg-stone-700 dark:bg-stone-700 dark:hover:bg-stone-600 transition">
                    {{ $t('shop.addToCartButton') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, computed } from 'vue'
    import { useToast } from 'vue-toastification'
    import { useI18n } from 'vue-i18n'
    import { useCartStore } from '@/stores/cart' // <--- Hier laden wir dein neues "Gedächtnis" rein!

    const toast = useToast()
    const { t } = useI18n()

    // Den Store aktivieren
    const cart = useCartStore()

    // Die verfügbaren Kategorien (Codes bleiben sprachunabhängig, Anzeige kommt aus den Sprachdateien)
    const categories = ['all', 'coffee', 'accessories']
    const currentCategory = ref('all')

    // Deine Produktdaten (später kannst du das noch erweitern)
    const products = [
    { id: 1, nameKey: 'shop.products.espresso', category: 'coffee', price: 14.90, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80' },
    { id: 2, nameKey: 'shop.products.yirgacheffe', category: 'coffee', price: 16.50, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80' },
    { id: 3, nameKey: 'shop.products.milkPitcher', category: 'accessories', price: 29.00, image: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=800&q=80' },
    { id: 4, nameKey: 'shop.products.tamper', category: 'accessories', price: 45.00, image: 'https://images.unsplash.com/photo-1611162458324-aae1eb4129a4?w=800&q=80' },
    { id: 5, nameKey: 'shop.products.decaf', category: 'coffee', price: 15.00, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80' }
    ]

    // Berechnet, welche Produkte angezeigt werden sollen
    const filteredProducts = computed(() => {
    if (currentCategory.value === 'all') {
    return products
    }
    return products.filter(p => p.category === currentCategory.value)
    })

    // Die Funktion, die aufgerufen wird, wenn man klickt
    const addToCart = (product) => {
    cart.addToCart(product) // Das schickt das Produkt in den Pinia-Store!

    // Kleines visuelles Feedback
    toast.success(t('shop.toastAddedToCart', { product: t(product.nameKey) }))
    }
</script>