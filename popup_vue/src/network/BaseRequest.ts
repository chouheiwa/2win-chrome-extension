//@ts-ignore
import request from "./request.js";

export type BaseResponse<T> = {
    code?: number;
    msg: string;
    data: T;
    fail: boolean;
    succ: boolean;
}

export type Data = {
    keyword: string;
    codes?: string;
    waybillStatus?: string;
    details?: Details[];
}

export type Details = {
    scanTime: string;
    uploadTime: string;
    scanTypeName: string;
    template: string;
    volume?: number;
    weight?: number;
}

const baseRequest = async <T> (path: string, init?: RequestInit): Promise<BaseResponse<T>> => {
    return request(path, init);
}

const checkLoginStatus = async (): Promise<boolean> => {
    const response = await baseRequest('message/messageInfo/remind');
    return (response.code ?? 401) !== 401
}

const getKeyWordList = async (keyword: string): Promise<Data> => {
    const result = await baseRequest<Data[]>('ops/wdbutler/podTracking/inner/query/keywordList', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            keywordList: [keyword],
            "trackingTypeEnum": "WAYBILL",
            "countryId": "1"
        })
    });
    return result.data[0];
}

export default {
    baseRequest,
    checkLoginStatus,
    getKeyWordList
}