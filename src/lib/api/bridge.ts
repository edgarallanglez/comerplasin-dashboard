
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
    cliente_name: string;
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

export interface Cobranza {
    id_documento: number;
    fecha: string;
    fecha_vencimiento: string;
    cliente_name: string;
    saldo_pendiente: number;
}

export interface Inventario {
    id_existencia: number;
    id_producto: number;
    codigo_producto: string;
    nombre_producto: string;
    status_producto: number;
    id_almacen: number;
    codigo_almacen: string;
    almacen: string;
    existencia: number;
    fecha_extraccion: string;
}

export interface Compra {
    CIDMOVIMIENTO: number;
    CIDDOCUMENTO: number;
    CIDCONCEPTODOCUMENTO: number;
    concepto_nombre: string;
    concepto_codigo: string;
    tipo_concepto: string;
    CFECHA: string;
    CSERIEDOCUMENTO: string;
    CFOLIO: string;
    CREFERENCIA: string;
    CIDCLIENTEPROVEEDOR: number;
    proveedor: string;
    CIDPRODUCTO: number;
    CCODIGOPRODUCTO: string;
    CNOMBREPRODUCTO: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    iva: number;
    total: number;
    CCOSTOCAPTURADO: number;
    CCOSTOESPECIFICO: number;
}

export interface Cxp {
    CIDCLIENTEPROVEEDOR: number;
    proveedor: string;
    saldo_real: number; // Net balance: total_deudas - total_pagos_creditos
    total_deudas: number;
    total_pagos_creditos: number;
    saldo_vencido: number;
    documentos: number;
}

export interface PagoProveedor {
    CIDDOCUMENTO: number;
    CIDCONCEPTODOCUMENTO: number;
    concepto_nombre: string;
    concepto_codigo: string;
    tipo_pago: string;
    CFECHA: string;
    CSERIEDOCUMENTO: string;
    CFOLIO: string;
    CREFERENCIA: string;
    CIDCLIENTEPROVEEDOR: number;
    proveedor: string;
    CNETO: number;
    CIMPUESTO1: number;
    CTOTAL: number;
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

    getCobranza: async (params?: { startDate?: string; endDate?: string; year?: string; month?: string }) => {
        try {
            const response = await api.get<Cobranza[]>('/cobranza', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching cobranza:', error);
            throw error;
        }
    },

    getCobranzaByYear: async (year: string) => {
        return bridgeApi.getCobranza({ year });
    },

    getCobranzaByMonth: async (year: string, month: string) => {
        return bridgeApi.getCobranza({ year, month });
    },

    getInventario: async (params?: {
        almacen?: string;
        producto?: string;
        status?: string;
        minStock?: string;
        maxStock?: string;
    }) => {
        try {
            const response = await api.get<Inventario[]>('/inventario', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching inventario:', error);
            throw error;
        }
    },

    getCompras: async (params?: {
        startDate?: string;
        endDate?: string;
        year?: string;
        month?: string;
        proveedor?: string;
        producto?: string;
        tipoConcepto?: string;
        groupBy?: string;
        top?: string;
        limit?: string;
    }) => {
        try {
            const response = await api.get<Compra[]>('/compras', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching compras:', error);
            throw error;
        }
    },

    getCxp: async (params?: {
        proveedor?: string;
        groupBy?: string;
        startDate?: string;
        endDate?: string;
        year?: string;
        month?: string;
    }) => {
        try {
            const response = await api.get<Cxp[]>('/cxp', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching cxp:', error);
            throw error;
        }
    },

    getPagosProveedores: async (params?: {
        startDate?: string;
        endDate?: string;
        year?: string;
        month?: string;
        proveedor?: string;
        tipoPago?: string;
        groupBy?: string;
        limit?: string;
    }) => {
        try {
            const response = await api.get<PagoProveedor[]>('/pagos-proveedores', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching pagos proveedores:', error);
            throw error;
        }
    },
};
