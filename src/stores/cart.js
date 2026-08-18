import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // Der Zustand: Hier werden die Produkte gespeichert
  const items = ref([])

  // Funktion zum Hinzufügen
  function addToCart(product) {
    items.value.push(product)
  }

  // Funktion zum Entfernen
  function removeFromCart(productId) {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  // Ein kleiner Helfer: Anzahl der Artikel im Header
  const itemCount = computed(() => items.value.length)

  return { items, addToCart, removeFromCart, itemCount }
})