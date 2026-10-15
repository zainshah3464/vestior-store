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
  Img,
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

// ─────────────────────────────────────────────
// Accent tokens — violet (recovery / urgency)
// ─────────────────────────────────────────────
const ACCENT = '#8B5CF6'
const ACCENT_DARK = '#7C3AED'
const ACCENT_LIGHT = '#C4B5FD'
const ACCENT_SOFT = 'rgba(139,92,246,0.10)'
const ACCENT_BORDER = 'rgba(139,92,246,0.25)'

export default function AbandonedCartEmail({
  userName = 'there',
  items = [],
  subtotal = 0,
  discountPercent = 0,
  couponCode = null,
  recoveryUrl = 'https://vestior.vercel.app',
  siteUrl = 'https://vestior.vercel.app',
}: AbandonedCartProps) {
  const hasOffer = discountPercent > 0 && !!couponCode

  return (
    <Html>
      <Head />
      <Preview>Still thinking? Your VESTIOR cart is waiting</Preview>
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
            <Text style={badge}>Cart Saved</Text>
          </Section>

          <Heading style={h1}>
            Hey {userName}, you left something behind
          </Heading>

          <Text style={text}>
            We saved your cart so you can pick up right where you left off.
            {hasOffer
              ? ` And here's a ${discountPercent}% off code just for you:`
              : ' Items sell fast — don\u2019t miss out!'}
          </Text>

          {/* ─── Coupon card ─── */}
          {hasOffer && (
            <Section style={couponCard}>
              <Text style={couponLabel}>Your Code</Text>
              <Text style={couponValue}>{couponCode}</Text>
              <Text style={couponSub}>
                {discountPercent}% off your order
              </Text>
            </Section>
          )}

          {/* ─── Items ─── */}
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
                  <div style={{ ...itemImage, background: '#1F1F1F' }} />
                )}
                <div style={itemDetails}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemMeta}>
                    Qty {item.quantity} × ₹{item.price.toLocaleString()}
                  </Text>
                </div>
                <Text style={itemPrice}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </Text>
              </Section>
            ))}
            {items.length > 5 && (
              <Text style={moreText}>
                + {items.length - 5} more item
                {items.length - 5 === 1 ? '' : 's'}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          {/* ─── Subtotal ─── */}
          <Section style={totalRow}>
            <Text style={totalLabel}>Cart Subtotal</Text>
            <Text style={totalValue}>₹{subtotal.toLocaleString()}</Text>
          </Section>

          {/* ─── CTA ─── */}
          <Section style={ctaSection}>
            <Button style={button} href={recoveryUrl}>
              Complete Your Order
            </Button>
          </Section>

          <Text style={small}>
            This link is unique to your account. If you&apos;ve already
            completed your order, you can ignore this email.
          </Text>

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

const couponCard: React.CSSProperties = {
  backgroundColor: ACCENT_SOFT,
  border: `2px dashed ${ACCENT_BORDER}`,
  borderRadius: 14,
  padding: '20px',
  textAlign: 'center',
  margin: '24px 0',
}

const couponLabel: React.CSSProperties = {
  color: ACCENT_LIGHT,
  fontSize: 10,
  margin: 0,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  fontWeight: 600,
}

const couponValue: React.CSSProperties = {
  color: ACCENT_LIGHT,
  fontSize: 26,
  fontWeight: 700,
  margin: '8px 0 4px 0',
  fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
  letterSpacing: '0.08em',
}

const couponSub: React.CSSProperties = {
  color: '#A78BFA',
  fontSize: 13,
  margin: 0,
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
  alignItems: 'center',
  padding: '10px 0',
  borderBottom: '1px solid #1A1A1A',
}

const itemImage: React.CSSProperties = {
  borderRadius: 10,
  marginRight: 14,
  objectFit: 'cover',
  flexShrink: 0,
}

const itemDetails: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
}

const itemName: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 500,
  margin: 0,
  lineHeight: 1.35,
}

const itemMeta: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 12,
  margin: '4px 0 0 0',
}

const itemPrice: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 600,
  margin: 0,
  whiteSpace: 'nowrap',
  paddingLeft: 8,
}

const moreText: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 12,
  margin: '10px 0 0 0',
  fontStyle: 'italic',
}

const hr: React.CSSProperties = {
  borderColor: '#1F1F1F',
  margin: '20px 0 16px 0',
}

const totalRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  padding: '8px 0',
}

const totalLabel: React.CSSProperties = {
  color: '#9CA3AF',
  fontSize: 13,
  margin: 0,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  fontWeight: 600,
}

const totalValue: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: 700,
  margin: 0,
  letterSpacing: '-0.02em',
}

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '28px 0 16px 0',
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

const small: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 12,
  margin: '0 0 20px 0',
  textAlign: 'center',
  lineHeight: 1.6,
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