export type Id =string | number;
export type Column ={
    id:number;
    name:string;
};

export type Task ={
    id:number;
    columnId:Id;
    taskName:string;
};