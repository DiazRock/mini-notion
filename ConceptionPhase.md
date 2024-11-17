# Mini-Notion Development

## Conception phase

### Project description

**Mini-Notion** is a web application, based on the Notion agenda (https://www.notion.so/), that has an user view, connected to a backend, in order to keep a state related to the tasks the user can schedule in this view. As core features, the view has the following properties: A text editor, in where users can create and format notes. A task management, which provides basic task creation, status tracking (e.g., to-do, in-progress, completed), and due dates. The technologies used here will be React for dynamic UI and Antd for responsive design. On the other side, it is going to be used a SQLite database managed by FastAPI using Python, for the backend support of the information state, of each user and the relevant information about the tasks and notes. It will be added here a search functionality too, that can help the users to search among their stored information in the app.

### Diagram architecture flow

![Diagram](diagram-1.png)