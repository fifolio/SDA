import { useEffect, useRef } from 'react';
import Konva from 'konva';
import { useFileDetails, useLoadingScreen } from '@/stores';
import { Button } from '../ui/button';
import { getFile } from '@/backend/services/getFile';


export default function ScreenContent() {

    const stageRef = useRef<Konva.Stage | null>(null);

    const { fileDetails, setFileDetails, syncUpdates, setSyncUpdates } = useFileDetails();
    const { setLoadingScreen } = useLoadingScreen();


    useEffect(() => {
        if (fileDetails) {
            // Remove previous stage, if any
            if (stageRef.current) {
                stageRef.current.destroy();
            }

            // Recreate the stage from JSON data
            const stage = Konva.Node.create(fileDetails.fileData, 'container');
            stage.width(1920);
            stage.height(1080);

            // Load images and videos
            stage.find('Image').forEach((node: Konva.Image) => {
                const imageUrl = node.getAttr('imageUrl');
                const videoUrl = node.getAttr('videoUrl');

                if (imageUrl) {
                    const image = new window.Image();
                    image.src = imageUrl;
                    image.onload = () => {
                        node.image(image);
                        stage.batchDraw();
                    };
                }

                if (videoUrl) {
                    const video = document.createElement('video');
                    video.src = videoUrl;
                    video.crossOrigin = 'anonymous'; // Avoid CORS issues
                    video.loop = true;
                    video.muted = false; // Enable sound if required

                    // Function to handle smooth playback
                    const animate = () => {
                        if (!video.paused) {
                            node.getLayer()?.batchDraw();
                            requestAnimationFrame(animate);
                        }
                    };

                    // Play video on load
                    video.onloadeddata = () => {
                        node.image(video);
                        stage.batchDraw();
                        video.play(); // Ensure video starts playing
                        requestAnimationFrame(animate); // Start animation
                    };

                    // Add play/pause toggle
                    node.on('click', () => {
                        if (video.paused) {
                            video.play();
                            requestAnimationFrame(animate); // Restart animation loop
                        } else {
                            video.pause();
                        }
                    });
                }
            });

            // Make all objects non-draggable
            stage.find('Shape').forEach((node: Konva.Node) => {
                node.draggable(false);
            });

            stageRef.current = stage;
        }
    }, [fileDetails]);

    // handle Sync Updates buttons
    async function yesSyncUpdates() {
        setLoadingScreen(true)
        setSyncUpdates(false);
        const response = await getFile(fileDetails?.fileId);
        if (response) {
            setFileDetails(response)
            // Save the JSON file locally
            await window.electron.store.set('screenData', { ...response, isAutoUpdate: false });
            setLoadingScreen(false)
        }
    };

    function noDismiss() {
        setSyncUpdates(false);
    };

    return (
        <>
            {syncUpdates &&
                <div className="fixed top-0 left-0 z-50 w-full h-[50px] text-sm pl-5 space-x-3 bg-yellow-200 border-b-[1px] border-yellow-400 text-yellow-800 flex items-center">
                    <b className='uppercase'>New Updates Available</b>
                    <p>New updates are available for this screen. Would you like to sync them now?</p>
                    <Button variant="default" className="h-[35px]" onClick={yesSyncUpdates}>Yes, Sync Updates</Button>
                    <Button variant="destructive" className="h-[35px]" onClick={noDismiss}>No, Dismiss</Button>
                </div>
            }
            <div id="container" className="min-w-[1920px] min-h-[1080px] m-0 p-0"></div>
        </>
    );
}