export type Cuisine = 'all' | 'north' | 'south';
export type SpiceFilter = 'all' | 'mild' | 'medium' | 'hot';
export type ItemSpiceLevel = 'mild' | 'medium' | 'hot';

export interface FilterableItem {
  cuisine: 'north' | 'south';
  spiceLevel: ItemSpiceLevel;
  isVeg: boolean;
}

export function filterByCuisine<T extends FilterableItem>(items: T[], cuisine: Cuisine): T[] {
  if (cuisine === 'all') return items;
  return items.filter((item) => item.cuisine === cuisine);
}

export function filterBySpiceLevel<T extends FilterableItem>(items: T[], spice: SpiceFilter): T[] {
  if (spice === 'all') return items;
  return items.filter((item) => item.spiceLevel === spice);
}

export function filterByDiet<T extends FilterableItem>(items: T[], vegOnly: boolean): T[] {
  return items.filter((item) => item.isVeg === vegOnly);
}

export function filterMenuItems<T extends FilterableItem>(
  items: T[],
  cuisine: Cuisine,
  spice: SpiceFilter
): T[] {
  return filterBySpiceLevel(filterByCuisine(items, cuisine), spice);
}
