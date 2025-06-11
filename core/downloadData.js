import * as data from "./reactiveData.js";

export const contactsData = data.createReactiveDataSource('kanban/sharedBoard/contacts');
export const tasks = data.createReactiveDataSource('kanban/sharedBoard/tasks');