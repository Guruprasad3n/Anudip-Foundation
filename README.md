# Anudip Foundation - Training & Mobilization Dashboard


## 🌐 Project Overview

This project is a comprehensive educational dashboard built for the Anudip Foundation. The primary goal is to visually manage, monitor, and track the progress of students across various training centers in India. It integrates interactive maps, batch-level data, mobilization tracking, and chart-based analytics.

## 1. 🗺️ Interactive India Map
 - SVG-based clickable map of India.
 - On hovering a state, it highlights and displays the state name.
 - On clicking, navigates to a page with center-level student data for that state

## 2. 📊 State-wise & Batch-wise Data Pages
 - StatePage: Displays center-wise summary data.

 - StateBatchWiseData: Visualizes batch-wise data for students using Chart.js.

 - Filtering available by center codes and batches.

 - Charts (Bar, Pie, PolarArea) open in modal views for deeper analysis.
## 3. 🖼️ Mobilization Gallery
 - Modal-based form for employees to upload mobilization effort details.
 - Fields include:
     - Employee ID
     - State selection (dynamically sourced from data.js based on "Center State")
     - Image upload
     - Description message
 - Data is temporarily stored in localStorage.
 - Uploaded entries are displayed as cards in a gallery grid with images and text.
## 🛠️ Tech Stack

 - React.js
 - React Router DOM (for routing)
 - Chart.js (data visualization)
 - HTML5 / CSS3
 - JavaScript (ES6+)
 - LocalStorage (temporary data storage)
 - Modular CSS for styling 

## 🧪 How to Run Locally
   
    # Clone the repo
    git clone https://github.com/Guruprasad3n/Anaudip-Foundation
     
    # Go to the folder
    cd anudip-dashboard

    # Install dependencies
    npm install
    # Run the development server
    npm run dev

   
## 🙌 Acknowledgements

Built with ❤️ for Anudip Foundation, to support skill development and training initiatives across India.


# 📧 Contact
