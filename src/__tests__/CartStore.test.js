// STAGE 5: Frontend tests
import { renderHook, act } from '@testing-library/react';
import useCartStore from '@/store/useCartStore';

const mockProduct = { id: '1', name: 'Test Dress', price: '29.99', department: 'women', slug: 'test-dress' };

describe('Cart Store', () => {
  beforeEach(() => { useCartStore.setState({ items: [] }); });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore());
    act(() => { result.current.addItem(mockProduct, { size: 'M' }); });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.getItemCount()).toBe(1);
  });

  it('should increment quantity for existing item', () => {
    const { result } = renderHook(() => useCartStore());
    act(() => { result.current.addItem(mockProduct, { size: 'M' }); result.current.addItem(mockProduct, { size: 'M' }); });
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('should calculate subtotal correctly', () => {
    const { result } = renderHook(() => useCartStore());
    act(() => { result.current.addItem(mockProduct, { size: 'M' }); });
    expect(result.current.getSubtotal()).toBeCloseTo(29.99);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCartStore());
    act(() => { result.current.addItem(mockProduct, { size: 'M' }); });
    const key = result.current.items[0].key;
    act(() => { result.current.removeItem(key); });
    expect(result.current.items).toHaveLength(0);
  });

  it('should clear entire cart', () => {
    const { result } = renderHook(() => useCartStore());
    act(() => { result.current.addItem(mockProduct, { size: 'S' }); result.current.addItem(mockProduct, { size: 'L' }); });
    act(() => { result.current.clearCart(); });
    expect(result.current.items).toHaveLength(0);
  });
});
