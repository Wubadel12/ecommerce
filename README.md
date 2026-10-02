# NOVA — Modern E-Commerce Platform

NOVA is a responsive electronics storefront built as a React portfolio project. It demonstrates product discovery across 40 products and 10 categories, persistent shopping state, local demo accounts, and multi-step checkout without a backend or real payment processing.

## Screenshots

Add current desktop and mobile screenshots here after capturing the running app.

Suggested views: Home page, product listing with filters, product detail, cart and checkout, and account overview.

## Features

- Responsive store header, category navigation, search, and footer
- Home page with catalog sections and category links
- Product listings with live search, suggestions, recent searches, filters, sorting, grid/list views, and pagination
- Product detail gallery, variant selection, stock information, specifications, recently viewed, and related products
- Product cards include add-to-bag and quick-view actions; product details include a buy-now path into checkout
- Product review submission saved locally in the current browser, with ratings and review text clearly marked as demo content
- Persistent cart with quantity controls, save for later, coupon codes, estimated shipping, tax, and totals
- Persistent wishlist connected to product cards and details
- Local demo registration/sign-in and protected account routes
- Account overview, profile editing, order history, saved addresses, and preferences
- Multi-step checkout with contact, address, delivery, mock payment, and order review
- Locally saved order confirmation; no charge is made
- Persistent light/dark theme
- Accessible labels, keyboard focus styles, empty states, and mobile filter drawer
- Privacy and terms pages that explain the local-only demo behavior

## Tech stack

- React 19 and JavaScript
- Vite
- React Router
- Context API, useReducer, and React hooks
- CSS Modules and CSS custom properties
- Lucide React icons
- LocalStorage for demo persistence

No TypeScript or additional state-management dependency is used.

## Getting started

Requirements: Node.js and npm.

    npm install
    npm run dev

Vite prints the local development URL in the terminal.

## Available scripts

| Command | Purpose |
|---|---|
| npm run dev | Start the Vite development server |
| npm run build | Create the production build in dist/ |
| npm run preview | Preview the production build locally |
| npm run lint | Run ESLint |
| npm run validate:data | Validate product and category data |
| npm run generate:placeholders | Regenerate local placeholder product images |

## Project structure

    src/
      components/
        common/       Shared loading and accessibility components
        layout/       Store header and footer
        product/      Shared product listing and filters
      context/        Cart, wishlist, auth, and theme providers
      data/           Local product and category catalog
      hooks/          Custom state and catalog hooks
      layouts/        Store, account, and checkout layouts
      pages/          Route-level pages
        StoreInfo.jsx  Demo privacy and terms information
      routes/         React Router configuration
      services/       Async local catalog service
      styles/         Reset, design tokens, and global styles
      utils/          Storage helpers and formatters
    public/images/    Generated SVG product and category placeholders
    scripts/          Catalog validation and image-generation scripts

## Architecture

The route tree is defined in src/routes/AppRoutes.jsx. Store pages share the main layout, account pages use a protected account layout, and checkout uses a focused layout.

The catalog is held in local data files and loaded through an async product service. The 40 sample products cover smartphones, laptops, tablets, headphones, accessories, gaming, smart home, smart watches, monitors, and cameras. Shop, category, and search routes share one listing component; filters and sorted results are derived from the source products.

Cart, wishlist, authentication, and theme each have their own provider. Cart and wishlist use reducers because they support several related actions. Small consumers use custom hooks such as useCart() and useWishlist(). Important demo state is persisted through guarded helpers in src/utils/storage.js.

## Demo behavior and limitations

- This is a frontend-only portfolio project. There is no server or real authentication.
- Demo accounts, cart contents, saved items, orders, addresses, preferences, and theme are stored in the current browser’s LocalStorage.
- Demo account passwords are stored as salted PBKDF2 hashes. This does not make the app suitable for real authentication; production credentials belong on a secure server.
- Checkout only creates a local mock order. Do not enter real card details. Payment information is not saved or sent.
- Newsletter submission displays demo feedback; it does not send or save the address.
- Home page testimonials are sample portfolio content, not verified customer reviews.
- Submitted product reviews are demo content stored in LocalStorage on the current device and are not moderated or shared with other customers.
- Product photography is currently represented by generated SVG placeholders. Replace these with licensed product images before publishing a production storefront.

## Future improvements

- Replace the local catalog service with a real API
- Add a backend for accounts, addresses, orders, inventory, and reviews
- Connect a payment provider in an appropriate secure environment
- Add licensed product photography and screenshots
- Add automated component, reducer, and end-to-end tests
- Add richer product review moderation and verified purchase support

## License and portfolio use

NOVA is an educational portfolio demo. Product names, prices, customer comments, and order flows are sample storefront content and do not represent a real retailer.

