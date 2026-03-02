import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderConfirmationEmailProps {
  orderId: string;
  customerName: string;
  totalAmount: string;
  trackingUrl: string;
  items: {
    title: string;
    price: string;
    image: string;
  }[];
}

export const OrderConfirmationEmail = ({
  orderId = "123456",
  customerName = "Anon",
  totalAmount = "99.00",
  trackingUrl = "https://rawr.store/orders/123",
  items = [],
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your RAWR STORE order #{orderId} is confirmed.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={logo}>RAWR</Text>
        </Section>
        <Heading style={heading}>Order Confirmed</Heading>
        <Text style={paragraph}>
          What&apos;s good {customerName}? We&apos;ve secured your stash. Thank
          you for your order. We&apos;ll notify you again once your items drop.
        </Text>

        <Section style={orderInfo}>
          <Text style={infoTextBold}>Order #{orderId}</Text>
          <Text style={infoText}>Total: ${totalAmount}</Text>
        </Section>

        {items.length > 0 && (
          <Section style={itemList}>
            {items.map((item, index) => (
              <div key={index} style={itemRow}>
                <div style={itemDetails}>
                  <Text style={itemName}>{item.title}</Text>
                  <Text style={itemPrice}>${item.price}</Text>
                </div>
              </div>
            ))}
          </Section>
        )}

        <Section style={buttonContainer}>
          <Link href={trackingUrl} style={button}>
            TRACK YOUR ORDER
          </Link>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          Wear it or hear it.
          <br />
          RAWR STORE 2026.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default OrderConfirmationEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const header = {
  padding: "20px 0",
  textAlign: "center" as const,
  borderBottom: "2px solid #000",
  marginBottom: "20px",
};

const logo = {
  fontSize: "32px",
  fontWeight: "900",
  margin: "0",
  letterSpacing: "-2px",
  color: "#000",
};

const heading = {
  fontSize: "24px",
  lineHeight: "1.3",
  fontWeight: "800",
  color: "#000",
  textTransform: "uppercase" as const,
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.4",
  color: "#484848",
  marginBottom: "24px",
};

const orderInfo = {
  backgroundColor: "#f5f5f5",
  padding: "16px",
  marginBottom: "24px",
  border: "1px solid #000",
};

const infoTextBold = {
  fontSize: "16px",
  fontWeight: "bold",
  margin: "0 0 4px",
};

const infoText = {
  fontSize: "14px",
  margin: "0",
};

const itemList = {
  marginBottom: "24px",
};

const itemRow = {
  display: "flex",
  padding: "12px 0",
  borderBottom: "1px solid #eaeaea",
};

const itemDetails = {
  paddingLeft: "12px",
};

const itemName = {
  fontSize: "14px",
  fontWeight: "bold",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};

const itemPrice = {
  fontSize: "14px",
  margin: "0",
  color: "#666",
};

const buttonContainer = {
  textAlign: "center" as const,
  padding: "12px 0 24px",
};

const button = {
  backgroundColor: "#000",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 24px",
  textTransform: "uppercase" as const,
};

const hr = {
  borderColor: "#e6eaed",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};
