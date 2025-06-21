import { useEffect } from "react";
export default function UserData() {
  const pais = localStorage.getItem("pais");
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!pais) {
      fetch("https://geolocation-db.com/json/")
        .then((res) => res.json())
        .then((data) => localStorage.setItem("pais", data.country_name))
        .catch((error) => console.log(error));
    }
    if (!user) {
      localStorage.setItem(
        "user",
        "@user" + Math.floor(Math.random() * 100000)
      );
    }
  });
  return null;
}
