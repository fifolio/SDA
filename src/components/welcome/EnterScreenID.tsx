import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CheckCircle } from 'lucide-react'
import AnimatedGradientBackground from './AnimatedGradientBackground'
import useScreenId from '@/stores/useScreenId'
import LoadingState from "../ui/LoadingState"
import companyLogo from '@/assets/companyLogo.png'

export default function WelcomePage() {

    const {
        screenId,
        setScreenId,

        loadingState,
        setLoadingState,

        runGetScreenFunction,
        setRunGetScreenFunction,

        setIsAutoUpdate
    } = useScreenId();

    const handleSync = () => {
        setLoadingState(true);
        setRunGetScreenFunction(!runGetScreenFunction);
    }


    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <AnimatedGradientBackground />
            <div className="w-full max-w-md z-10">
                <Card className="w-full bg-white/80 backdrop-blur-sm shadow-lg">
                    <CardHeader className="space-y-3">
                        <div className="flex justify-center">
                            <img
                                src={companyLogo}
                                alt="SignCast Logo"
                                width={150}
                                height={50}
                            />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Sync, Display, Done.</p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-center text-gray-600 text-sm">
                            Sync your Screen and stay up-to-date with real-time updates. Just enter your Screen ID, hit sync, and you're good to go.
                        </p>
                        <div className="flex items-center justify-between">

                            {/* SCREEN ID INPUT */}
                            <div>
                                <label htmlFor="screenId" className="mb-2 block text-sm font-medium text-gray-700">
                                    Screen ID
                                </label>
                                <Input
                                    id="screenId"
                                    type="text"
                                    placeholder="Enter the eleven digits ID"
                                    value={screenId === null ? '' : screenId}
                                    disabled={loadingState}
                                    maxLength={11}
                                    onChange={(e) => setScreenId(e.target.value)}
                                    className='focus:!ring-transparent'
                                />
                            </div>

                            {/* Update Configs */}
                            <div>
                                <label htmlFor="screenId" className="mb-2 block text-sm font-medium text-gray-700">
                                    Updates Mechanism
                                </label>
                                <Select
                                    disabled={loadingState}
                                    defaultValue="automatically"
                                    onValueChange={(value) => setIsAutoUpdate(value === "automatically" ? true : false)}
                                >
                                    <SelectTrigger className="w-[200px] focus:!ring-transparent">
                                        <SelectValue placeholder="Choose how to handle updates" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="automatically">Automatically <span className="text-green-600 font-semibold">(Preferred)</span></SelectItem>
                                        <SelectItem value="manually">Manually</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between space-x-2">
                            {/* Sync Btn */}
                            <Button
                                disabled={screenId === null || screenId.trim().length < 11 || loadingState}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={handleSync}
                            >
                                {loadingState ? (
                                    <LoadingState setWidth="28" />
                                ) : (
                                    <span>
                                        Sync Screen
                                    </span>
                                )}
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-lg font-semibold text-gray-800">Key Features:</h2>
                            <ul className="space-y-1">
                                {['Real-time updates', 'Manual syncing', 'Seamless integration'].map((feature, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span className="text-gray-700 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                    <CardFooter className="text-center text-xs text-gray-500 mx-auto">
                        © {new Date().getFullYear()} SignCast Media Display Application v1. All rights reserved.
                    </CardFooter>
                </Card>
            </div>

        </div>
    )
}

