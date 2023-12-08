/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "body-bg-light": "#ebeff2",
        
        "card-bg-light": "#fff",
        
        "body-fg-light": "#6c757d",
       
        "footer-bg-light": "#e3e9ed",
       
        "footer-fg-light": "#6c757d",
      
        "footer-hover-light": "#636b72",
        
        "link-fg-light": "#71b6f9",
       
        "link-hover-light": "#609bd4",
        
        "border-light": "#f7f7f7",
       
        "disabled-light": "#98a6ad",
      
        "input-bg-light": "#fff",
       
        "input-fg-light": "#98a6ad",
       
        "input-border-light": "#ced4da",
    
        "input-focusborder-light": "#b9bfc4",
     
        "input-disabled-light": "#353d4a",
      
        "rightbar-light": "#323a46",
       
        "topbar-light": "#ebeff2",
       
        "topsearch-light": "#e2e6ea",
       
        "navlink-light": "#6c757d",
       
        "pagetitle-light": "#343a40",
       

        "text-dark-light": "#343a40",
       

        "popover-light": "#f8f9fa",
        
        "popover-item-hover-light": "#71b6f9",
    

        
        "dropdown-bg-light": "#fff",
        "dropdown-link-hover-bg-light": "#f8f9fa",
       
        "dropdown-link-hover-fg-light": "#2d343f",
       
        "dropdown-hr-light": "#f1f2f3",
      
        "dropdown-title-light": "#343a40",
       
        "dropdown-link-fg-light": "#323a46",
        

        "leftbar-light": "#fff",
        "leftbar-username-fg-light": "#6c757d",
      
        "leftbar-text-muted-light": "#98a6ad",
      
        "leftbar-text-muted-hover-light": "#609bd4",
      
        "leftbar-navbar-item-fg-light": "#6e768e",
      
        "leftbar-navbar-item-active-fg-light": "#71b6f9",
      
        "leftbar-navbar-item-fg-hover-light": "#71b6f9",
       

        "userbox-border-light": "#f5f5f5",

        success: "#10c469",
        pink: "#ff8acc",
        purple: "#5b69bc",
        "purple-hover": "#4d59a0",

        danger: "#ff5b5b",
        "alert-danger-fg-light": "#993737",
      },
      boxShadow: {
        box: "0px 0px 35px 0px rgba(66, 72, 80, 0.15)",
        "box-sm": "0 0.75rem 6rem rgba(56, 65, 74, 0.03)",
        "box-lg": "0 0 45px 0 rgba(0, 0, 0, 0.12)",
        "box-inset": "inset 0 1px 2px rgba(0, 0, 0, 0.075)",
      },
    },
    screens: {
      sm: "580px",
      md: "720px",
      lg: "960px",
      xl: "1280px",
    },
  },
  plugins: [],
};
