import fs from 'fs';
import fetch from 'node-fetch';

const allColors = [
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#10b981' },
  { name: 'Yellow', value: '#facc15' },
  { name: 'Gray', value: '#6b7280' }
];

const allSizes = ['XS', 'S', 'M', 'L', 'XL'];

function getRandomItems(arr, max = 3) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * max) + 1).map(item => ({
    ...(typeof item === 'string' ? { name: item } : item),
    available: Math.random() > 0.3
  }));
}

fetch('https://dummyjson.com/products?limit=100&skip=0')
  .then(res => res.json())
  .then(data => {
    const shaped = {
      products: data.products.map(p => ({
        id: p.id,
        img: p.thumbnail,
        images: p.images.slice(0, 4),
        title: p.title,
        price: p.price,
        oldPrice: p.discountPercentage
          ? Math.round(p.price * (1 + p.discountPercentage / 100))
          : null,
        rating: Math.round(p.rating),
        reviewsCount: p.stock,
        description: p.description,
        colors: getRandomItems(allColors),
        sizes: getRandomItems(allSizes),
        inStock: p.stock > 0,
        stockCount: p.stock,
        category: p.category || 'General',
        brand: p.brand || 'Generic',
        sku: `SKU-${p.id}`,
        specifications: {
          Brand: p.brand || 'Generic',
          Category: p.category || 'General',
          Rating: `${p.rating} / 5`,
          Discount: `${p.discountPercentage}%`
        }
      }))
    };

    fs.writeFileSync('./src/data/products.json', JSON.stringify(shaped, null, 2));
    console.log('✅ Done! File saved as products.json');
  })
  .catch(console.error);
