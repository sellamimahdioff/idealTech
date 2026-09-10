# À exécuter depuis C:\Users\MSI\ideal-tech\frontend
# Crée tous les dossiers et fichiers vides de l'architecture frontend

# ---- Dossiers ----
$folders = @(
  "src/theme",
  "src/services",
  "src/store",
  "src/utils",
  "src/components/layout",
  "src/components/product",
  "src/components/cart",
  "src/components/ui",
  "src/pages/client",
  "src/pages/admin/categories",
  "src/pages/admin/products",
  "src/pages/admin/orders",
  "src/routes",
  "src/hooks",
  "src/assets/images",
  "src/assets/icons"
)

foreach ($f in $folders) {
  New-Item -ItemType Directory -Force -Path $f | Out-Null
}

# ---- Fichiers ----
$files = @(
  "src/theme/colors.ts",
  "src/theme/fonts.css",

  "src/services/api.ts",
  "src/services/types.ts",
  "src/services/categoryService.ts",
  "src/services/productService.ts",
  "src/services/orderService.ts",

  "src/store/cartStore.ts",
  "src/store/authStore.ts",

  "src/utils/formatPrice.ts",
  "src/utils/validators.ts",

  "src/components/layout/Header.tsx",
  "src/components/layout/Footer.tsx",
  "src/components/layout/CategoryStrip.tsx",
  "src/components/layout/ClientLayout.tsx",
  "src/components/layout/AdminLayout.tsx",

  "src/components/product/ProductCard.tsx",
  "src/components/product/ProductGrid.tsx",

  "src/components/cart/CartDrawer.tsx",
  "src/components/cart/CartItem.tsx",

  "src/components/ui/Button.tsx",
  "src/components/ui/Field.tsx",
  "src/components/ui/StatusBadge.tsx",

  "src/pages/client/Home.tsx",
  "src/pages/client/Catalog.tsx",
  "src/pages/client/ProductDetail.tsx",
  "src/pages/client/Cart.tsx",
  "src/pages/client/Checkout.tsx",
  "src/pages/client/OrderConfirmation.tsx",
  "src/pages/client/QuoteRequest.tsx",
  "src/pages/client/OrderTracking.tsx",

  "src/pages/admin/AdminLogin.tsx",
  "src/pages/admin/Dashboard.tsx",
  "src/pages/admin/categories/CategoryList.tsx",
  "src/pages/admin/categories/CategoryForm.tsx",
  "src/pages/admin/products/ProductList.tsx",
  "src/pages/admin/products/ProductForm.tsx",
  "src/pages/admin/orders/OrderList.tsx",
  "src/pages/admin/orders/OrderDetail.tsx",
  "src/pages/admin/orders/InvoiceList.tsx",

  "src/routes/AppRouter.tsx",
  "src/routes/AdminGuard.tsx",

  "src/hooks/useProducts.ts",
  "src/hooks/useCategories.ts",
  "src/hooks/useOrders.ts",

  ".env",
  ".env.example"
)

foreach ($f in $files) {
  if (-not (Test-Path $f)) {
    New-Item -ItemType File -Force -Path $f | Out-Null
  }
}

Write-Host "Arborescence frontend créée avec succès." -ForegroundColor Green
