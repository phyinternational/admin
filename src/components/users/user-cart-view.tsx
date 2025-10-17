import { useParams } from "react-router";
import LoadingScreen from "../common/loading-screen";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCart } from "@/lib/react-query/user-query";
import { Cart } from "./cart";

const CartView = () => {
  const { id } = useParams();
  const { isLoading, data } = useGetCart(String(id));

  if (isLoading) return <LoadingScreen />;

  // Normalize response shapes: react-query `data` may be the axios response
  const raw: any = data ?? {};
  const cart: Cart = (raw?.data?.data ?? raw?.data ?? raw ?? {}) as Cart;

  const products = Array.isArray(cart.products) ? cart.products : [];

  const total = products.reduce((acc, product) => {
    // Prefer salePrice from product snapshot, fallback to variant price if available
    const price = product?.productId?.salePrice ?? product?.varientId?.price ?? 0;
    const qty = product?.quantity ?? 1;
    return acc + price * qty;
  }, 0);


  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">View Cart</h1>
      <section className="p-4 mt-8 bg-white flex flex-col  rounded-md">
        <h1 className="text-lg font-semibold mb-4">Products</h1>
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, i) => {
              const img = product?.productId?.productImageUrl?.[0];
              const title = product?.productId?.productTitle ?? "N/A";
              const qty = product?.quantity ?? 0;
              const price = product?.productId?.salePrice ?? product?.varientId?.price ?? 0;

              return (
                <TableRow key={i}>
                  <TableCell>
                    {img ? (
                      <img
                        src={img}
                        alt={title}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-[48px] h-[48px] bg-gray-100 rounded-md" />
                    )}
                  </TableCell>
                  <TableCell>{title}</TableCell>
                  <TableCell>{qty}</TableCell>
                  <TableCell>₹{price.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell>
                <span className="text-sm font-semibold">₹ {total.toLocaleString('en-IN')}</span>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    </div>
  );
};

export default CartView;
