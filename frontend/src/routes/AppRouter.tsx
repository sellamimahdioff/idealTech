import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClientLayout } from '../components/layout/ClientLayout.js';
import { AdminLayout } from '../components/layout/AdminLayout.js';
import { AdminGuard } from './AdminGuard.js';

import { Home } from '../pages/client/Home.js';
import { Catalog } from '../pages/client/Catalog.js';
import { ProductDetail } from '../pages/client/ProductDetail.js';
import { Cart } from '../pages/client/Cart.js';
import { Checkout } from '../pages/client/Checkout.js';
import { OrderConfirmation } from '../pages/client/OrderConfirmation.js';
import { QuoteRequest } from '../pages/client/QuoteRequest.js';
import { OrderTracking } from '../pages/client/OrderTracking.js';

import { AdminLogin } from '../pages/admin/AdminLogin.js';
import { Dashboard } from '../pages/admin/Dashboard.js';
import { CategoryList } from '../pages/admin/categories/CategoryList.js';
import { CategoryForm } from '../pages/admin/categories/CategoryForm.js';
import { ProductList } from '../pages/admin/products/ProductList.js';
import { ProductForm } from '../pages/admin/products/ProductForm.js';
import { OrderList } from '../pages/admin/orders/OrderList.js';
import { OrderDetail } from '../pages/admin/orders/OrderDetail.js';
import { InvoiceList } from '../pages/admin/orders/InvoiceList.js';
import { ReviewModeration } from '../pages/admin/reviews/ReviewModeration.js';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalog />} />
          <Route path="/produit/:id" element={<ProductDetail />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/commande" element={<Checkout />} />
          <Route
            path="/confirmation/:orderNumber"
            element={<OrderConfirmation />}
          />
          <Route path="/devis" element={<QuoteRequest />} />
          <Route path="/suivi" element={<OrderTracking />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        <Route element={<AdminGuard />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/categories" element={<CategoryList />} />
            <Route
              path="/admin/categories/nouvelle"
              element={<CategoryForm />}
            />
            <Route path="/admin/categories/:id" element={<CategoryForm />} />
            <Route path="/admin/produits" element={<ProductList />} />
            <Route
              path="/admin/produits/nouveau"
              element={<ProductForm />}
            />
            <Route path="/admin/produits/:id" element={<ProductForm />} />
            <Route
              path="/admin/commandes"
              element={<OrderList type="order" />}
            />
            <Route path="/admin/commandes/:id" element={<OrderDetail />} />
            <Route path="/admin/devis" element={<OrderList type="quote" />} />
            <Route path="/admin/devis/:id" element={<OrderDetail />} />
            <Route path="/admin/factures" element={<InvoiceList />} />
            <Route path="/admin/avis" element={<ReviewModeration />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}