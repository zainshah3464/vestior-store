import {
  Html, Head, Preview, Body, Container, Heading, Text, Button,
  Section, Hr,
} from '@react-email/components'

interface OrderItem {
  product_name: string
  quantity: number
  price: number
}

interface OrderPlacedEmailProps {
  orderId?: string
  items?: OrderItem[]
  subtotal?: number
  shipping?: number
  total?: number
  paymentMethod?: string
  siteUrl?: string
}

export default function OrderPlacedEmail({
  orderId = '',
  items = [],
  subtotal = 0,
  shipping = 0,
  total = 0,
  paymentMethod = 'cod',
  siteUrl = 'https://vestior.vercel.app',
}: OrderPlacedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your VESTIOR order #{orderId.slice(0, 8)} is confirmed</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>VESTIOR</Heading>
          </Section>

          <Heading style={h1}>Order Confirmed</Heading>
          <Text style={text}>
            Thanks for your order! We&apos;ve received it and will start
            processing it right away.
          </Text>

          <Section style={card}>
            <Text style={label}>Order ID</Text>
            <Text style={value}>#{orderId.slice(0, 8)}</Text>
          </Section>

          <Section style={itemsSection}>
            <Text style={itemsHeader}>Items</Text>
            {items.map((item, i) => (
              <Section key={i} style={itemRow}>
                <Text style={itemName}>
                  {item.product_name} × {item.quantity}
                </Text>
                <Text style={itemPrice}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </Text>
              </Section>
            ))}
          </Section>

          <Hr style={hr} />

          <Section style={totalRow}>
            <Text style={totalLabel}>Subtotal</Text>
            <Text style={totalValue}>₹{subtotal.toLocaleString()}</Text>
          </Section>
          <Section style={totalRow}>
            <Text style={totalLabel}>Shipping</Text>
            <Text style={totalValue}>
              {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}
            </Text>
          </Section>
          <Section style={totalRowBold}>
            <Text style={totalLabelBold}>Total</Text>
            <Text style={totalValueBold}>₹{total.toLocaleString()}</Text>
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href={`${siteUrl}/orders`}>
              View Order
            </Button>
          </Section>

          <Text style={footerSmall}>
            Payment method: {paymentMethod.toUpperCase()}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = { backgroundColor: '#0A0A0A', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', margin: 0, padding: 0 }
const container: React.CSSProperties = { maxWidth: 560, margin: '0 auto', padding: '40px 24px' }
const header: React.CSSProperties = { textAlign: 'center', marginBottom: 24 }
const logo: React.CSSProperties = { color: '#3B82F6', fontSize: 24, fontWeight: 700, margin: 0, letterSpacing: 1 }
const h1: React.CSSProperties = { color: '#FFFFFF', fontSize: 22, fontWeight: 600, margin: '0 0 12px 0' }
const text: React.CSSProperties = { color: '#D1D5DB', fontSize: 15, lineHeight: 1.6, margin: '0 0 20px 0' }
const card: React.CSSProperties = { backgroundColor: '#111827', padding: 16, borderRadius: 8, marginBottom: 20 }
const label: React.CSSProperties = { color: '#6B7280', fontSize: 12, margin: 0, textTransform: 'uppercase', letterSpacing: 1 }
const value: React.CSSProperties = { color: '#FFFFFF', fontSize: 16, fontWeight: 600, margin: '4px 0 0 0', fontFamily: 'monospace' }
const itemsSection: React.CSSProperties = { marginBottom: 20 }
const itemsHeader: React.CSSProperties = { color: '#9CA3AF', fontSize: 13, margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: 1 }
const itemRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '8px 0' }
const itemName: React.CSSProperties = { color: '#D1D5DB', fontSize: 14, margin: 0 }
const itemPrice: React.CSSProperties = { color: '#FFFFFF', fontSize: 14, margin: 0, fontWeight: 500 }
const hr: React.CSSProperties = { borderColor: '#1F2937', margin: '12px 0' }
const totalRow: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '4px 0' }
const totalRowBold: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', padding: '12px 0 0 0' }
const totalLabel: React.CSSProperties = { color: '#9CA3AF', fontSize: 14, margin: 0 }
const totalLabelBold: React.CSSProperties = { color: '#FFFFFF', fontSize: 16, fontWeight: 600, margin: 0 }
const totalValue: React.CSSProperties = { color: '#D1D5DB', fontSize: 14, margin: 0 }
const totalValueBold: React.CSSProperties = { color: '#FFFFFF', fontSize: 18, fontWeight: 700, margin: 0 }
const ctaSection: React.CSSProperties = { textAlign: 'center', margin: '28px 0' }
const button: React.CSSProperties = { backgroundColor: '#3B82F6', color: '#FFFFFF', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontSize: 15, fontWeight: 600, display: 'inline-block' }
const footerSmall: React.CSSProperties = { color: '#4B5563', fontSize: 11, margin: 0, textAlign: 'center' }