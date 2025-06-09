// import { createReactiveDataSource } from "./reactiveData.js";
import * as data from "./reactiveData.js";


export const contactsData = data.createReactiveDataSource('kanban/sharedBoard/contacts');
export const allTask = data.createReactiveDataSource('kanban/sharedBoard/tasks');
// export const tasks = await data.getAllTasks();