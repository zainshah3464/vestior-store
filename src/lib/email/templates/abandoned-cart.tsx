import {
  Html, Head, Preview, Body, Container, Heading, Text, Button,
  Section, Hr, Img,
} from '@react-email/components'

interface CartItem {
  name: string
  quantity: number
  price: number
  image: string | null
}

interface AbandonedCartProps {
  userName?: string
  items?: CartItem[]
  subtotal?: number
  discountPercent?: number
  couponCode?: string | null
  recoveryUrl?: string
  siteUrl?: string
}

export default function AbandonedCartEmail({
  userName = 'there',
  items = [],
  subtotal = 0,
  discountPercent = 0,
  couponCode = null,
  recoveryUrl = 'https://vestior.vercel.app',
  siteUrl = 'https://vestior.vercel.app',
}: AbandonedCartProps) {
  return (
    <Html>
      <Head />
      <Preview>Still thinking? Your VESTIOR cart is waiting ⏳</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>VESTIOR</Heading>
            <Text style={tagline}>Premium Tailored Fashion</Text>
          </Section>

          <Heading style={h1}>Hey {userName}, you left something behind</Heading>
          <Text style={text}>
            We saved your cart so you can pick up right where you left off.
            {discountPercent > 0 && couponCode
              ? ` And here's a ${discountPercent}% off code just for you:`
              : ' Items sell fast — don\'t miss out!'}
          </Text>

          {discountPercent > 0 && couponCode && (
            <Section style={couponBox}>
              <Text style={couponLabel}>YOUR CODE</Text>
              <Text style={couponCodeStyle}>{couponCode}</Text>
              <Text style={couponSubtext}>
                {discountPercent}% off your order
              </Text>
            </Section>
          )}

          <Section style={itemsSection}>
            <Text style={itemsHeader}>Your Cart</Text>
            {items.slice(0, 5).map((item, i) => (
              <Section key={i} style={itemRow}>
                {item.image ? (
                  <Img
                    src={item.image}
                    alt={item.name}
                    width="56"
                    height="56"
                    style={itemImage}
                  />
                ) : (
                  <div style={{ ...itemImage, background: '#1f2937' }} />
                )}
                <div style={itemDetails}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemMeta}>
                    Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                  </Text>
                </div>
                <Text style={itemPrice}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </Text>
              </Section>
            ))}
            {items.length > 5 && (
              <Text style={moreText}>+ {items.length - 5} more items</Text>
            )}
          </Section>

          <Hr style={hr} />

          <Section style={totalRow}>
            <Text style={totalLabel}>Cart Subtotal</Text>
            <Text style={totalValue}>₹{subtotal.toLocaleString()}</Text>
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href={recoveryUrl}>
              Complete Your Order
            </Button>
          </Section>

          <Text style={small}>
            This link is unique to your account. If you&apos;ve already
            completed your order, you can ignore this email.
          </Text>

          <Hr style={hrLight} />

          <Text style={footerSmall}>
            © {new Date().getFullYear()} VESTIOR. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
  margin: 0,
  padding: 0,
}
const container: React.CSSProperties = {
  maxWidth: 560,
  margin: '0 auto',
  padding: '40px 24px',
}
const header: React.CSSProperties = { textAlign: 'center', marginBottom: 32 }
const logo: React.CSSProperties = {
  color: '#3B82F6',
  fontSize: 28,
  fontWeight: 700,
  margin: 0,
  letterSpacing: 1,
}
const tagline: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 13,
  margin: '4px 0 0 0',
}
const h1: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 22,
  fontWeight: 600,
  margin: '0 0 12px 0',
}
const text: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: 15,
  lineHeight: 1.6,
  margin: '0 0 20px 0',
}
const couponBox: React.CSSProperties = {
  backgroundColor: '#111827',
  border: '2px dashed #3B82F6',
  borderRadius: 12,
  padding: 20,
  textAlign: 'center',
  margin: '24px 0',
}
const couponLabel: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 11,
  margin: 0,
  letterSpacing: 2,
  textTransform: 'uppercase',
}
const couponCodeStyle: React.CSSProperties = {
  color: '#3B82F6',
  fontSize: 26,
  fontWeight: 700,
  margin: '6px 0',
  fontFamily: 'monospace',
  letterSpacing: 2,
}
const couponSubtext: React.CSSProperties = {
  color: '#9CA3AF',
  fontSize: 13,
  margin: 0,
}
const itemsSection: React.CSSProperties = { marginBottom: 20 }
const itemsHeader: React.CSSProperties = {
  color: '#9CA3AF',
  fontSize: 13,
  margin: '0 0 10px 0',
  textTransform: 'uppercase',
  letterSpacing: 1,
}
const itemRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #1F2937',
}
const itemImage: React.CSSProperties = {
  borderRadius: 8,
  marginRight: 12,
  objectFit: 'cover',
}
const itemDetails: React.CSSProperties = { flex: 1 }
const itemName: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 500,
  margin: 0,
}
const itemMeta: React.CSSProperties = {
  color: '#9CA3AF',
  fontSize: 12,
  margin: '2px 0 0 0',
}
const itemPrice: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 600,
  margin: 0,
}
const moreText: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 12,
  margin: '8px 0 0 0',
  fontStyle: 'italic',
}
const hr: React.CSSProperties = { borderColor: '#1F2937', margin: '12px 0' }
const hrLight: React.CSSProperties = { borderColor: '#1F2937', margin: '24px 0 12px 0' }
const totalRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
}
const totalLabel: React.CSSProperties = {
  color: '#9CA3AF',
  fontSize: 14,
  margin: 0,
}
const totalValue: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: 700,
  margin: 0,
}
const ctaSection: React.CSSProperties = { textAlign: 'center', margin: '28px 0' }
const button: React.CSSProperties = {
  backgroundColor: '#3B82F6',
  color: '#FFFFFF',
  padding: '14px 32px',
  borderRadius: 8,
  textDecoration: 'none',
  fontSize: 15,
  fontWeight: 600,
  display: 'inline-block',
}
const small: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 12,
  margin: '16px 0 0 0',
  textAlign: 'center',
  lineHeight: 1.5,
}
const footerSmall: React.CSSProperties = {
  color: '#4B5563',
  fontSize: 11,
  margin: 0,
  textAlign: 'center',
}