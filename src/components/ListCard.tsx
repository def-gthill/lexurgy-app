import { ReactNode } from "react";

export default function ListCard({ children }: { children: ReactNode }) {
  return (
    <li className="card" style={{ display: "flex", alignItems: "center" }}>
      {children}
    </li>
  );
}
