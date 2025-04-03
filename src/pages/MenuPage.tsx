import React, { useState } from 'react';
import { ChefHat, Flame, Leaf } from 'lucide-react';

type Cuisine = 'all' | 'north' | 'south';
type DietaryFilter = 'all' | 'veg' | 'non-veg';
type SpiceLevel = 'all' | 'mild' | 'medium' | 'hot';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  cuisine: 'north' | 'south';
  category: string;
  isVeg: boolean;
  spiceLevel: 'mild' | 'medium' | 'hot';
  isChefSpecial?: boolean;
}

const menuItems: MenuItem[] = [
  // Vegetarian Items - North Indian
  {
    id: '1',
    name: 'Paneer Butter Masala',
    description: 'Cottage cheese cubes in rich tomato and cashew gravy',
    price: 280,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
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
    id: '4',
    name: 'Aloo Paratha',
    description: 'Stuffed whole wheat flatbread with spicy mashed potatoes',
    price: 80,
    image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2020/08/aloo-paratha-recipe.jpg',
    cuisine: 'north',
    category: 'Breads',
    isVeg: true,
    spiceLevel: 'medium',
  },

  // Vegetarian Items - South Indian
  {
    id: '2',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato mixture',
    price: 120,
    image: 'https://vismaifood.com/storage/app/uploads/public/8b4/19e/427/thumb__700_0_0_0_auto.jpg',
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
    image: 'https://media.istockphoto.com/id/1306083224/photo/idly-or-idli.jpg?s=612x612&w=0&k=20&c=cVpLEs4L3je0_zEFQ38BeZRjBLYQ1YGr9oTIdjhAbTY=',
    cuisine: 'south',
    category: 'Main Course',
    isVeg: true,
    spiceLevel: 'mild',
  },

  // Non-Vegetarian Items - North Indian
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

  // Non-Vegetarian Items - South Indian
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
    id: '10',
    name: 'Fish Fry',
    description: 'Crispy deep-fried fish marinated with South Indian spices',
    price: 280,
    image: 'https://palatesdesire.com/wp-content/uploads/2022/01/chettinad-fish-fry-recipe@palates-desire.jpg',
    cuisine: 'south',
    category: 'Starters',
    isVeg: false,
    spiceLevel: 'medium',
  },
];

const MenuPage = () => {
  const [cuisineFilter, setCuisineFilter] = useState<Cuisine>('all');
  const [spiceFilter, setSpiceFilter] = useState<SpiceLevel>('all');

  const filteredItems = menuItems.filter((item) => {
    const matchesCuisine = cuisineFilter === 'all' || item.cuisine === cuisineFilter;
    const matchesSpice = spiceFilter === 'all' || item.spiceLevel === spiceFilter;
    return matchesCuisine && matchesSpice;
  });

  const vegItems = filteredItems.filter(item => item.isVeg);
  const nonVegItems = filteredItems.filter(item => !item.isVeg);

  const SpiceLevelIndicator = ({ level }: { level: string }) => {
    const flames = {
      mild: 1,
      medium: 2,
      hot: 3,
    }[level] || 0;

    return (
      <div className="flex items-center gap-1">
        {Array(flames).fill(null).map((_, i) => (
          <Flame key={i} className="w-4 h-4 text-red-500" />
        ))}
      </div>
    );
  };

  const MenuSection = ({ items, title }: { items: MenuItem[], title: string }) => (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-6 text-[#8B4513]">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {item.isChefSpecial && (
                <div className="absolute top-4 right-4 bg-[#D4AF37] text-white px-3 py-1 rounded-full flex items-center gap-1">
                  <ChefHat className="w-4 h-4" />
                  <span className="text-sm">Chef's Special</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <span className="text-lg font-semibold">₹{item.price}</span>
              </div>

              <p className="text-gray-600 mb-4">{item.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Leaf className={`w-4 h-4 ${item.isVeg ? 'text-green-500' : 'text-red-500'}`} />
                    <span className="text-sm">{item.isVeg ? 'Veg' : 'Non-veg'}</span>
                  </div>
                  <SpiceLevelIndicator level={item.spiceLevel} />
                </div>
                <button className="btn-primary text-sm px-4 py-2">Order Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-[#FFF8DC]">
      <div className="container-custom py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">Our Menu</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <select
            className="px-4 py-2 rounded-full border border-[#D4AF37] bg-white"
            value={cuisineFilter}
            onChange={(e) => setCuisineFilter(e.target.value as Cuisine)}
          >
            <option value="all">All Cuisines</option>
            <option value="north">North Indian</option>
            <option value="south">South Indian</option>
          </select>

          <select
            className="px-4 py-2 rounded-full border border-[#D4AF37] bg-white"
            value={spiceFilter}
            onChange={(e) => setSpiceFilter(e.target.value as SpiceLevel)}
          >
            <option value="all">All Spice Levels</option>
            <option value="mild">Mild</option>
            <option value="medium">Medium</option>
            <option value="hot">Hot</option>
          </select>
        </div>

        {/* Menu Sections */}
        {vegItems.length > 0 && <MenuSection items={vegItems} title="Vegetarian Delights" />}
        {nonVegItems.length > 0 && <MenuSection items={nonVegItems} title="Non-Vegetarian Specialties" />}
      </div>
    </div>
  );
};

export default MenuPage;