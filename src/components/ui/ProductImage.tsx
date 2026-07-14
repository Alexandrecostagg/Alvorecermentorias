import { useEffect, useMemo, useState, type ImgHTMLAttributes } from 'react'
import { publicMedia } from '../../lib/media'

type ProductImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
}

export default function ProductImage({ src, alt, onError, ...props }: ProductImageProps) {
  const resolvedSource = useMemo(() => publicMedia(src), [src])
  const fallbackSource = useMemo(() => publicMedia('/logo-alvorecer.png'), [])
  const [currentSource, setCurrentSource] = useState(resolvedSource)

  useEffect(() => {
    setCurrentSource(resolvedSource)
  }, [resolvedSource])

  return (
    <img
      {...props}
      src={currentSource}
      alt={alt}
      loading={props.loading ?? 'lazy'}
      decoding={props.decoding ?? 'async'}
      onError={(event) => {
        if (currentSource !== fallbackSource) setCurrentSource(fallbackSource)
        onError?.(event)
      }}
    />
  )
}
