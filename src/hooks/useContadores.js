import { useDispatch } from 'react-redux';
import { setContadores } from '../store/tareasSlice';

export const useContadores = () => {
    const dispatch = useDispatch();
    const API_URL = import.meta.env.VITE_API_URL;

    const actualizarContadores = async () => {
        try {
            const token = localStorage.getItem('token');
            
            const respuesta = await fetch(`${API_URL}/anotaciones/contadores`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (respuesta.ok) {
                const datos = await respuesta.json();
                dispatch(setContadores(datos));
                return datos;
            } else {
                console.error('Error al actualizar contadores');
                return null;
            }
        } catch (error) {
            console.error('Error al actualizar contadores:', error);
            return null;
        }
    };

    return { actualizarContadores };
};