import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'cart'

function loadStoredItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export const useCartStore = defineStore('cart', () => {
  // Der Zustand: Hier werden die Produkte gespeichert (inkl. Menge)
  const items = ref(loadStoredItems())

  // Persistiert den Warenkorb bei jeder Änderung in localStorage, damit er einen Reload übersteht
  watch(items, (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  }, { deep: true })

  // Funktion zum Hinzufügen: erhöht die Menge, falls das Produkt schon im Warenkorb liegt
  function addToCart(product) {
    const existing = items.value.find(item => item.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({ ...product, quantity: 1 })
    }
  }

  // Funktion zum vollständigen Entfernen eines Produkts
  function removeFromCart(productId) {
    const index = items.value.findIndex(item => item.id === productId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  // Menge erhöhen
  function increaseQuantity(productId) {
    const item = items.value.find(item => item.id === productId)
    if (item) item.quantity++
  }

  // Menge verringern (entfernt das Produkt, sobald die Menge 0 erreicht)
  function decreaseQuantity(productId) {
    const item = items.value.find(item => item.id === productId)
    if (!item) return
    if (item.quantity > 1) {
      item.quantity--
    } else {
      removeFromCart(productId)
    }
  }

  // Leert den Warenkorb komplett (z. B. nach Abschluss der Bestellung)
  function clearCart() {
    items.value = []
  }

  // Ein kleiner Helfer: Anzahl der Artikel im Header (Summe der Mengen)
  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  // Gesamtsumme über alle Artikel
  const totalPrice = computed(() => items.value.reduce((sum, item) => sum + item.price * item.quantity, 0))

  return {
    items,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    itemCount,
    totalPrice
  }
})
