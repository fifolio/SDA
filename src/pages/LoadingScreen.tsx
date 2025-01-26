import { AnimatedGradientBackground } from "@/components";
import loading from '@/assets/loading.gif';


export default function LoadingScreen() {
    return (
        <>
            <AnimatedGradientBackground />
            <div className="w-full h-screen flex justify-center items-center">
                <div className="flex-col text-center">
                    <img src={loading} alt="Loading, please wait..." width="60" className="mx-auto" />
                    <p className="text-sm font-semibold mt-3 text-gray-500">Please Wait</p>
                </div>
            </div>
        </>

    )
}