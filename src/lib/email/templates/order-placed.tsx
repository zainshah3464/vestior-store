import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
  Hr,
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
  discount?: number
  couponCode?: string | null
  total?: number
  paymentMethod?: string
  siteUrl?: string
}

// ─────────────────────────────────────────────
// Accent tokens — blue (order confirmed)
// ─────────────────────────────────────────────
const ACCENT = '#3B82F6'
const ACCENT_DARK = '#2563EB'
const ACCENT_LIGHT = '#93C5FD'
const ACCENT_SOFT = 'rgba(59,130,246,0.10)'
const ACCENT_BORDER = 'rgba(59,130,246,0.25)'

export default function OrderPlacedEmail({
  orderId = '',
  items = [],
  subtotal = 0,
  shipping = 0,
  discount = 0,
  couponCode = null,
  total = 0,
  paymentMethod = 'cod',
  siteUrl = 'https://vestior.vercel.app',
}: OrderPlacedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Your VESTIOR order #{orderId.slice(0, 8).toUpperCase()} is confirmed
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* ─── Brand masthead ─── */}
          <Section style={brandSection}>
            <Text style={brandLogo}>
              <span style={brandDot}>●</span> VESTIOR
            </Text>
            <Text style={brandTagline}>Premium Tailored Fashion</Text>
          </Section>

          <Hr style={accentLine} />

          {/* ─── Badge eyebrow ─── */}
          <Section style={badgeWrap}>
            <Text style={badge}>Order Confirmed</Text>
          </Section>

          <Heading style={h1}>Thank you for your order</Heading>

          <Text style={text}>
            We&apos;ve received your order and will begin processing it right
            away. You&apos;ll get a shipping notification as soon as it
            dispatches.
          </Text>

          {/* ─── Order ID card ─── */}
          <Section style={idCard}>
            <Text style={idLabel}>Order Reference</Text>
            <Text style={idValue}>
              #{orderId.slice(0, 8).toUpperCase()}
            </Text>
          </Section>

          {/* ─── Items list ─── */}
          <Section style={itemsSection}>
            <Text style={itemsHeader}>Items</Text>
            {items.map((item, i) => (
              <Section key={i} style={itemRow}>
                <Text style={itemName}>
                  {item.product_name}
                  <span style={itemQty}> × {item.quantity}</span>
                </Text>
                <Text style={itemPrice}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </Text>
              </Section>
            ))}
          </Section>

          <Hr style={hr} />

          {/* ─── Totals ─── */}
          <Section style={totalRow}>
            <Text style={totalLabel}>Subtotal</Text>
            <Text style={totalValue}>₹{subtotal.toLocaleString()}</Text>
          </Section>

          {discount > 0 && (
            <Section style={totalRow}>
              <Text style={{ ...totalLabel, color: '#6EE7B7' }}>
                Discount {couponCode ? `(${couponCode})` : ''}
              </Text>
              <Text style={{ ...totalValue, color: '#6EE7B7' }}>
                −₹{discount.toLocaleString()}
              </Text>
            </Section>
          )}

          <Section style={totalRow}>
            <Text style={totalLabel}>Shipping</Text>
            <Text style={totalValue}>
              {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString()}`}
            </Text>
          </Section>

          <Hr style={hrLight} />

          <Section style={totalRowBold}>
            <Text style={totalLabelBold}>Total</Text>
            <Text style={totalValueBold}>₹{total.toLocaleString()}</Text>
          </Section>

          {/* ─── Payment method ─── */}
          <Section style={paymentCard}>
            <Text style={paymentLabel}>Payment Method</Text>
            <Text style={paymentValue}>{paymentMethod.toUpperCase()}</Text>
          </Section>

          {/* ─── Primary CTA ─── */}
          <Section style={ctaSection}>
            <Button style={button} href={`${siteUrl}/orders`}>
              View Order
            </Button>
          </Section>

          {/* ─── Secondary CTA ─── */}
          <Section style={ctaSectionSecondary}>
            <Button
              href={`${siteUrl}/orders/${orderId}/invoice`}
              style={secondaryButton}
            >
              View Invoice
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            Questions? Reply to this email — we&apos;re always here.
          </Text>
          <Text style={footerSmall}>
            © {new Date().getFullYear()} VESTIOR. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const body: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
  margin: 0,
  padding: '40px 16px',
}

const container: React.CSSProperties = {
  maxWidth: 560,
  margin: '0 auto',
  backgroundColor: '#0A0A0A',
}

const brandSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '0 0 20px 0',
}

const brandLogo: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: '0.25em',
  margin: '0 0 6px 0',
  lineHeight: 1.2,
}

const brandDot: React.CSSProperties = {
  color: ACCENT,
  fontSize: 10,
  marginRight: 6,
}

const brandTagline: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 10,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  margin: 0,
}

const accentLine: React.CSSProperties = {
  borderColor: ACCENT_BORDER,
  borderTopWidth: 1,
  margin: '24px 0 32px 0',
}

const badgeWrap: React.CSSProperties = {
  textAlign: 'center',
  margin: '0 0 16px 0',
}

const badge: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: ACCENT_SOFT,
  border: `1px solid ${ACCENT_BORDER}`,
  color: ACCENT_LIGHT,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  padding: '6px 14px',
  borderRadius: 999,
  margin: 0,
}

const h1: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 24,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 1.25,
  margin: '0 0 16px 0',
}

const text: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: 15,
  lineHeight: 1.65,
  margin: '0 0 20px 0',
}

const idCard: React.CSSProperties = {
  backgroundColor: '#0E0E0E',
  border: `1px solid ${ACCENT_BORDER}`,
  borderRadius: 14,
  padding: '16px 20px',
  textAlign: 'center',
  margin: '24px 0',
}

const idLabel: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 10,
  margin: 0,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  fontWeight: 600,
}

const idValue: React.CSSProperties = {
  color: ACCENT_LIGHT,
  fontSize: 20,
  fontWeight: 700,
  margin: '8px 0 0 0',
  fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
  letterSpacing: '0.05em',
}

const itemsSection: React.CSSProperties = {
  margin: '0 0 20px 0',
}

const itemsHeader: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 10,
  margin: '0 0 12px 0',
  textTransform: 'uppercase',
  letterSpacing: '0.22em',
  fontWeight: 600,
}

const itemRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #1A1A1A',
}

const itemName: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: 14,
  margin: 0,
  lineHeight: 1.4,
}

const itemQty: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 12,
}

const itemPrice: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 600,
  margin: 0,
  whiteSpace: 'nowrap',
}

const hr: React.CSSProperties = {
  borderColor: '#1F1F1F',
  margin: '20px 0 16px 0',
}

const hrLight: React.CSSProperties = {
  borderColor: '#1F1F1F',
  margin: '14px 0',
}

const totalRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '5px 0',
}

const totalRowBold: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  padding: '4px 0 0 0',
}

const totalLabel: React.CSSProperties = {
  color: '#9CA3AF',
  fontSize: 13,
  margin: 0,
}

const totalLabelBold: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: 700,
  margin: 0,
}

const totalValue: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: 13,
  margin: 0,
}

const totalValueBold: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: 700,
  margin: 0,
  letterSpacing: '-0.02em',
}

const paymentCard: React.CSSProperties = {
  backgroundColor: '#0E0E0E',
  border: '1px solid #1F1F1F',
  borderRadius: 12,
  padding: '12px 16px',
  margin: '20px 0 0 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

const paymentLabel: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 10,
  margin: 0,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  fontWeight: 600,
}

const paymentValue: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 13,
  fontWeight: 600,
  margin: 0,
  letterSpacing: '0.05em',
}

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '28px 0 12px 0',
}

const ctaSectionSecondary: React.CSSProperties = {
  textAlign: 'center',
  margin: '0 0 24px 0',
}

const button: React.CSSProperties = {
  backgroundColor: ACCENT,
  background: `linear-gradient(135deg, ${ACCENT_DARK} 0%, ${ACCENT} 100%)`,
  color: '#FFFFFF',
  padding: '14px 32px',
  borderRadius: 12,
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: '0.02em',
  display: 'inline-block',
}

const secondaryButton: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: ACCENT_LIGHT,
  padding: '12px 28px',
  borderRadius: 12,
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.02em',
  display: 'inline-block',
  border: `1px solid ${ACCENT_BORDER}`,
}

const footerText: React.CSSProperties = {
  color: '#9CA3AF',
  fontSize: 13,
  lineHeight: 1.6,
  margin: '0 0 8px 0',
  textAlign: 'center',
}

const footerSmall: React.CSSProperties = {
  color: '#4B5563',
  fontSize: 11,
  margin: 0,
  textAlign: 'center',
}