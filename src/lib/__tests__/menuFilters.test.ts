import { describe, it, expect } from 'vitest';
import {
  filterByCuisine,
  filterBySpiceLevel,
  filterByDiet,
  filterMenuItems,
  type FilterableItem,
} from '../menuFilters';

const items: FilterableItem[] = [
  { cuisine: 'north', spiceLevel: 'mild', isVeg: true },
  { cuisine: 'north', spiceLevel: 'medium', isVeg: false },
  { cuisine: 'north', spiceLevel: 'hot', isVeg: false },
  { cuisine: 'south', spiceLevel: 'mild', isVeg: true },
  { cuisine: 'south', spiceLevel: 'medium', isVeg: true },
  { cuisine: 'south', spiceLevel: 'hot', isVeg: false },
];

describe('filterByCuisine', () => {
  it('returns all items when cuisine is "all"', () => {
    expect(filterByCuisine(items, 'all')).toHaveLength(6);
  });

  it('returns only north-Indian items', () => {
    const result = filterByCuisine(items, 'north');
    expect(result).toHaveLength(3);
    expect(result.every((i) => i.cuisine === 'north')).toBe(true);
  });

  it('returns only south-Indian items', () => {
    const result = filterByCuisine(items, 'south');
    expect(result).toHaveLength(3);
    expect(result.every((i) => i.cuisine === 'south')).toBe(true);
  });

  it('returns empty array when no items match', () => {
    expect(filterByCuisine([], 'north')).toHaveLength(0);
  });
});

describe('filterBySpiceLevel', () => {
  it('returns all items when spice is "all"', () => {
    expect(filterBySpiceLevel(items, 'all')).toHaveLength(6);
  });

  it('returns only mild items', () => {
    const result = filterBySpiceLevel(items, 'mild');
    expect(result).toHaveLength(2);
    expect(result.every((i) => i.spiceLevel === 'mild')).toBe(true);
  });

  it('returns only medium items', () => {
    const result = filterBySpiceLevel(items, 'medium');
    expect(result).toHaveLength(2);
    expect(result.every((i) => i.spiceLevel === 'medium')).toBe(true);
  });

  it('returns only hot items', () => {
    const result = filterBySpiceLevel(items, 'hot');
    expect(result).toHaveLength(2);
    expect(result.every((i) => i.spiceLevel === 'hot')).toBe(true);
  });
});

describe('filterByDiet', () => {
  it('returns vegetarian items', () => {
    const result = filterByDiet(items, true);
    expect(result).toHaveLength(3);
    expect(result.every((i) => i.isVeg)).toBe(true);
  });

  it('returns non-vegetarian items', () => {
    const result = filterByDiet(items, false);
    expect(result).toHaveLength(3);
    expect(result.every((i) => !i.isVeg)).toBe(true);
  });
});

describe('filterMenuItems', () => {
  it('returns all items when both filters are "all"', () => {
    expect(filterMenuItems(items, 'all', 'all')).toHaveLength(6);
  });

  it('combines cuisine and spice filters correctly', () => {
    const result = filterMenuItems(items, 'north', 'mild');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ cuisine: 'north', spiceLevel: 'mild' });
  });

  it('returns empty array when no items match combined filters', () => {
    expect(filterMenuItems(items, 'south', 'hot').length).toBeGreaterThan(0);
    // south + hot exists (index 5), but south + non-existent combo:
    const southHot = filterMenuItems(items, 'south', 'hot');
    expect(southHot.every((i) => i.cuisine === 'south' && i.spiceLevel === 'hot')).toBe(true);
  });

  it('chains filters without mutating original array', () => {
    filterMenuItems(items, 'north', 'mild');
    expect(items).toHaveLength(6);
  });
});
