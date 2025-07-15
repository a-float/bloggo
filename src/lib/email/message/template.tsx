import {
  Html,
  Head,
  Body,
  Preview,
  Container,
  Heading,
  Hr,
  Link,
} from "@react-email/components";
import type React from "react";

export function EmailTemplate(props: {
  heading: string;
  children: React.ReactNode;
  options: { url: string };
}) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>{props.heading}</Preview>
        <Container style={container}>
          {/* <Img
        src={`${baseUrl}/static/logo.png`}
        width="42"
        height="42"
        alt="Bloggo"
        style={logo}
      /> */}
          <Heading style={heading}>{props.heading}</Heading>
          {props.children}
          <Hr style={hr} />
          <Link href={process.env.NEXTAUTH_URL!} style={reportLink}>
            Bloggo
          </Link>
        </Container>
      </Body>
    </Html>
  );
}

// const logo = {
//   borderRadius: 21,
//   width: 42,
//   height: 42,
// };

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    'Geist,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const reportLink = {
  fontSize: "14px",
  color: "#b4becc",
};

const hr = {
  borderColor: "#dfe1e4",
  margin: "24px 0 8px",
};

export const styles = {
  paragraph: {
    margin: "0 0 15px",
    fontSize: "15px",
    lineHeight: "1.4",
    color: "#3c4149",
  },

  button: {
    backgroundColor: "#605dff",
    boxShadow: `0 0.5px 0 0.5px oklch(100% 0 0 / calc(1 * 6%)) inset, 0 3px 2px -2px
   color-mix(in oklab, #605dff calc(1 * 30%), #0000), 0 4px 3px -2px
   color-mix(in oklab, #605dff calc(1 * 30%), #0000)`,
    borderRadius: "4px",
    fontWeight: "600",
    color: "#fff",
    fontSize: "15px",
    textDecoration: "none",
    textAlign: "center",
    display: "block",
    padding: "11px 23px",
  },
} as const satisfies Record<string, React.CSSProperties>;
