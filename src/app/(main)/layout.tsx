import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="relative min-h-screen"
        // Ensure focus ring stays inside viewport when skip-link is used
        tabIndex={-1}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}