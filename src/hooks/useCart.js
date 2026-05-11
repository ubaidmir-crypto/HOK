import { useState, useMemo } from 'react';

export function useCart() {
  const [items, setItems] = useState([]);

  const add = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { id: product.id, name: product.name, price: Number(product.price_inr), qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
    );
  };

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);
  const has = (id) => items.some((i) => i.id === id);

  const count = useMemo(() => items.reduce((a, b) => a + b.qty, 0), [items]);
  const subtotal = useMemo(() => items.reduce((a, b) => a + b.price * b.qty, 0), [items]);

  return { items, add, updateQty, remove, clear, has, count, subtotal };
}