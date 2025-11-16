import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Skeleton que replica exactamente la estructura de Cabecera + CuerpoEdicion
 * para que ocupe el mismo espacio visual
 */
export default function SkeletonCrearEditPrevia() {
  return (
    <>
      {/* ========== SKELETON CABECERA ========== */}
      <div className="flex-shrink-0 z-10 min-h-0 min-w-0 py-1 overflow-hidden">
        <div className="w-[95%] mx-auto flex flex-col gap-2">

          {/* Fila de iconos superior */}
          <div className="flex flex-row items-center justify-between py-2">
            <Skeleton
              circle
              height={32}
              width={32}
              baseColor="var(--skeleton-base)"
              highlightColor="var(--skeleton-highlight)"
            />
            
            <div className="flex flex-row items-center gap-3">
              <Skeleton
                circle
                height={32}
                width={32}
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
              />
              <Skeleton
                circle
                height={32}
                width={32}
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
              />
              <Skeleton
                circle
                height={32}
                width={32}
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
              />
            </div>
          </div>

          {/* Fila de Estado y Fecha */}
          <div className="p-1 flex flex-row items-center justify-between">
            <Skeleton
              height={20}
              width="35%"
              baseColor="var(--skeleton-base)"
              highlightColor="var(--skeleton-highlight)"
            />
            
            <div className="flex flex-col items-center gap-1">
              <Skeleton
                height={16}
                width={120}
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
              />
              <Skeleton
                height={16}
                width={140}
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
              />
            </div>
          </div>

          {/* Título */}
          <div className="w-full p-1">
            <Skeleton
              height={28}
              width="60%"
              baseColor="var(--skeleton-base)"
              highlightColor="var(--skeleton-highlight)"
            />
          </div>

        </div>
      </div>

      {/* ========== SKELETON CUERPO EDICION ========== */}
      <div className="w-[95%] mx-auto overflow-y-auto overflow-x-hidden min-h-0 min-w-0 flex-1">
        <div className="p-2 flex flex-col gap-4">
          {/* Líneas de texto simulando el contenido de la nota */}
          <Skeleton
            height={24}
            width="85%"
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
          />
          <Skeleton
            height={24}
            width="92%"
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
          />
          <Skeleton
            height={24}
            width="78%"
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
          />
          <Skeleton
            height={24}
            width="88%"
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
          />
          <Skeleton
            height={24}
            width="70%"
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
          />
          <Skeleton
            height={24}
            width="90%"
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
          />
          <Skeleton
            height={24}
            width="82%"
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
          />
          <Skeleton
            height={24}
            width="75%"
            baseColor="var(--skeleton-base)"
            highlightColor="var(--skeleton-highlight)"
          />
          
          {/* Simular algunas tareas */}
          <div className="mt-4 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <Skeleton
                circle
                height={20}
                width={20}
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
              />
              <Skeleton
                height={20}
                width="70%"
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
              />
            </div>
            <div className="flex items-start gap-3">
              <Skeleton
                circle
                height={20}
                width={20}
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
              />
              <Skeleton
                height={20}
                width="65%"
                baseColor="var(--skeleton-base)"
                highlightColor="var(--skeleton-highlight)"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}