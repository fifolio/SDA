import { useState, useEffect } from 'react'
import { AnimatedGradientBackground } from '@/components'

const loadingMessages = [
    "Your experience is being prepared",
    "Just a moment, please",
    "We're getting things ready for you",
    "Please wait while we load your data",
    "Hold on, we're almost done",
    "Thank you for waiting",
    "Loading your content",
    "Fetching the latest updates",
    "Hang tight, we're almost there",
    "Setting things up for you",
    "We're on it, just a sec",
    "Almost ready",
    "Your request is being processed",
    "Getting everything in place",
    "Finalizing your experience",
    "Synchronizing your data",
    "Preparing your personalized experience",
    "Gathering the necessary information",
    "Almost finished",
    "Just a few more seconds"
];

export default function InitLoadingScreen() {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const intervalId = setInterval(() => {
            setIsVisible(false)
            setTimeout(() => {
                setCurrentMessageIndex((prevIndex) =>
                    (prevIndex + 1) % loadingMessages.length
                )
                setIsVisible(true)
            }, 500) // Wait for fade out before changing text
        }, 4500) // Change message every 3 seconds

        return () => clearInterval(intervalId)
    }, [])

    return (
        <>
            <AnimatedGradientBackground />
            <div className="flex items-center justify-center min-h-screen">
                <div
                    className={`
                        text-2xl font-semibold text-gray-700
                        transition-opacity duration-500 ease-in-out
                        ${isVisible ? 'opacity-100' : 'opacity-0'}
                        `}
                >
                    {loadingMessages[currentMessageIndex]}
                </div>
            </div>
        </>
    )
}

