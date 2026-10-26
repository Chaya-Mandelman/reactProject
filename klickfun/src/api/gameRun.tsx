import {type LiveState} from '../types/liveState'
import { api } from './apiClient'

//פרטים על המשחק כל שניה
export const liveApi=async (id:number):Promise<LiveState>=>{
    const response=await api.get<LiveState>(`/games/${id}/live`)
    return response.data
}

export const startGameApi=async (id:number):Promise<LiveState>=>{
    const response=await api.post<{live:LiveState}>(`/games/${id}/start`)
    return response.data.live
}

export const pauseGameApi=async (id:number):Promise<LiveState>=>{
    const response=await api.post<{live:LiveState}>(`/games/${id}/pause`)
    return response.data.live
}


export const resumeGameApi=async (id:number):Promise<LiveState>=>{
    const response=await api.post<{live:LiveState}>(`/games/${id}/resume`)
    return response.data.live
}


export const stopGameApi=async (id:number):Promise<LiveState>=>{
    const response=await api.post<{live:LiveState}>(`/games/${id}/stop`)
    return response.data.live
}


export const openLobyApi=async (id:number):Promise<LiveState>=>{
    const response=await api.post<{live:LiveState}>(`/games/${id}/lobby`)
    return response.data.live
}

