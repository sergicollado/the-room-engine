export const logger = {
  info:(...args:any[]) => { console.log("THE_ROOM INFO: ",...args)},
  error:(...args:any[]) => { console.log("THE_ROOM ERROR: ",...args)},
  warning:(...args:any[]) => { console.log("THE_ROOM WARNING: ",...args)},
}
