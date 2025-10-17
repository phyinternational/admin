type Props = {
    children: React.ReactNode;
    grid?: boolean;
};

const Container = ({ children, grid = false }: Props) => {
    if (grid) return (
        <div className="max-[1536px] min-h-screen mx-auto w-full grid md:grid-cols-12 sm:grid-cols-8 grid-cols-4 gap-6">
            {children}
        </div>
    )

    return <div className="max-[1536px] mx-auto">
        {children}
    </div>
}

export default Container;   