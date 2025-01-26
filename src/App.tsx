import { useEffect, useState } from "react";

// UI
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "./hooks/use-toast";

// PAGES
import { InitLoadingScreen, LoadingScreen, ScreenPage, WelcomePage } from "./pages";

// SERVICES
import { client } from "./backend/configs/configs";
import { getFile } from "./backend/services/getFile";

// STORES
import { useFileDetails, useLoadingScreen } from "./stores";
import useScreenId from "./stores/useScreenId";


export default function Home() {

  const { loadingScreen } = useLoadingScreen();
  const [initLoadingScreen, setInitLoadingScreen] = useState(true);
  const { toast } = useToast();

  // Get the screen ID from welcome page input
  const { screenId, setScreenId, setLoadingState, runGetScreenFunction, isAutoUpdate } = useScreenId();

  // Store the file details
  const { fileDetails, setFileDetails, setSyncUpdates } = useFileDetails();

  // Update the file details
  const [isScreenUpdated, setIsScreenUpdated] = useState(false);


  async function getFileFromDatabase() {
    const response = await getFile(screenId as string);

    if (!response) {
      if (screenId != null) {
        toast({
          variant: "destructive",
          title: "Offline Mode or Invalid Screen ID Detected",
          description: "It seems there’s an issue. Either you're offline, which prevents syncing and retrieving screen data from the SignCast Media database, or the Screen ID you entered is invalid or does not exist. Please connect to the internet and double-check the Screen ID. If the problem persists, contact the SignCast Media support team for assistance."
        })
      }
      setFileDetails(null)
      setInitLoadingScreen(false)
      setLoadingState(false)
    } else if (response) {
      setScreenId(null)
      setFileDetails(response)
      setInitLoadingScreen(false)

      // Save the JSON file locally
      await window.electron.store.set('screenData', { ...response, isAutoUpdate: isAutoUpdate });

      setLoadingState(false)
    }
  }


  // Check if there's a file in the local storage  
  async function getFileFromLocalStorage() {
    const screenData = await window.electron.store.get('screenData');
    return screenData
  };

  useEffect(() => {
    getFileFromLocalStorage().then((res) => {
      if (res === undefined) {
        setFileDetails(null)
        getFileFromDatabase();
      } else {
        setScreenId(null)
        setFileDetails(res)
        setInitLoadingScreen(false)
        setLoadingState(false)
      }
    })
  }, [runGetScreenFunction]);


  // Listen for the Ctrl+N key combination, delete the data using electron-store, and reload the page
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'n' || event.key === 'N') {
        await window.electron.store.delete('screenData');
        window.location.reload();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  // Track Updates
  useEffect(() => {
    client.subscribe(`databases.${import.meta.env.VITE_DATABASES_MAIN}.collections.${import.meta.env.VITE_COLL_DISP}.documents.${fileDetails?.$id as string}`, (response) => {
      if (response.payload) {
        setIsScreenUpdated(true);
      } else {
        setIsScreenUpdated(false);
      }
      console.clear();
    })
  }, [fileDetails]);


  // Handle Screen Updates
  useEffect(() => {
    const handleScreenUpdate = async () => {
      try {
        if (!isScreenUpdated) return;

        const res = await getFileFromLocalStorage();

        if (res.isAutoUpdate) {
          setLoadingState(true);
          const response = await getFile(fileDetails?.fileId);

          if (response) {
            // Save the JSON file locally
            await window.electron.store.set('screenData', { ...response, isAutoUpdate: isAutoUpdate });

            setScreenId(null);
            setFileDetails(response);
            setInitLoadingScreen(false);
            setLoadingState(false);
          }
        } else {
          setSyncUpdates(true);
        }

        setIsScreenUpdated(false);
      } catch (error) {
        console.error('Error updating screen:', error);
      }
    };

    handleScreenUpdate();
  }, [isScreenUpdated]);


  if (initLoadingScreen) return (<InitLoadingScreen />)
  if (loadingScreen) return (<LoadingScreen />)

  if (fileDetails === null) {
    return (
      <>
        <WelcomePage />
        <Toaster />
      </>
    )
  } else {
    return (
      <>
        <ScreenPage />
        <Toaster />
      </>
    )
  }
}