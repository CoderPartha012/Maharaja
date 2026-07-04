import { useState, useEffect } from 'react';
import { ChefHat, Flame, Plus, Check } from 'lucide-react';
import SEO from '../components/SEO';
import MenuSkeleton from '../components/skeletons/MenuSkeleton';
import { useCart } from '../lib/cart';

type Cuisine = 'all' | 'north' | 'south';
type DietFilter = 'all' | 'veg' | 'nonveg';
type ItemSpiceLevel = 'mild' | 'medium' | 'hot';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  cuisine: 'north' | 'south';
  category: string;
  isVeg: boolean;
  spiceLevel?: ItemSpiceLevel; // optional — not shown for breads, rice, beverages, desserts
  isChefSpecial?: boolean;
}

// Category display order
const CATEGORY_ORDER = [
  'Starters',
  'Main Course',
  'Breads',
  'Rice',
  'Combo Meals',
  'Desserts',
  'Beverages',
] as const;

const menuItems: MenuItem[] = [
  // ── Starters ─────────────────────────────────────────────────
  {
    id: '12',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese cubes marinated with yogurt and spices',
    price: 260,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?fm=webp&w=800&q=80',
    cuisine: 'north',
    category: 'Starters',
    isVeg: true,
    spiceLevel: 'medium',
    isChefSpecial: true,
  },
  {
    id: '18',
    name: 'Medu Vada',
    description: 'Crispy lentil doughnuts served with coconut chutney and sambar',
    price: 100,
    image: 'https://maayeka.com/wp-content/uploads/2018/10/vrat-ka-medu-vada-2-2.jpg',
    cuisine: 'south',
    category: 'Starters',
    isVeg: true,
  },
  {
    id: '10',
    name: 'Fish Fry',
    description: 'Crispy deep-fried fish marinated with South Indian spices',
    price: 280,
    image:
      'https://palatesdesire.com/wp-content/uploads/2022/01/chettinad-fish-fry-recipe@palates-desire.jpg',
    cuisine: 'south',
    category: 'Starters',
    isVeg: false,
    spiceLevel: 'medium',
  },

  // ── Main Course ───────────────────────────────────────────────
  {
    id: '1',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese cubes in rich tomato and cashew gravy',
    price: 280,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?fm=webp&w=800&q=80',
    cuisine: 'north',
    category: 'Main Course',
    isVeg: true,
    spiceLevel: 'medium',
    isChefSpecial: true,
  },
  {
    id: '3',
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils in buttery tomato gravy',
    price: 250,
    image: 'https://www.funfoodfrolic.com/wp-content/uploads/2023/04/Dal-Makhani-Blog.jpg',
    cuisine: 'north',
    category: 'Main Course',
    isVeg: true,
    spiceLevel: 'mild',
  },
  {
    id: '11',
    name: 'Chole Bhature',
    description: 'Spicy chickpea curry served with fluffy fried bread',
    price: 180,
    image: 'https://madhurasrecipe.com/wp-content/uploads/2025/09/MR-Chole-Bhature-featured.jpg',
    cuisine: 'north',
    category: 'Main Course',
    isVeg: true,
  },
  {
    id: '15',
    name: 'Palak Paneer',
    description: 'Cottage cheese cubes cooked in creamy spinach gravy',
    price: 270,
    image: 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?fm=webp&w=800&q=80',
    cuisine: 'north',
    category: 'Main Course',
    isVeg: true,
    spiceLevel: 'mild',
  },
  {
    id: '2',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato mixture',
    price: 120,
    image:
      'https://vismaifood.com/storage/app/uploads/public/8b4/19e/427/thumb__700_0_0_0_auto.jpg',
    cuisine: 'south',
    category: 'Main Course',
    isVeg: true,
    spiceLevel: 'medium',
  },
  {
    id: '7',
    name: 'Idli Sambar',
    description: 'Steamed rice cakes served with flavorful lentil soup',
    price: 90,
    image:
      'https://media.istockphoto.com/id/1306083224/photo/idly-or-idli.jpg?s=612x612&w=0&k=20&c=cVpLEs4L3je0_zEFQ38BeZRjBLYQ1YGr9oTIdjhAbTY=',
    cuisine: 'south',
    category: 'Main Course',
    isVeg: true,
  },
  {
    id: '19',
    name: 'Uttapam',
    description: 'Soft thick rice pancake topped with onion, tomato, and green chilies',
    price: 140,
    image:
      'https://pipingpotcurry.com/wp-content/uploads/2026/01/Uttapam-Onion-Tomato-PipingPotCurry.jpg',
    cuisine: 'south',
    category: 'Main Course',
    isVeg: true,
  },
  {
    id: '20',
    name: 'Appam with Stew',
    description: 'Soft lacy pancakes served with creamy vegetable stew',
    price: 220,
    image: 'https://www.foodiaq.com/wp-content/uploads/2024/02/Appam-Veg-Stew-2.jpg',
    cuisine: 'south',
    category: 'Main Course',
    isVeg: true,
  },
  {
    id: '5',
    name: 'Butter Chicken',
    description: 'Tandoori chicken simmered in rich buttery tomato gravy',
    price: 320,
    image: 'https://www.licious.in/blog/wp-content/uploads/2020/10/butter-chicken-.jpg',
    cuisine: 'north',
    category: 'Main Course',
    isVeg: false,
    spiceLevel: 'medium',
    isChefSpecial: true,
  },
  {
    id: '6',
    name: 'Rogan Josh',
    description: 'Slow-cooked lamb curry with aromatic spices',
    price: 350,
    image: 'https://headbangerskitchen.com/wp-content/uploads/2024/08/ROGANJOSH-H2.jpg',
    cuisine: 'north',
    category: 'Main Course',
    isVeg: false,
    spiceLevel: 'hot',
  },
  {
    id: '9',
    name: 'Chettinad Chicken Curry',
    description: 'Spicy South Indian chicken curry with roasted spices',
    price: 320,
    image: 'https://www.whiskaffair.com/wp-content/uploads/2020/09/Chicken-Chettinad-Curry-2-3.jpg',
    cuisine: 'south',
    category: 'Main Course',
    isVeg: false,
    spiceLevel: 'hot',
  },
  {
    id: '21',
    name: 'Prawn Curry',
    description: 'Coastal style prawn curry cooked with coconut and spices',
    price: 380,
    image: 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?fm=webp&w=800&q=80',
    cuisine: 'south',
    category: 'Main Course',
    isVeg: false,
    spiceLevel: 'hot',
  },

  // ── Breads ────────────────────────────────────────────────────
  {
    id: '4',
    name: 'Aloo Paratha',
    description: 'Stuffed whole wheat flatbread with spiced mashed potatoes',
    price: 80,
    image:
      'https://www.indianhealthyrecipes.com/wp-content/uploads/2020/08/aloo-paratha-recipe.jpg',
    cuisine: 'north',
    category: 'Breads',
    isVeg: true,
  },
  {
    id: '16',
    name: 'Tandoori Roti',
    description: 'Traditional whole wheat bread baked in a clay oven',
    price: 35,
    image: 'https://www.indianrecipeinfo.com/wp-content/uploads/2011/12/Tandoori-Roti.jpg',
    cuisine: 'north',
    category: 'Breads',
    isVeg: true,
  },
  {
    id: '32',
    name: 'Butter Naan',
    description: 'Soft leavened bread brushed with butter, baked in tandoor',
    price: 50,
    image:
      'https://www.cookwithmanali.com/wp-content/uploads/2014/11/Soft-Homemade-Naan-500x500.jpg',
    cuisine: 'north',
    category: 'Breads',
    isVeg: true,
  },

  // ── Rice ──────────────────────────────────────────────────────
  {
    id: '13',
    name: 'Veg Biryani',
    description: 'Fragrant basmati rice cooked with vegetables and aromatic spices',
    price: 240,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?fm=webp&w=800&q=80',
    cuisine: 'north',
    category: 'Rice',
    isVeg: true,
  },
  {
    id: '14',
    name: 'Chicken Biryani',
    description: 'Layered basmati rice and chicken slow-cooked with royal spices',
    price: 340,
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?fm=webp&w=800&q=80',
    cuisine: 'north',
    category: 'Rice',
    isVeg: false,
    isChefSpecial: true,
  },
  {
    id: '17',
    name: 'Hyderabadi Biryani',
    description: 'Authentic dum biryani layered with fragrant rice and spiced chicken',
    price: 360,
    image:
      'https://www.thehosteller.com/_next/image/?url=https%3A%2F%2Fstatic.thehosteller.com%2Fhostel%2Fimages%2Fimage.jpg%2Fimage-1744199226259.jpg&w=2048&q=75',
    cuisine: 'south',
    category: 'Rice',
    isVeg: false,
    isChefSpecial: true,
  },

  // ── Combo Meals ───────────────────────────────────────────────
  {
    id: '28',
    name: 'South Indian Thali',
    description:
      'Idli, masala dosa, sambar, two chutneys, and steamed rice — a complete Southern feast',
    price: 280,
    image:
      'https://static.vecteezy.com/system/resources/thumbnails/068/494/726/small/traditional-indian-thali-meal-served-on-banana-leaf-displaying-culinary-delights-photo.jpg',
    cuisine: 'south',
    category: 'Combo Meals',
    isVeg: true,
  },
  {
    id: '29',
    name: 'North Indian Thali',
    description: 'Dal makhani, paneer curry, 2 rotis, steamed rice, raita, and salad',
    price: 320,
    image:
      'https://www.cookshideout.com/wp-content/uploads/2017/03/Vegetarian-North-Indian-Thali0S.jpg',
    cuisine: 'north',
    category: 'Combo Meals',
    isVeg: true,
    isChefSpecial: true,
  },
  {
    id: '30',
    name: 'Non-Veg Thali',
    description: 'Butter chicken, fish curry, 2 rotis, steamed rice, raita, and salad',
    price: 420,
    image:
      'https://cdn.sanity.io/images/ybaq07b6/production/dc91d3f3420168a5da589991766731710caf27fb-1024x947.jpg',
    cuisine: 'north',
    category: 'Combo Meals',
    isVeg: false,
  },

  // ── Desserts ──────────────────────────────────────────────────
  {
    id: '23',
    name: 'Gulab Jamun',
    description: 'Soft fried milk dumplings soaked in rose-flavored sugar syrup',
    price: 120,
    image: 'https://static.toiimg.com/thumb/63799510.cms?imgsize=1091643&width=800&height=800',
    cuisine: 'north',
    category: 'Desserts',
    isVeg: true,
  },
  {
    id: '24',
    name: 'Kheer',
    description: 'Creamy rice pudding slow-cooked with cardamom, saffron, and topped with nuts',
    price: 110,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH48iQKvHCUoLQeMnqgQ7louMkbdlFL5IlBw&s',
    cuisine: 'north',
    category: 'Desserts',
    isVeg: true,
  },
  {
    id: '25',
    name: 'Rasmalai',
    description: 'Soft cottage cheese patties soaked in chilled saffron-flavored milk',
    price: 130,
    image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2013/10/rasmalai-recipe-1.jpg',
    cuisine: 'north',
    category: 'Desserts',
    isVeg: true,
    isChefSpecial: true,
  },

  // ── Beverages ─────────────────────────────────────────────────
  {
    id: '26',
    name: 'Mango Lassi',
    description: 'Refreshing blended yogurt drink with sweet ripe Alphonso mangoes',
    price: 90,
    image: 'https://annikaeats.com/wp-content/uploads/2024/03/DSC_1071.jpg',
    cuisine: 'north',
    category: 'Beverages',
    isVeg: true,
  },
  {
    id: '22',
    name: 'Filter Coffee',
    description: 'Traditional South Indian strong brewed coffee served with frothy milk',
    price: 60,
    image: 'https://www.sharmispassions.com/wp-content/uploads/2012/01/filter-coffee-recipe8.jpg',
    cuisine: 'south',
    category: 'Beverages',
    isVeg: true,
  },
  {
    id: '27',
    name: 'Masala Chai',
    description: 'Aromatic spiced Indian tea brewed with ginger, cardamom, and milk',
    price: 50,
    image:
      'https://www.thespicehouse.com/cdn/shop/articles/Chai_Masala_Tea_1200x1200.jpg?v=1606936195',
    cuisine: 'north',
    category: 'Beverages',
    isVeg: true,
  },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const flameCount: Record<ItemSpiceLevel, number> = { mild: 1, medium: 2, hot: 3 };
const spiceLevelLabel: Record<ItemSpiceLevel, string> = {
  mild: 'Mild',
  medium: 'Medium',
  hot: 'Hot',
};

const SpiceLevelIndicator = ({ level }: { level: ItemSpiceLevel }) => (
  <span
    className="flex items-center gap-0.5"
    aria-label={`Spice level: ${spiceLevelLabel[level]}`}
    title={`Spice level: ${spiceLevelLabel[level]}`}
  >
    {Array.from({ length: flameCount[level] }).map((_, i) => (
      <Flame key={i} className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
    ))}
    <span className="text-xs text-gray-500 ml-0.5">{spiceLevelLabel[level]}</span>
  </span>
);

// Traditional Indian food indicator — green square/dot for veg, red for non-veg
const VegDot = ({ isVeg }: { isVeg: boolean }) => (
  <span
    className={`inline-flex items-center justify-center w-[18px] h-[18px] border-2 rounded-sm shrink-0 ${isVeg ? 'border-green-600' : 'border-red-600'}`}
    aria-label={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
    title={isVeg ? 'Vegetarian' : 'Non-vegetarian'}
  >
    <span className={`w-2.5 h-2.5 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
  </span>
);

const MenuCard = ({ item }: { item: MenuItem }) => {
  const { addItem, items } = useCart();
  const cartQty = items.find((i) => i.id === item.id)?.quantity ?? 0;
  const inCart = cartQty > 0;

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative h-48 shrink-0">
        <img
          src={item.image}
          alt={`${item.name} — ${item.description}`}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          width="400"
          height="192"
        />
        {/* Veg/non-veg indicator — top-left */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1 rounded">
          <VegDot isVeg={item.isVeg} />
        </div>
        {/* Chef's special badge — top-right */}
        {item.isChefSpecial && (
          <div
            className="absolute top-3 right-3 bg-[#D4AF37] text-[#1A1000] px-2.5 py-1 rounded-full flex items-center gap-1"
            aria-label="Chef's Special"
          >
            <ChefHat className="w-3.5 h-3.5" aria-hidden="true" />
            <span className="text-xs font-semibold">Chef's Special</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <h3 className="text-lg font-semibold leading-snug">{item.name}</h3>
          <span
            className="text-base font-bold text-[#7A5C00] shrink-0"
            aria-label={`Price: ₹${item.price}`}
          >
            ₹{item.price}
          </span>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{item.description}</p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-500">
              <VegDot isVeg={item.isVeg} />
              {item.isVeg ? 'Veg' : 'Non-veg'}
            </span>
            {item.spiceLevel && <SpiceLevelIndicator level={item.spiceLevel} />}
          </div>

          <button
            type="button"
            onClick={() =>
              addItem({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                isVeg: item.isVeg,
              })
            }
            className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-full font-semibold shrink-0 transition-all ${
              inCart
                ? 'bg-green-100 text-green-700 border border-green-300 hover:bg-green-200'
                : 'btn-primary'
            }`}
            aria-label={
              inCart ? `${item.name} in cart (×${cartQty}), add more` : `Add ${item.name} to cart`
            }
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                In Cart ×{cartQty}
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

const MenuSection = ({ items, title }: { items: MenuItem[]; title: string }) => {
  const sectionId = `section-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const vegCount = items.filter((i) => i.isVeg).length;
  const nonVegCount = items.filter((i) => !i.isVeg).length;

  return (
    <section className="mb-14" aria-labelledby={sectionId}>
      <div className="flex items-center gap-4 mb-6">
        <h2 id={sectionId} className="text-2xl md:text-3xl font-bold text-[#7A5C00]">
          {title}
        </h2>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {vegCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600" />
              {vegCount} veg
            </span>
          )}
          {nonVegCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              {nonVegCount} non-veg
            </span>
          )}
        </div>
        <div className="flex-1 h-px bg-[#D4AF37]/40" aria-hidden="true" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};

// ── JSON-LD ───────────────────────────────────────────────────────────────────

const buildMenuJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: 'Maharaja Restaurant Menu',
  url: 'https://maharajarestaurant.in/menu',
  hasMenuSection: CATEGORY_ORDER.map((cat) => ({
    '@type': 'MenuSection',
    name: cat,
    hasMenuItem: menuItems
      .filter((i) => i.category === cat)
      .map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description,
        offers: { '@type': 'Offer', price: item.price, priceCurrency: 'INR' },
        ...(item.isVeg ? { suitableForDiet: 'https://schema.org/VegetarianDiet' } : {}),
      })),
  })),
});

// ── Filters ───────────────────────────────────────────────────────────────────

const CUISINE_FILTERS: { value: Cuisine; label: string }[] = [
  { value: 'all', label: 'All Cuisines' },
  { value: 'north', label: 'North Indian' },
  { value: 'south', label: 'South Indian' },
];

const DIET_FILTERS: { value: DietFilter; label: string }[] = [
  { value: 'all', label: 'Veg & Non-Veg' },
  { value: 'veg', label: 'Veg Only' },
  { value: 'nonveg', label: 'Non-Veg Only' },
];

// ── Page ──────────────────────────────────────────────────────────────────────

const MenuPage = () => {
  const [loading, setLoading] = useState(true);
  const [cuisineFilter, setCuisineFilter] = useState<Cuisine>('all');
  const [dietFilter, setDietFilter] = useState<DietFilter>('all');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <MenuSkeleton />;

  const filteredItems = menuItems.filter((item) => {
    const matchesCuisine = cuisineFilter === 'all' || item.cuisine === cuisineFilter;
    const matchesDiet =
      dietFilter === 'all' ||
      (dietFilter === 'veg' && item.isVeg) ||
      (dietFilter === 'nonveg' && !item.isVeg);
    return matchesCuisine && matchesDiet;
  });

  const hasAnyItems = filteredItems.length > 0;

  return (
    <>
      <SEO
        title="Our Menu"
        description="Explore Maharaja's authentic Indian menu — starters, main course, breads, rice, desserts, and beverages from North & South Indian cuisines."
        canonicalPath="/menu"
        ogImage="https://images.unsplash.com/photo-1631452180519-c014fe946bc7?fm=webp&w=1200&h=630&fit=crop&q=80"
        ogType="restaurant.menu"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildMenuJsonLd()) }}
      />

      <div className="pt-20 min-h-screen bg-[#FFF8DC]">
        <div className="container-custom py-12">
          {/* Page header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Our Menu</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Authentic flavours from North and South India — crafted with love and the finest
              spices.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mb-8 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-[18px] h-[18px] border-2 border-green-600 rounded-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
              </span>
              Vegetarian
            </span>
            <span className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-[18px] h-[18px] border-2 border-red-600 rounded-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              </span>
              Non-Vegetarian
            </span>
            <span className="flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-[#7A5C00]" aria-hidden="true" />
              Chef's Special
            </span>
          </div>

          {/* Filters */}
          <div
            className="flex flex-wrap gap-3 mb-10 justify-center"
            role="group"
            aria-label="Filter menu items"
          >
            <div>
              <label htmlFor="cuisine-filter" className="sr-only">
                Filter by cuisine
              </label>
              <select
                id="cuisine-filter"
                className="px-4 py-2 rounded-full border border-[#D4AF37] bg-white text-sm focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                value={cuisineFilter}
                onChange={(e) => setCuisineFilter(e.target.value as Cuisine)}
              >
                {CUISINE_FILTERS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="diet-filter" className="sr-only">
                Filter by diet
              </label>
              <select
                id="diet-filter"
                className="px-4 py-2 rounded-full border border-[#D4AF37] bg-white text-sm focus:ring-2 focus:ring-[#7A5C00] focus:border-transparent"
                value={dietFilter}
                onChange={(e) => setDietFilter(e.target.value as DietFilter)}
              >
                {DIET_FILTERS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category sections */}
          {!hasAnyItems && (
            <p className="text-center text-gray-600 py-16" role="status">
              No items match your current filters.
            </p>
          )}

          {CATEGORY_ORDER.map((category) => {
            const items = filteredItems.filter((i) => i.category === category);
            if (items.length === 0) return null;
            return <MenuSection key={category} items={items} title={category} />;
          })}
        </div>
      </div>
    </>
  );
};

export default MenuPage;
