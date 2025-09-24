import React, { useState, useRef } from "react";
import { HiChevronLeft, HiReply, HiCheck } from "react-icons/hi";
import { HiSquares2X2 } from "react-icons/hi2";
import { useUndoRedo } from "../../hooks/useUndoRedo";
import { useContentEditable } from "../../hooks/useContentEditable";
import { Link } from "react-router-dom";

export default function CrearEditNota() {
    const [isTituloFocused, setIsTituloFocused] = useState(false);
    const [isNotaFocused, setIsNotaFocused] = useState(false);

    const tituloRef = useRef(null);
    const notaRef = useRef(null);

    // Usar el hook de deshacer/rehacer
    const undoRedoHook = useUndoRedo({ titulo: "", nota: "" });

    // Usar el hook de contentEditable
    const {
        titulo,
        nota,
        canUndo,
        canRedo,
        handleTituloChange,
        handleNotaChange,
        handleTituloKeyDown,
        handleNotaKeyDown,
        handleUndoClick,
        handleRedoClick
    } = useContentEditable({ titulo: "", nota: "" }, undoRedoHook);

    return (
        <div className="h-[100svh] bg-white dark:bg-gray-800 min-h-0 min-w-0 overflow-hidden
                        flex flex-col">

            <div className="w-full fixed top-0 p-2
                            bg-white dark:bg-gray-800
                            z-10 min-h-0 min-w-0
                            flex flex-row items-center justify-between">

                <div className="flex flex-row items-center gap-2 flex-1 mr-4">
                    <Link to="/">
                        <HiChevronLeft className="text-xl md:text-2xl text-black dark:text-white cursor-pointer flex-shrink-0" />
                    </Link>

                    <div className="relative flex-1">
                        <div
                            ref={tituloRef}
                            contentEditable
                            suppressContentEditableWarning={true}
                            onInput={() => handleTituloChange(tituloRef)}
                            onFocus={() => setIsTituloFocused(true)}
                            onBlur={() => setIsTituloFocused(false)}
                            onKeyDown={(e) => handleTituloKeyDown(e, tituloRef, notaRef)}
                            className="text-base md:text-xl text-black dark:text-white
                                        outline-none border-none bg-transparent
                                        min-h-[1.5em] max-w-full overflow-hidden
                                        whitespace-nowrap text-ellipsis
                                        focus:whitespace-normal focus:text-ellipsis-none"
                            style={{
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word'
                            }}
                        />
                        {!titulo && !isTituloFocused && (
                            <div className="absolute top-0 left-0 pointer-events-none
                                            text-base md:text-xl text-gray-500 dark:text-gray-400">
                                Título
                            </div>
                        )}
                    </div>
                </div>

                <HiSquares2X2 className="text-2xl md:text-3xl text-black dark:text-white cursor-pointer flex-shrink-0" />
            </div>

            <div className="flex-shrink-0 h-11 lg:h-14"></div>

            <div className="w-[95%] mx-auto overflow-y-auto overflow-x-hidden min-h-0 min-w-0 pb-3 flex-1">

                <div className="relative p-2">
                    <div
                        ref={notaRef}
                        contentEditable
                        suppressContentEditableWarning={true}
                        onInput={() => handleNotaChange(notaRef)}
                        onFocus={() => setIsNotaFocused(true)}
                        onBlur={() => setIsNotaFocused(false)}
                        onKeyDown={(e) => handleNotaKeyDown(e, tituloRef, notaRef)}
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

            <div className="flex-shrink-0 h-11 lg:h-14"></div>

            <div className="fixed bottom-0 p-2 z-10 min-h-0 min-w-0 w-full
                            bg-blue-200 dark:bg-black
                            flex flex-row items-center justify-around">

                <div></div>

                <div className="flex flex-row items-center gap-6">
                    {/* Botón Deshacer */}
                    <HiReply
                        className={`text-xl md:text-2xl cursor-pointer transition-opacity
                                    ${canUndo
                                ? 'text-black dark:text-white hover:opacity-80'
                                : 'text-gray-600 dark:text-gray-500 cursor-not-allowed opacity-50'
                            }`}
                        onClick={canUndo ? () => handleUndoClick(tituloRef, notaRef) : undefined}
                        title="Deshacer (Ctrl+Z)"
                    />

                    {/* Botón Rehacer */}
                    <HiReply
                        className={`transform -scale-x-100 text-xl md:text-2xl cursor-pointer transition-opacity
                                    ${canRedo
                                ? 'text-black dark:text-white hover:opacity-80'
                                : 'text-gray-600 dark:text-gray-500 cursor-not-allowed opacity-50'
                            }`}
                        onClick={canRedo ? () => handleRedoClick(tituloRef, notaRef) : undefined}
                        title="Rehacer (Ctrl+Y)"
                    />
                </div>

                <HiCheck className="text-xl md:text-2xl text-black dark:text-white cursor-pointer" />

            </div>

        </div>
    );
}