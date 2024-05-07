import Header from "@/components/Header";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ width: "80%", margin: "auto" }}>{children}</main>
    </>
  );
}
