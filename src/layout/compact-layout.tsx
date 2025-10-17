import  { PropsWithChildren } from "react";

const CompactLayout = ({ children }: PropsWithChildren) => {
    return (
        <div>
            <div>AuthLayout</div>
            {children}
        </div>
    );
}
export default CompactLayout;