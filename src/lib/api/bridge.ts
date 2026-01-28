
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_BRIDGE_API_URL || 'http://localhost:3001';
const API_KEY = process.env.BRIDGE_API_KEY;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
    },
});

export interface Sale {
    id_movimiento: number;
    id_documento: number;
    fecha: string; // ISO date string
    id_cliente: number;
    id_producto: number;
    naturaleza_concepto: number;
    fecha_vencimiento: string;
    saldo_pendiente: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    iva: number;
    total: number;
    costo_linea: number;
    costo_unitario: number;
}

export const bridgeApi = {
    getSales: async (params?: { startDate?: string; endDate?: string; year?: string; month?: string }) => {
        try {
            const response = await api.get<Sale[]>('/ventas', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching sales:', error);
            throw error;
        }
    },

    getSalesByYear: async (year: string) => {
        return bridgeApi.getSales({ year });
    },

    getSalesByMonth: async (year: string, month: string) => {
        return bridgeApi.getSales({ year, month });
    },
};
