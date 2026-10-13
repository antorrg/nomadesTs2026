import { useState } from 'react'
import DOMPurify from "dompurify"
import LoadingImage from "../../../../components/LoadingImages/LoadingImage"
import { type IHightLight } from "../../../../types/hightLight"

type HighLightCardProps = {
    item: IHightLight,
    indexMap: number
    count: number
    isLoading: boolean
}

const HighLightCard = ({item, indexMap, count, isLoading}:HighLightCardProps) => {
  const [zoomedImg, setZoomedImg] = useState<string | null>(null);
  const imageOnLeft = indexMap % 2 === 0;
  return (

          <div >
          <div
                className={`highlight-row ${
                    imageOnLeft ? 'highlight-text-right' : 'highlight-text-left'
                }`}
                >
            <div className="highlight-media">
            <div
            className={`highstyles-img-wrapper ${
                imageOnLeft
                ? 'highstyles-wave-right'
                : 'highstyles-wave-left'
            }`}
            >
            {isLoading ? (
                <LoadingImage className="bd-placeholder-img" />
            ) : (
                <img
                src={item.picture}
                alt={item.title}
                width={600}
                height={400}
                loading="lazy"
                decoding="async"
                onClick={() => item.picture && setZoomedImg(item.picture)}
                />
            )}
            </div>
        </div>

        <div className="highlight-content">
          {item.showTitle?
            <h2 className="featurette-heading fw-semi-bold lh-1 mb-4">
            {item.title}
            </h2>
            :  null
            }
            <div
            className="lead rich-text-content"
            dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(item.text || '', {
                FORBID_ATTR: ['style'],
                }),
            }}
            />
        </div>
        </div>
            {indexMap < count - 1 && <hr className="featurette-divider" />}

    {/* Lightbox / Overlay para las imágenes */}
    {zoomedImg && (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'zoom-out'
        }}
        onClick={() => setZoomedImg(null)}
      >
        <img 
          src={zoomedImg} 
          alt="Imagen Ampliada" 
          style={{
            maxWidth: '90%',
            maxHeight: '90%',
            objectFit: 'contain',
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            borderRadius: '8px'
          }} 
        />
      </div>
    )}
    </div> 
  )
}

export default HighLightCard
