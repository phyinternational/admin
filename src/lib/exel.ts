import * as XLSX from 'xlsx'

export function parseXLSXFile(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e:any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

      const filteredData:any[] = jsonData.filter((obj:any) => Object.keys(obj).length > 0);

      const importHeader = filteredData[0].map((header:any) => header.trim());

      const importData = [];
      for (let i = 1; i < filteredData.length; i++) {
        const row = filteredData[i];
        const rowData:any = {};
        for (let j = 0; j < row.length; j++) {
          const cellValue = row[j] ? row[j].trim() : '';
          rowData[importHeader[j]] = cellValue;
        }
        importData.push(rowData);
      }
      resolve({ importHeader, importData });
    };

    reader.onerror = (e) => {
      reject(e);
    };

    reader.readAsArrayBuffer(file);
  });
}
