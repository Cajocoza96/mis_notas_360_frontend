import React from "react";

import { useLocation } from "react-router-dom";

import infoTerminosPoliticas from "../../../data/infoTerminosPoliticas.json";

export default function Cuerpo() {

    const infoMisNotas360 = infoTerminosPoliticas.seccionTerminosPoliticas;

    const inforTerminosServicio = infoTerminosPoliticas.terminosDeServicio;
    const inforPoliticaPrivacidad = infoTerminosPoliticas.politicaDePrivacidad;

    const location = useLocation();

    const esTerminoDeServicio = location.pathname === "/terminos-de-servicio";

    return (
        <div className="w-[95%] mx-auto p-2
                        text-black dark:text-white 
                        overflow-x-hidden min-h-0 min-w-0
                        flex flex-col justify-between gap-3">

            <div className="flex flex-col gap-1">
                <p className="text-xl md:text-2xl font-semibold text-center">
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
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforTerminosServicio.texto1}
                        </p>
                        <p className="text-base md:text-xl">
                            <span>{inforTerminosServicio.texto2} {infoMisNotas360.texto4MisNotas360} {inforTerminosServicio.texto3}</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforTerminosServicio.texto4}
                        </p>
                        <p className="text-base md:text-xl">
                            <span>{infoMisNotas360.texto4MisNotas360} {inforTerminosServicio.texto5}</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div>
                            <p className="text-base md:text-xl font-semibold">
                                <span>{inforTerminosServicio.texto6} {infoMisNotas360.texto4MisNotas360}</span>
                            </p>
                            <p className="text-base md:text-xl">
                                {inforTerminosServicio.texto7}
                            </p>
                        </div>

                        <div>
                            <ul className="list-disc list-inside text-base md:text-xl">
                                <li>{inforTerminosServicio.texto8}</li>
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
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforTerminosServicio.texto20}
                        </p>
                        <p className="text-base md:text-xl">
                            {inforTerminosServicio.texto21}
                        </p>

                        <div>
                            <ul className="list-disc list-inside text-base md:text-xl">
                                <li>{inforTerminosServicio.texto22}</li>
                                <li>{inforTerminosServicio.texto23}</li>
                                <li>{inforTerminosServicio.texto24}</li>
                                <li>{inforTerminosServicio.texto25}</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforTerminosServicio.texto26}
                        </p>
                        <p className="text-base md:text-xl">
                            <span>{inforTerminosServicio.texto27} {infoMisNotas360.texto4MisNotas360} {inforTerminosServicio.texto28}</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforTerminosServicio.texto29}
                        </p>
                        <p className="text-base md:text-xl">
                            <span>{infoMisNotas360.texto4MisNotas360} {inforTerminosServicio.texto30}</span>
                        </p>

                        <div>
                            <ul className="list-disc list-inside text-base md:text-xl">
                                <li>{inforTerminosServicio.texto31}</li>
                                <li>{inforTerminosServicio.texto32}</li>
                                <li>{inforTerminosServicio.texto33}</li>
                            </ul>
                        </div>

                        <p className="text-base md:text-xl">
                            {inforTerminosServicio.texto34}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforTerminosServicio.texto35}
                        </p>
                        <p className="text-base md:text-xl">
                            {inforTerminosServicio.texto36}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforTerminosServicio.texto37}
                        </p>
                        <p className="text-base md:text-xl">
                            <span>{inforTerminosServicio.texto38} {infoMisNotas360.texto4MisNotas360}</span>
                        </p>
                    </div>
                </div>
            )}

            {/*Esto es para Politicas de privacidad*/}
            {!esTerminoDeServicio && (
                <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto1}
                        </p>
                        <p className="text-base md:text-xl">
                            <span>{inforPoliticaPrivacidad.texto2} {infoMisNotas360.texto4MisNotas360} {inforPoliticaPrivacidad.texto3}</span>
                        </p>
                    </div>

                    <div>
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto4}
                        </p>

                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <p className="text-base md:text-xl font-semibold">
                                    {inforPoliticaPrivacidad.texto5}
                                </p>
                                <p className="text-base md:text-xl">
                                    {inforPoliticaPrivacidad.texto6}
                                </p>

                                <div>
                                    <ul className="list-disc list-inside text-base md:text-xl">
                                        <li>{inforPoliticaPrivacidad.texto7}</li>
                                        <li>{inforPoliticaPrivacidad.texto8}</li>
                                        <li>{inforPoliticaPrivacidad.texto9}</li>
                                    </ul>
                                </div>

                            </div>


                            <div className="flex flex-col gap-1">
                                <p className="text-base md:text-xl font-semibold">
                                    {inforPoliticaPrivacidad.texto10}
                                </p>
                                <div>
                                    <ul className="list-disc list-inside text-base md:text-xl">
                                        <li>{inforPoliticaPrivacidad.texto11}</li>
                                        <li>{inforPoliticaPrivacidad.texto12}</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="text-base md:text-xl font-semibold">
                                    {inforPoliticaPrivacidad.texto13}
                                </p>
                                <p className="text-base md:text-xl">
                                    {inforPoliticaPrivacidad.texto14}
                                </p>

                                <div>
                                    <ul className="list-disc list-inside text-base md:text-xl">
                                        <li>{inforPoliticaPrivacidad.texto15}</li>
                                        <li>{inforPoliticaPrivacidad.texto16}</li>
                                        <li>{inforPoliticaPrivacidad.texto17} {inforPoliticaPrivacidad.texto18}</li>
                                    </ul>
                                </div>

                            </div>

                        </div>

                    </div>


                    <div>
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto19}
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <p className="text-base md:text-xl">
                                    {inforPoliticaPrivacidad.texto20}
                                </p>
                                <div>
                                    <ul className="list-disc list-inside text-base md:text-xl">
                                        <li>{inforPoliticaPrivacidad.texto21}</li>
                                        <li>{inforPoliticaPrivacidad.texto22}</li>
                                        <li>{inforPoliticaPrivacidad.texto23}</li>
                                        <li>{inforPoliticaPrivacidad.texto24}</li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto25}
                        </p>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <p className="text-base md:text-xl">
                                    {inforPoliticaPrivacidad.texto26}
                                </p>
                                <div>
                                    <ul className="list-disc list-inside text-base md:text-xl">
                                        <li>{inforPoliticaPrivacidad.texto27}</li>
                                        <li>{inforPoliticaPrivacidad.texto28}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto29}
                        </p>
                        <div className="flex flex-col gap-2">
                            <p className="text-base md:text-xl">
                                {inforPoliticaPrivacidad.texto30}
                            </p>
                            <p className="text-base md:text-xl">
                                {inforPoliticaPrivacidad.texto31}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto32}
                        </p>
                        <div className="flex flex-col gap-2">
                            <p className="text-base md:text-xl">
                                {inforPoliticaPrivacidad.texto33}
                            </p>
                            <div>
                                <ul className="list-disc list-inside text-base md:text-xl">
                                    <li>{inforPoliticaPrivacidad.texto34}</li>
                                    <li>{inforPoliticaPrivacidad.texto35}</li>
                                    <li>{inforPoliticaPrivacidad.texto36}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto37}
                        </p>
                        <div className="flex flex-col gap-2">
                            <p className="text-base md:text-xl">
                                {inforPoliticaPrivacidad.texto38}
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xl md:text-2xl font-semibold text-center">
                            {inforPoliticaPrivacidad.texto39}
                        </p>
                        <div className="flex flex-col gap-2">
                            <p className="text-base md:text-xl">
                                <span>{inforPoliticaPrivacidad.texto40} {infoMisNotas360.texto4MisNotas360}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )
            }

        </div >
    );
}