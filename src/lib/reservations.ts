export interface Reservation {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  date: string;
  time: string;
  guests: number;
  specialRequests: string | null;
  createdAt: string;
}

export type NewReservation = Omit<Reservation, 'id' | 'createdAt'>;

const STORAGE_KEY = 'maharaja_reservations';
const MAX_TABLES_PER_SLOT = 6;

const readAll = (): Reservation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Reservation[]) : [];
  } catch {
    return [];
  }
};

const writeAll = (reservations: Reservation[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
};

export const getReservations = (): Reservation[] =>
  readAll().sort((a, b) =>
    a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)
  );

export const isSlotAvailable = (date: string, time: string): boolean =>
  readAll().filter((r) => r.date === date && r.time === time).length < MAX_TABLES_PER_SLOT;

export const createReservation = (input: NewReservation): Reservation => {
  const reservation: Reservation = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  writeAll([...readAll(), reservation]);
  return reservation;
};

export const cancelReservation = (id: string): void => {
  writeAll(readAll().filter((r) => r.id !== id));
};
