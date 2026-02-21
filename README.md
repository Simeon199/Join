# Join – Kanban Based Project

A kanban based frontend project which supports CRUD operations and was developed exclusively for testing purposes.
All data used are dummy data and have no relation to real persons.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Technologies](#technologies)
- [Installation](#installation)
- [How to Use It](#how-to-use-it)
- [Dummy Data](#dummy-data)

---

## About the Project

Join is a kanban-based project management tool designed and built by a group of dedicated students as part of their web development bootcamp at the Developer Akademie.
It is important to note that Join is designed as an educational exercise and is not intended for extensive business usage. While we strive to ensure the best possible user experience, we cannot guarantee consistent availability, reliability, accuracy, or other aspects of quality regarding Join. It is therefore not intended for commercial use and was created solely for
private testing and learning purposes.

---

## Technologies

- HTML
- CSS
- JavaScript (Vanilla JS – no frameworks or external dependencies)
- [Google Firebase](https://firebase.google.com/) – Realtime Database for storing and syncing data

---

## Installation

Since this project is built with plain Vanilla JavaScript, no package manager
or additional dependencies are required.

1. Clone the repository:

   ```bash
   git clone https://github.com/Simeon199/join.git
   ```
2. Switch to the Join directory:
   ```bash
   cd Join
   ```
3. Open `index.html` under the pages folder directly inside your browser – that's it!

---

## How to Use It

### Exploring the Board

When you log in to Join, you'll find a default board. This board represents
your project and contains four default lists:
**"To Do"**, **"In Progress"**, **"Await Feedback"** and **"Done"**.

### Creating Contacts

In Join, you can add contacts to collaborate on your projects. Go to the
**"Contacts"** section, click on **"New contact"**, and fill in the required
information. Once added, these contacts can be assigned tasks and interact
with the cards on the board.

### Adding Cards

Once your contacts are set up, you can start adding cards. Cards represent
individual tasks. Click the **"+"** button under the appropriate list to
create a new card. Fill in the task details such as task name, description,
due date, assignees and more.

### Moving Cards

As a task progresses, you can reflect that on the board by simply
**dragging and dropping** the card from one list to another.

### Deleting Cards

Once a task is completed, you can either move it to the **"Done"** list or
delete it entirely.

> ⚠️ Please note: Deleting a card will **permanently remove** it from the
> board. This action is irreversible.

---

## Dummy Data

All data used in this project (persons, tasks, etc.) are fictitious and serve
exclusively for testing purposes. There is no relation to real persons,
companies or events.

---
