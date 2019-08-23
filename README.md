# PaperCut Print Monitor

*(still in development)*

This repository holds the code for a print monitor web application (written in React) that displays the health status of printers connected to a PaperCut print system. 

The web app connects to the backend that handles the data regarding printer statuses (toner and paper levels). Printer statuses are received from PaperCut's own health API. From the main components, users will be able to see and refresh all the printer statuses. Authentication will not be required at the time of release because although this tool is meant for use by EagleTech and BC Libraries staff, there is no harm in the Boston College community knowing if a specific public-facing printer is out of toner or paper

***

### TO DO

#### High Priority

- Backend
  - add web socket functionality to update front-end statuses in real-time
  - create function interval for record updates ☑️
  - create server, database ☑️
  - the backend will connect to the PaperCut API on a set interval and add new printers, update current printers on the database ☑️
- Front-end
  - fetch printer statuses from backend ☑️
  - create individual printer components

#### Low Priority

- filter printers by locations

***

*(All code found in this repo is owned by **Jeffrey Barros Peña** (Boston College '19) with the intended use by Boston College, Information Technology Services)*