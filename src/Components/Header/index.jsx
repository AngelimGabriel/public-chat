import styles from "./style.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

function alterar_tema() {
  if (document.documentElement.getAttribute("data-theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
}

export default function Header() {
  useEffect(() => {
    const savedtheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedtheme);
  }, []);
  return (
    <div className={styles.divHeader}>
      <div>
        <h1>Public Chat</h1>
      </div>
      <div className={styles.divGitHub}>
        <h1>
          GitHub:{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/angelimgabriel/"
            style={{ fontWeight: "normal", textDecoration:"none" }}
          >
            Gabriel Angelim <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </a>
        </h1>
        <FontAwesomeIcon
          onClick={alterar_tema}
          id="theme"
          icon={faCircleHalfStroke}
          size="2xl"
          style={{ cursor: "pointer" }}
        />
      </div>
    </div>
  );
}
