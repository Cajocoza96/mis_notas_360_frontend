import React from "react";

import { useLocation, Link } from "react-router-dom";

import infoTerminosPoliticas from "../../../data/infoTerminosPoliticas.json";

export default function Cuerpo() {

    const infoMisNotas360 = infoTerminosPoliticas.seccionTerminosPoliticas;

    const inforTerminosServicio = infoTerminosPoliticas.terminosDeServicio;
    const inforPoliticaPrivacidad = infoTerminosPoliticas.politicaDePrivacidad;
    const inforEliminarCuenta = infoTerminosPoliticas.eliminarCuenta;
    const inforProbleConocidos = infoTerminosPoliticas.problemasConocidos;

    const location = useLocation();

    const esTerminoDeServicio = location.pathname === "/terminos-de-servicio";

    const esPoliticaDePrivacidad = location.pathname === "/politica-de-privacidad";

    const esInfoEliminarCuenta = location.pathname === "/informacion-eliminar-cuenta";

    const esProblemasConocidos = location.pathname === "/problemas-conocidos";

    return (
        <div className="w-[95%] mx-auto p-2
                        text-black dark:text-white 
                        overflow-x-hidden min-h-0 min-w-0
                        flex flex-col justify-between gap-3">

            <div className="flex flex-col gap-1">
                <p className="text-lg md:text-xl font-semibold text-center" translate="no">
                    {infoMisNotas360.texto4MisNotas360}
                </p>
                <p className="text-sm md:text-base text-center">
                    {infoMisNotas360.texto7Fecha}
                </p>
            </div>

            {/*Esto es para Terminos de servicio*/}
            {esTerminoDeServicio && (
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforTerminosServicio.texto1}
                        </p>
                        <p className="text-base md:text-lg">
                            <span>{inforTerminosServicio.texto2} <span translate="no">{infoMisNotas360.texto4MisNotas360}</span> {inforTerminosServicio.texto3}</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforTerminosServicio.texto4}
                        </p>
                        <p className="text-base md:text-lg">
                            <span> <span translate="no">{infoMisNotas360.texto4MisNotas360}</span> {inforTerminosServicio.texto5}</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div>
                            <p className="text-base md:text-lg font-semibold">
                                <span>{inforTerminosServicio.texto6} <span translate="no">{infoMisNotas360.texto4MisNotas360}</span> </span>
                            </p>
                            <p className="text-base md:text-lg">
                                {inforTerminosServicio.texto7}
                            </p>
                        </div>

                        <div>
                            <ul className="list-disc list-inside text-base md:text-lg">
                                <li>{inforTerminosServicio.texto8}</li>
                                <li>{inforTerminosServicio.texto8_1}</li>
                                <li>{inforTerminosServicio.texto8_2}</li>
                                <li>{inforTerminosServicio.texto9}</li>
                                <li>{inforTerminosServicio.texto10}</li>
                                <li>{inforTerminosServicio.texto11}</li>
                                <li>{inforTerminosServicio.texto12}</li>
                                <li>{inforTerminosServicio.texto13}</li>
                                <li>{inforTerminosServicio.texto14}</li>
                                <li>{inforTerminosServicio.texto15}</li>
                                <li>{inforTerminosServicio.texto16}</li>
                                <li>{inforTerminosServicio.texto17}</li>
                                <li>{inforTerminosServicio.texto18}</li>
                                <li>{inforTerminosServicio.texto19}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforTerminosServicio.texto20}
                        </p>
                        <p className="text-base md:text-lg">
                            {inforTerminosServicio.texto21}
                        </p>

                        <div>
                            <ul className="list-disc list-inside text-base md:text-lg">
                                <li>{inforTerminosServicio.texto22}</li>
                                <li>{inforTerminosServicio.texto23}</li>
                                <li>{inforTerminosServicio.texto24}</li>
                                <li>{inforTerminosServicio.texto25}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforTerminosServicio.texto26}
                        </p>
                        <p className="text-base md:text-lg">
                            <span>{inforTerminosServicio.texto27} <span translate="no">{infoMisNotas360.texto4MisNotas360}</span> {inforTerminosServicio.texto28}</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforTerminosServicio.texto29}
                        </p>
                        <p className="text-base md:text-lg">
                            <span> <span translate="no">{infoMisNotas360.texto4MisNotas360}</span> {inforTerminosServicio.texto30}</span>
                        </p>

                        <div>
                            <ul className="list-disc list-inside text-base md:text-lg">
                                <li>{inforTerminosServicio.texto31}</li>
                                <li>{inforTerminosServicio.texto32}</li>
                                <li>{inforTerminosServicio.texto33}</li>
                            </ul>
                        </div>

                        <p className="text-base md:text-lg">
                            {inforTerminosServicio.texto34}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforTerminosServicio.texto35}
                        </p>
                        <p className="text-base md:text-lg">
                            {inforTerminosServicio.texto36}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforTerminosServicio.texto37}
                        </p>
                        <p className="text-base md:text-lg">
                            <span>{inforTerminosServicio.texto38} <span className="font-semibold" translate="no">{infoMisNotas360.texto10Correo}</span> </span>
                        </p>
                    </div>
                </div>
            )}

            {/*Esto es para Politicas de privacidad*/}
            {esPoliticaDePrivacidad && (
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto1}
                        </p>
                        <p className="text-base md:text-lg">
                            <span>{inforPoliticaPrivacidad.texto2} <span translate="no">{infoMisNotas360.texto4MisNotas360}</span> {inforPoliticaPrivacidad.texto3}</span>
                        </p>
                    </div>

                    <div>
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto4}
                        </p>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <p className="text-base md:text-lg font-semibold">
                                    {inforPoliticaPrivacidad.texto5}
                                </p>
                                <p className="text-base md:text-lg">
                                    {inforPoliticaPrivacidad.texto6}
                                </p>

                                <div>
                                    <ul className="list-disc list-inside text-base md:text-lg">
                                        <li>{inforPoliticaPrivacidad.texto7}</li>
                                        <li>{inforPoliticaPrivacidad.texto8}</li>
                                        <li>{inforPoliticaPrivacidad.texto9}</li>
                                    </ul>
                                </div>

                            </div>


                            <div className="flex flex-col gap-1">
                                <p className="text-base md:text-lg font-semibold">
                                    {inforPoliticaPrivacidad.texto10}
                                </p>
                                <div>
                                    <ul className="list-disc list-inside text-base md:text-lg">
                                        <li>{inforPoliticaPrivacidad.texto11}</li>
                                        <li>{inforPoliticaPrivacidad.texto12}</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="text-base md:text-lg font-semibold">
                                    {inforPoliticaPrivacidad.texto13}
                                </p>
                                <p className="text-base md:text-lg">
                                    {inforPoliticaPrivacidad.texto14}
                                </p>

                                <div>
                                    <ul className="list-disc list-inside text-base md:text-lg">
                                        <li>{inforPoliticaPrivacidad.texto15}</li>
                                        <li>{inforPoliticaPrivacidad.texto16}</li>
                                        <li>{inforPoliticaPrivacidad.texto17} {inforPoliticaPrivacidad.texto18}</li>
                                    </ul>
                                </div>

                            </div>

                        </div>

                    </div>


                    <div>
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto19}
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <p className="text-base md:text-lg">
                                    {inforPoliticaPrivacidad.texto20}
                                </p>
                                <div>
                                    <ul className="list-disc list-inside text-base md:text-lg">
                                        <li>{inforPoliticaPrivacidad.texto21} <span translate="no">{infoMisNotas360.texto4MisNotas360}</span></li>
                                        <li>{inforPoliticaPrivacidad.texto22}</li>
                                        <li>{inforPoliticaPrivacidad.texto23}</li>
                                        <li>{inforPoliticaPrivacidad.texto24}</li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto25}
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <p className="text-base md:text-lg">
                                    {inforPoliticaPrivacidad.texto26}
                                </p>
                                <div>
                                    <ul className="list-disc list-inside text-base md:text-lg">
                                        <li>{inforPoliticaPrivacidad.texto27}</li>
                                        <li>{inforPoliticaPrivacidad.texto28}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto29}
                        </p>
                        <div className="flex flex-col gap-2">
                            <p className="text-base md:text-lg">
                                {inforPoliticaPrivacidad.texto30}
                            </p>
                            <p className="text-base md:text-lg">
                                {inforPoliticaPrivacidad.texto31}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto32}
                        </p>
                        <div className="flex flex-col gap-2">
                            <p className="text-base md:text-lg">
                                {inforPoliticaPrivacidad.texto33}
                            </p>
                            <div>
                                <ul className="list-disc list-inside text-base md:text-lg">
                                    <li>{inforPoliticaPrivacidad.texto34}</li>
                                    <li>{inforPoliticaPrivacidad.texto35} <Link to="/informacion-eliminar-cuenta"><span className="font-semibold cursor-pointer">{inforPoliticaPrivacidad.texto35InfoEliminar}</span></Link></li>
                                    <li>{inforPoliticaPrivacidad.texto36}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto37}
                        </p>
                        <div className="flex flex-col gap-2">
                            <p className="text-base md:text-lg">
                                {inforPoliticaPrivacidad.texto38}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-lg md:text-xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto39}
                        </p>
                        <div className="flex flex-col gap-2">
                            <p className="text-base md:text-lg">
                                <span>{inforPoliticaPrivacidad.texto40} <span className="font-semibold" translate="no">{infoMisNotas360.texto10Correo}</span> </span>
                            </p>
                        </div>
                    </div>
                </div>
            )
            }


            {/*Esto es para informacion de eliminar cuenta*/}
            {esInfoEliminarCuenta && (
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <p className="text-base md:text-lg">
                            <span translate="no">{infoMisNotas360.texto4MisNotas360}</span> <span>{inforEliminarCuenta.texto1}</span>
                        </p>

                        <p className="text-base md:text-lg">
                            <span>{inforEliminarCuenta.texto2}</span>
                        </p>

                        <div className="flex flex-col gap-3">
                            <ol className="list-disc list-inside text-base md:text-lg">
                                <li>{inforEliminarCuenta.texto3}</li>
                                <p className="text-base md:text-lg">
                                    <span>{inforEliminarCuenta.texto4}</span>
                                </p>
                            </ol>

                            <ol className="list-disc list-inside text-base md:text-lg">
                                <li>{inforEliminarCuenta.texto5}</li>
                            </ol>
                        </div>

                        <div className="flex flex-col gap-2">
                            <p className="text-base md:text-lg">
                                <span>{inforEliminarCuenta.texto6}</span>
                            </p>
                            <ol className="list-disc list-inside text-base md:text-lg">
                                <li>{inforEliminarCuenta.texto7}</li>
                                <li>{inforEliminarCuenta.texto8}</li>
                                <li>{inforEliminarCuenta.texto9}</li>
                                <li>{inforEliminarCuenta.texto10A}</li>
                                <li>{inforEliminarCuenta.texto10B}</li>
                                <li>{inforEliminarCuenta.texto10C}</li>
                            </ol>
                        </div>
                    </div>

                    <p className="text-base md:text-lg">
                        <span>{inforEliminarCuenta.texto11}</span> <span className="font-semibold">{infoMisNotas360.texto10Correo}</span>
                    </p>
                </div>
            )}


            {/*Esto es para Problemas conocidos */}

            {esProblemasConocidos && (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4">
                        <p className="text-base md:text-lg">
                            <span>{inforProbleConocidos.texto1}</span> <span><span translate="no">{infoMisNotas360.texto4MisNotas360}</span></span> <span>{inforProbleConocidos.texto1_1}</span>
                        </p>

                        <div className="flex flex-col gap-2 text-base md:text-lg">
                            <p className="font-medium">
                                {inforProbleConocidos.texto2}
                            </p>

                            <p>
                                {inforProbleConocidos.texto3}
                            </p>

                            <p className="font-medium">
                                {inforProbleConocidos.causa}
                            </p>

                            <p>
                                {inforProbleConocidos.texto4}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 text-base md:text-lg">
                            <p className="font-medium">
                                {inforProbleConocidos.texto5}
                            </p>

                            <p>
                                {inforProbleConocidos.texto6}
                            </p>

                            <p className="font-medium">
                                {inforProbleConocidos.causa}
                            </p>

                            <p>
                                {inforProbleConocidos.texto7}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 text-base md:text-lg">
                            <p className="font-medium">
                                {inforProbleConocidos.texto8}
                            </p>

                            <p>
                                {inforProbleConocidos.texto9}
                            </p>

                            <p className="font-medium">
                                {inforProbleConocidos.causa}
                            </p>

                            <p>
                                {inforProbleConocidos.texto10}
                            </p>
                        </div>

                    </div>

                    <div className="flex flex-col gap-2 text-base md:text-lg">
                        <p className="font-medium">
                            {inforProbleConocidos.texto11}
                        </p>

                        <p>
                            <span>{inforProbleConocidos.texto12}</span> <span className="font-semibold" translate="no">{infoMisNotas360.texto10Correo}</span>
                        </p>

                        <p className="font-medium">
                            {inforProbleConocidos.texto13}
                        </p>
                    </div>
                </div>

            )}

        </div >
    );
}