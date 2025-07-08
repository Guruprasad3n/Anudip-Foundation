import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const isLight = theme === "light";

    return (
        <button
            onClick={toggleTheme}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: isLight ? "flex-start" : "flex-end",
                width: "45px",
                height: "22px",
                backgroundColor: isLight ? "#ccc" : "#666",
                borderRadius: "20px",
                padding: "3px",
                border: "none",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
            }}
            title={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
        >
            <span
                style={{
                    fontSize: "14px",
                    transition: "transform 0.3s ease",
                }}
            >
                {isLight ? "🌙" : "☀️"}
            </span>
        </button>
    );
};

export default ThemeToggle;



// import { useContext } from "react";
// import { ThemeContext } from "../ThemeContext";

// const ThemeToggle = () => {
//   const { theme, toggleTheme, resetTheme } = useContext(ThemeContext);

//   return (
//     <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
//       <button onClick={toggleTheme}>
//         {theme === "light" ? "🌙 Dark" : "☀️ Light"}
//       </button>
//       <button onClick={resetTheme}>🌀 Auto</button>
//     </div>
//   );
// };

// export default ThemeToggle;

