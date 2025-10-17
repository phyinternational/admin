import { SheetTrigger, SheetContent, Sheet } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import clsx from 'clsx';
import {
    BadgePlusIcon,
    BoxesIcon,
    Building2Icon,
    Menu,
    PackageIcon,
    PackagePlusIcon,
    ShoppingCart,
    UserCog2Icon,
    UserPlus2Icon,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
type Props = {
    forMobile?: boolean;
};
const DashboardSideBar = ({ forMobile = false }: Props) => {
    return (
        <>
            <aside
                className={cn(
                    'fixed top-14  z-30 h-[calc(100vh-4rem)]  w-64 shrink-0 overflow-y-auto  px-2 py-8  md:fixed md:block',
                    forMobile ? '' : 'hidden border-r'
                )}
            >
                <div className="mb-6">
                    <h6 className="mb-2  px-4 text-sm uppercase tracking-wide  text-gray-500 ">
                        Main Menu
                    </h6>
                    <TabButton
                        name="Order Managment"
                        route="orders"
                        Icon={ShoppingCart}
                    />
                </div>
                <div className="mb-6">
                    <h6 className="mb-2  px-4 uppercase tracking-wide  text-gray-500 ">
                        Products
                    </h6>
                    <Link to={''}></Link>
                    <TabButton
                        route="/dashboard/products"
                        Icon={PackageIcon}
                        name="Product List"
                    />
                    <TabButton
                        route="/dashboard/products/new"
                        Icon={PackagePlusIcon}
                        name="Add Product"
                    />
                    <TabButton
                        route="/dashboard/category"
                        Icon={BoxesIcon}
                        name="Categories"
                    />
                </div>
                <div className="mb-6">
                    <h6 className="mb-2  px-4 uppercase tracking-wide  text-gray-500 ">
                        Manager
                    </h6>
                    <TabButton
                        route="/dashboard/manager"
                        Icon={UserCog2Icon}
                        name="Manager List"
                    />
                    <TabButton
                        route="/dashboard/manager/add"
                        Icon={UserPlus2Icon}
                        name="Add Managers"
                    />
                </div>
                <div className="mb-6">
                    <h6 className="mb-2  px-4 uppercase tracking-wide  text-gray-500 ">
                        Company
                    </h6>
                    <TabButton
                        route="/dashboard/company/add"
                        Icon={BadgePlusIcon}
                        name="Add Company"
                    />
                    <TabButton
                        route="/dashboard/company"
                        Icon={Building2Icon}
                        name="Company List"
                    />
                </div>
            </aside>
        </>
    );
};

export default DashboardSideBar;

export const TabButton = ({ Icon, name, route }: TabButtonProps) => {
    return (
        <NavLink
            to={route}
            className={({ isActive }) => clsx(isActive ? 'active group' : '')}
            end
        >
            <Button
                className="group-[.active]:bg-primary/10 group-[.active]:text-primary mb-2 flex w-full items-center justify-start gap-4 text-base font-semibold text-gray-500"
                variant="ghost"
            >
                <Icon /> <span>{name}</span>
            </Button>
        </NavLink>
    );
};

type TabButtonProps = {
    Icon: LucideIcon;
    name: string;
    route: string;
};

export const MobileDashboardSidebar = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button className="md:hidden" variant="outline">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side={'left'} className="w-72">
                <DashboardSideBar forMobile />
            </SheetContent>
        </Sheet>
    );
};