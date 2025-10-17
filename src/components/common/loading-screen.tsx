import { Loader2 } from 'lucide-react';

const LoadingScreen = () => {
    return (
        <div className="min-h-screen max-h-fit h-full w-full bg-gray-50 flex justify-center items-center">
            <Loader2 className="animate-spin" />
        </div>
    );
}

export default LoadingScreen;
