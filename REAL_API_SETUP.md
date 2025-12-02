# Setting Up Real Product APIs for Price Comparison

The PriceComparison component is currently using placeholder data. To get **real product images and prices** from actual retailers, you need to integrate their APIs.

## 🛒 Available Retailer APIs

### 1. **Amazon Product Advertising API**

**Get Real Amazon Product Images & Prices**

#### Sign Up:
1. Go to: https://affiliate-program.amazon.com/
2. Join Amazon Associates (affiliate program)
3. Once approved, access Product Advertising API: https://webservices.amazon.com/paapi5/documentation/

#### API Keys Needed:
- **Access Key ID**
- **Secret Access Key**
- **Associate Tag (Tracking ID)**

#### Implementation:
```typescript
// Install the SDK
// npm install amazon-paapi

import { ProductAdvertisingAPIClient } from 'amazon-paapi';

const client = new ProductAdvertisingAPIClient({
  accessKey: 'YOUR_ACCESS_KEY',
  secretKey: 'YOUR_SECRET_KEY',
  associateTag: 'YOUR_ASSOCIATE_TAG',
  region: 'US' // or 'UK', 'CA', etc.
});

// Search for products
const response = await client.searchItems({
  Keywords: supplementName,
  SearchIndex: 'HealthPersonalCare',
  ItemCount: 3,
  Resources: [
    'Images.Primary.Large',
    'ItemInfo.Title',
    'Offers.Listings.Price',
    'CustomerReviews'
  ]
});

// Extract real product data
const products = response.SearchResult.Items.map(item => ({
  retailer: 'Amazon',
  price: item.Offers.Listings[0].Price.Amount,
  imageUrl: item.Images.Primary.Large.URL, // REAL IMAGE!
  productName: item.ItemInfo.Title.DisplayValue,
  rating: item.CustomerReviews.StarRating,
  url: item.DetailPageURL
}));
```

---

### 2. **iHerb Partner API**

**Get Real iHerb Product Images & Prices**

#### Sign Up:
1. Go to: https://www.iherb.com/info/affiliate-program
2. Apply for the Partner Program
3. Access API documentation in partner dashboard

#### API Keys Needed:
- **Partner ID**
- **API Key**

#### Implementation:
```typescript
// iHerb has a REST API for partners
const response = await fetch(
  `https://api.iherb.com/product/search?kw=${supplementName}&partnerId=YOUR_PARTNER_ID`,
  {
    headers: {
      'Authorization': `Bearer YOUR_API_KEY`
    }
  }
);

const data = await response.json();

const products = data.products.map(product => ({
  retailer: 'iHerb',
  price: product.price,
  imageUrl: product.images[0].url, // REAL IMAGE!
  productName: product.name,
  rating: product.rating,
  url: product.url
}));
```

---

### 3. **Walmart Open API**

**Get Real Walmart Product Images & Prices**

#### Sign Up:
1. Go to: https://developer.walmart.com/
2. Create a developer account
3. Request API access

#### API Keys Needed:
- **Consumer ID**
- **Private Key**

#### Implementation:
```typescript
// Install Walmart SDK
// npm install @walmartlabs/walmart-api

import { WalmartAPI } from '@walmartlabs/walmart-api';

const walmart = new WalmartAPI({
  apiKey: 'YOUR_CONSUMER_ID',
  affiliateId: 'YOUR_AFFILIATE_ID'
});

const response = await walmart.search({
  query: supplementName,
  categoryId: '976760' // Health & Wellness
});

const products = response.items.map(item => ({
  retailer: 'Walmart',
  price: item.salePrice,
  imageUrl: item.mediumImage, // REAL IMAGE!
  productName: item.name,
  rating: item.customerRating,
  url: item.productUrl
}));
```

---

### 4. **CVS Pharmacy (No Public API)**

CVS doesn't have a public API. Options:
- Web scraping (not recommended, violates ToS)
- Manual data entry
- Use Google Shopping API as a proxy

---

### 5. **Vitacost (No Public API)**

Similar to CVS - consider using:
- **Google Shopping API** (covers multiple retailers)
- **RapidAPI's Product Search APIs**

---

## 🔑 Quick Start: Use Google Shopping API

**Best option for multiple retailers at once!**

#### Sign Up:
1. Go to: https://console.cloud.google.com/
2. Enable Google Content API for Shopping
3. Create API credentials

#### Implementation:
```typescript
// This gets products from ALL retailers including Amazon, Walmart, CVS, etc.
const response = await fetch(
  `https://www.googleapis.com/shopping/v1/products?q=${supplementName}&key=YOUR_API_KEY`
);

const data = await response.json();

const products = data.items.map(item => ({
  retailer: item.product.brand,
  price: item.product.price.value,
  imageUrl: item.product.images[0].link, // REAL IMAGE!
  productName: item.product.title,
  url: item.product.link
}));
```

---

## 📝 How to Update the Code

### Option 1: Add to `.env` file
```bash
# .env
VITE_AMAZON_ACCESS_KEY=your_amazon_access_key
VITE_AMAZON_SECRET_KEY=your_amazon_secret_key
VITE_IHERB_API_KEY=your_iherb_api_key
VITE_WALMART_API_KEY=your_walmart_api_key
```

### Option 2: Update PriceComparison.tsx

Replace the placeholder functions (`fetchAmazonProducts`, `fetchIHerbProducts`, `fetchWalmartProducts`) with real API calls using the code examples above.

---

## 💡 Recommended Approach

**For fastest setup:**
1. ✅ **Google Shopping API** - covers all retailers in one API
2. ✅ **Amazon Product Advertising API** - most important for supplements
3. ✅ **iHerb Partner API** - supplement-specific retailer

**Budget: FREE tier available for all!**

---

## 🚀 Testing

Once you have API keys, update `src/components/PriceComparison.tsx`:

1. Add your API keys to environment variables
2. Replace the mock functions with real API calls
3. Test with a search like "Magnesium Supplement"
4. You'll see REAL product images from actual retailers!

---

## ⚠️ Important Notes

- **Rate Limits:** Most APIs have rate limits (e.g., 1 request/second)
- **Caching:** Cache API responses to avoid hitting limits
- **Affiliate Links:** Some APIs require affiliate IDs for monetization
- **Terms of Service:** Always comply with retailer ToS
- **Image Rights:** Product images are copyrighted, use only via official APIs

---

## 🎯 Current Status

The app currently uses:
- ✅ Real Amazon/iHerb/Walmart URL formats
- ✅ Realistic pricing structure
- ⚠️ Placeholder images (Unsplash/mock URLs)
- ⚠️ Mock product data

**To get real images:** Follow the setup above and integrate at least one API.

**Estimated setup time:** 30-60 minutes per API
