import * as XLSX from "xlsx";
import {Data} from "../network/BaseRequest.ts";


const parseXlsx = (data: Uint8Array): string[] => {
    const workbook = XLSX.read(data, {type: 'array'});
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    // 获取Excel表格范围
    const range = XLSX.utils.decode_range(worksheet['!ref']!);
    const rows = [];
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const cellAddress = { c: 0, r: R }; // 第一列
        const cellRef = XLSX.utils.encode_cell(cellAddress);
        const cellValue = worksheet[cellRef] ? worksheet[cellRef].v : undefined;
        if (!cellValue) {
            continue;
        }
        rows.push(cellValue);
    }
    return rows;
}

const generateXlsx = (data: Data[]): Uint8Array => {
    const list = data.map((item) => {
        const obj: any = {};
        obj['单号'] = item.keyword;
        obj['扫描时间'] = '';
        obj['上传时间'] = '';
        obj['扫描类型'] = '';
        obj['跟踪记录描述'] = '';
        obj['重量'] = '';
        obj['体积'] = '';
        obj['备注'] = '';

        if (item.details && item.details.length > 0) {
            obj['扫描时间'] = item.details[0].scanTime;
            obj['上传时间'] = item.details[0].uploadTime;
            obj['扫描类型'] = item.details[0].scanTypeName;
            let result = item.details[0].template;
            for (const key in item.details[0]) {
                if (key === 'template') {
                    continue;
                }
                //@ts-ignore
                const regex = new RegExp('\\$\\[(' + key + ')\\]', 'g');
                //@ts-ignore
                result = result.replace(regex, `${item.details[0][key]}`);
            }
            obj['跟踪记录描述'] = result;
            obj['重量'] = item.details[0].weight || '--';
            obj['体积'] = item.details[0].volume || '--';
        } else {
            obj['备注'] = '未查询到相关数据';
        }
        return obj;
    });
    const ws = XLSX.utils.json_to_sheet(list);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const buf = XLSX.write(wb, {type: 'array', bookType: 'xlsx'});
    return new Uint8Array(buf);
}

export default {
    parseXlsx,
    generateXlsx
};