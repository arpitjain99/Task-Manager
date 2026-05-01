import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

export const metadata = {
  title: "TeamFlow",
  description: "Role-aware team task management",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#6366f1",
          colorBackground: "#111118",
          colorInputBackground: "#1a1a24",
          colorText: "#f0f0ff",
          borderRadius: "8px",
          fontFamily: "Sora, sans-serif",
        },
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
