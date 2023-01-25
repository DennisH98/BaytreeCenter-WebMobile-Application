export interface IViewsAllSessionsFromGroupData {
    sessionID: number,
    sessionGroupID: number,
    name: string,
    startDate: Date,
   
};

export interface IViewsAllSessionsFromGroup {
    count: number,
    sessionsData:IViewsAllSessionsFromGroupData[],
};