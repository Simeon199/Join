import { createReactiveDataSource } from "./reactiveData.js";

export const contactsData = createReactiveDataSource('kanban/sharedBoard/contacts');
export const allTask = createReactiveDataSource('kanban/sharedBoard/tasks');