import Header from "@/components/Header";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="md-below-header">{children}</div>
    </>
  );
}
