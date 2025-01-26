import loadingGif from '@/assets/loading.gif'

export default function LoadingState({ setWidth }: { setWidth: string }) {
  return (
    <img src={loadingGif} width={setWidth} />
  )
}
