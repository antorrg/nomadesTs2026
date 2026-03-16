import { useEffect } from 'react';
import { type ActionCreator, type AsyncThunk } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { RootState } from '../store/store';

/**
 * Opciones para el hook useReduxFetch
 */
interface UseReduxFetchOptions<Data, ThunkArg> {
    /** La acción asíncrona (Thunk) a despachar */
    action: AsyncThunk<any, ThunkArg, any> | ActionCreator<any>;
    /** Argumento para la acción (opcional) */
    arg?: ThunkArg;
    /** Selector para obtener los datos del estado */
    selector: (state: RootState) => Data;
    /** Dependencias para el useEffect (por defecto []) */
    deps?: any[];
    /** condicional para disparar accion */
    condition?: boolean;
    /** Acción de limpieza al desmontar (opcional) */
    cleanupAction?: ActionCreator<any>;
}

/**
 * Hook personalizado para despachar una acción de Redux y seleccionar datos del estado.
 * 
 * @template Data El tipo de datos que retorna el selector
 * @template ThunkArg El tipo del argumento de la acción
 */
export const useReduxFetch = <Data, ThunkArg = void>({
    action,
    arg,
    selector,
    deps = [],
    condition = true,
    cleanupAction,
}: UseReduxFetchOptions<Data, ThunkArg>) => {
    const dispatch = useAppDispatch();
    const stateData = useAppSelector(selector);

    useEffect(() => {
        // Despachar la acción con el argumento (si existe)
        if (condition) {
        dispatch((action as any)(arg));
        }
        // Limpieza al desmontar
        return () => {
            if (cleanupAction) {
                dispatch(cleanupAction());
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...deps, dispatch]); // Incluimos dispatch y deps personalizados

    return stateData;
};