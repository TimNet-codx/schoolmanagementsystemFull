// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { ClerkProvider } from "@clerk/nextjs";
// import { ToastContainer } from "react-toastify";
// import { ThemeProvider } from "next-themes";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Tim.Net School Management System",
//   description: "Next.js School Management System",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <ClerkProvider>
//       <html lang="en">
//         <body className={inter.className} suppressHydrationWarning>
//           <ThemeProvider>
//             {children}
//             <ToastContainer position="bottom-right" theme="dark" />
//           </ThemeProvider>
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }



import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import { ThemeProvider, ThemeScript } from "@/components/Themeprovider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tim.Net School Management System",
  description: "Next.js School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <ThemeScript />
        </head>
        <body className={inter.className} suppressHydrationWarning>
          <ThemeProvider>
            {children}
            <ToastContainer position="bottom-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
