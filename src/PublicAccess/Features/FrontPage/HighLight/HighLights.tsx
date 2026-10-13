import HighLightCard from './HighLightCard'
import { useHighPageData } from '../../../../hooks/useHighPageData'
import ErrorScreen from '../../../../ErrorBoundary/ErrorScreen'

const HighLights = () => {

    const { publicHigh, publicLoading, error} = useHighPageData()
    const data = publicHigh
    const countData = data.length
  if (error) {
    return (
      <div className='min-vh-100 d-flex w-100 p-3 mx-auto ms-3 flex-column'>
        <ErrorScreen />
      </div>
    );
  }
  return (
     <div className="container highstyles colorBack">
        <div className="p-3">
        {data.map((d, index) => (
            <HighLightCard
            key={d.id}
            item={d}
            count={countData}
            indexMap={index}
            isLoading={publicLoading}
            />
        ))}
        <svg
            width="0"
            height="0"
            aria-hidden="true"
            focusable="false"
            style={{ position: "absolute" }}
            >
            <defs>
                {/* Imagen situada a la izquierda: onda en el borde derecho */}
                <clipPath id="highlight-wave-right" clipPathUnits="objectBoundingBox">
                <path d="
                    M 0,0 H .88
                    C .99,.22 .98,.25 .98,.50
                    C .98,.70 .89,.80 .91,1
                    H 0 Z
                " />
                </clipPath>

                {/* Imagen situada a la derecha: onda en el borde izquierdo */}
                <clipPath id="highlight-wave-left" clipPathUnits="objectBoundingBox">
                <path d="
                    M 1,0 H .12
                    C .12,.22 .02,.25 .02,.50
                    C .02,.90 .11,.80 .09,1
                    H 1 Z
                " />
                </clipPath>
                {/* Amarillo detrás de la imagen situada a la izquierda */}
                <clipPath id="highlight-bg-right" clipPathUnits="objectBoundingBox">
                <path d="
                    M 0,0 H .91
                    C .99,.22 .93,.25 .95,.50
                    C .97,.75 .99,.80 .94,1
                    H 0 Z
                " />
                </clipPath>

                {/* Amarillo detrás de la imagen situada a la derecha */}
                <clipPath id="highlight-bg-left" clipPathUnits="objectBoundingBox">
                <path d="
                    M 1,0 H .09
                    C .01,.22 .07,.25 .05,.50
                    C .03,.75 .01,.80 .06,1
                    H 1 Z
                " />
                </clipPath>
            </defs>
            </svg>
        </div>
      </div>
  )
}

export default HighLights
