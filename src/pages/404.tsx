import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
const Custom404 = () => {
    return (
        <>
            <main className="h-screen flex flex-col justify-center items-start pt-20 relative w-full overflow-hidden bg-limestone">
                <div className="flex w-full relative flex-col gap-6 z-20 justify-center font-semibold items-center text-center text-primary">
                    <div className="w-72 h-72 ">
                        <img
                            style={{ objectFit: "cover" }}
                            src={"/assets/images/404.svg"}
                            alt={"sinai-404"}
                        />
                    </div>
                    <h1 className="text-4xl">Looks like you are lost.</h1>
                    <div className="flex gap-6 justify-center">
                        <Link to={'/'}>
                            <Button variant={"secondary"} className="flex gap-3">
                                Back to Home <ArrowUpRight className="w-6 h-6" />{" "}
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    )
}


export default Custom404
