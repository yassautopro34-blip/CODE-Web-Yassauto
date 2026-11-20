import { CartProvider } from "@/components/shop/cart-context";
import { CartButton } from "@/components/shop/cart-button";

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <div className="pointer-events-none fixed right-3 top-[5.25rem] z-[60] sm:right-5">
        <CartButton className="pointer-events-auto" />
      </div>
    </CartProvider>
  );
}
