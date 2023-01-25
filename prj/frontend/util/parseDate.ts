export const parseDateStrToDate = (strDate: string) => {
    if (!strDate) {
        return new Date;  
    }
    let year: number = parseInt(strDate.slice(0, 4));
    let month: number = parseInt(strDate.slice(5, 7));
    let date: number = parseInt(strDate.slice(8, 10));
    return new Date(Date.UTC(year, month, date));
}