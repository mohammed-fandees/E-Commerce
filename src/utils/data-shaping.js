import fs from 'fs';
import fetch from 'node-fetch'; 

fetch('https://api.escuelajs.co/api/v1/products') // use your fav api here, but don't forget add the real naming of object prop's name 
  .then(res => res.json())
  .then(data => {
    const shapped = {
      products: data.products.map(p => ({
        id: p.id,
        img: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
        title: p.title,
        price: p.price,
        oldPrice: p.price + Math.round(p.price * (p.discountPercentage ?? 0) / 100),
        rating: typeof p.rating === 'number' ? Math.round(p.rating) : 0,
        reviewsCount: typeof p.reviewsCount === 'number' ? p.reviewsCount : 0
      }))
    };

    fs.writeFileSync('./src/data/products.json', JSON.stringify(shapped, null, 2));
    console.log("✅ Done! File saved as products.json");
  })
  .catch(console.error);
