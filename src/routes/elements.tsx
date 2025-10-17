import { Suspense, ComponentType, ReactElement, lazy } from 'react';
import LoadingScreen from '@/components/common/loading-screen';

// ----------------------------------------------------------------------

const Loadable = <T extends object>(Component: ComponentType<T>) => {

  const LoadableComponent = (props: T): ReactElement => (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

  return LoadableComponent;
};


// ----------------------------------------------------------------------

export const Page404 = Loadable(lazy(() => import('@/pages/404')));
export const LoginPage = Loadable(lazy(() => import('@/pages/auth/login')));

//Dashboard Pages ------------------------------------------------------------
export const DashboardAppPage = Loadable(lazy(() => import('@/pages/dashboard/app')));
export const AddProductPage = Loadable(lazy(() => import('@/pages/dashboard/add-product')));
export const ProductRatingPage = Loadable(lazy(() => import('@/pages/dashboard/product-rating')));


export const DashboardLayout = Loadable(lazy(() => import("@/layout/dashboard-layout")));
export const CompactLayout = Loadable(lazy(() => import("@/layout/compact-layout")));
export const ProductListPage = Loadable(lazy(() => import("@/pages/dashboard/product-list")));
export const UploadProducts = Loadable(lazy(() => import("@/components/products/upload-products")));
export const AddCategory = Loadable(lazy(() => import("@/pages/dashboard/category/add-category")));
export const CategoryList = Loadable(lazy(() => import("@/components/category/category-list")));
export const UsersList = Loadable(lazy(() => import("@/components/users/users-list")));
export const BlogsList = Loadable(lazy(() => import("@/components/blogs/blog-list")));
export const ColorList = Loadable(lazy(() => import("@/components/colors/color-list")));
export const AddColorForm = Loadable(lazy(() => import("@/components/colors/add-color-form")));
export const EditColorForm = Loadable(lazy(() => import("@/components/colors/edit-color-form")));
export const CategoryPage = Loadable(lazy(() => import("@/components/category/category-page")));
export const EditCategoryForm = Loadable(lazy(() => import("@/components/category/edit-category-form")));
export const ProductVariantList = Loadable(lazy(() => import("@/components/product-variant/product-variant-list")));
export const AddProductVariant = Loadable(lazy(() => import("@/components/product-variant/add-product-variant")));
export const UpdateProductVariant = Loadable(lazy(() => import("@/components/product-variant/update-product-variant")));
export const OrdersList = Loadable(lazy(() => import("@/components/order/order-list")));
export const OrderView = Loadable(lazy(() => import("@/components/order/order-view")));
export const CouponsList = Loadable(lazy(() => import("@/components/coupons/coupon-list")));
export const AddCouponForm = Loadable(lazy(() => import("@/components/coupons/add-coupon")));
export const CartView = Loadable(lazy(() => import("@/components/users/user-cart-view")));
export const AddBlogForm = Loadable(lazy(() => import("@/components/blogs/add-blog-form")));
export const UpdateProductImage = Loadable(lazy(() => import("@/components/product-variant/update-product-image")));
export const UpdateProductForm = Loadable(lazy(() => import("@/components/products/update-product-form")));
export const UpdateBlogForm = Loadable(lazy(() => import("@/components/blogs/update-blog-form")));
export const BrandsList = Loadable(lazy(() => import("@/components/brand/brand-list")));
export const UpdateBrandForm = Loadable(lazy(() => import("@/components/brand/update-brand-form")));
export const AddBrandForm = Loadable(lazy(() => import("@/components/brand/add-brand-form")));
export const EditCouponForm = Loadable(lazy(() => import("@/components/coupons/edit-coupon")));
export const BannersList = Loadable(lazy(() => import("@/components/banner/banner-list")));
export const AddBannerForm = Loadable(lazy(() => import("@/components/banner/add-banner-form")));
export const UpdateBannerForm = Loadable(lazy(() => import("@/components/banner/update-banner-form")));
export const NoticationPage = Loadable(lazy(() => import("@/components/notifications")));
export const WebSettingsForm = Loadable(lazy(() => import("@/pages/dashboard/web-settings")));
