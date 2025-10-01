import React, { forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setIsNotaFocused } from "../../store/layoutSlice";

const CuerpoEdicion = forwardRef(({ handleNotaChange, handleNotaKeyDown }, notaRef) => {
    const dispatch = useDispatch();
    const { isNotaFocused, nota } = useSelector((state) => state.layout);

    const handleFocus = () => {
        dispatch(setIsNotaFocused(true));
    };

    const handleBlur = () => {
        dispatch(setIsNotaFocused(false));
    };

    return (
        <div className="w-[95%] mx-auto overflow-y-auto overflow-x-hidden min-h-0 min-w-0 pb-3 flex-1">
            <div className="relative p-2">
                <div
                    ref={notaRef}
                    contentEditable
                    suppressContentEditableWarning={true}
                    onInput={() => handleNotaChange(notaRef)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={(e) => handleNotaKeyDown(e, notaRef)}
                    className="text-base md:text-xl text-black dark:text-white
                                outline-none border-none bg-transparent
                                min-h-[1.5em] w-full
                                whitespace-pre-wrap"
                    style={{
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        lineHeight: '1.5'
                    }}
                />
                {!nota && !isNotaFocused && (
                    <div className="absolute top-2 left-2 pointer-events-none
                                    text-base md:text-xl text-gray-500 dark:text-gray-400">
                        Nota
                    </div>
                )}
            </div>
        </div>
    );
});

CuerpoEdicion.displayName = 'CuerpoEdicion';

export default CuerpoEdicion;