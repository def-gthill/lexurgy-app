import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <button
      onClick={() => {
        signOut();
      }}
    >
      Sign Out
    </button>
  );
}
