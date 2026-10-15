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

interface Props {
  orderId?: string
  total?: number
  siteUrl?: string
}

// ─────────────────────────────────────────────
// Accent tokens — emerald (success)
// ─────────────────────────────────────────────
const ACCENT = '#10B981'
const ACCENT_DARK = '#059669'
const ACCENT_LIGHT = '#6EE7B7'
const ACCENT_SOFT = 'rgba(16,185,129,0.10)'
const ACCENT_BORDER = 'rgba(16,185,129,0.25)'

export default function PaymentConfirmedEmail({
  orderId = '',
  total = 0,
  siteUrl = 'https://vestior.vercel.app',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        Payment received for order #{orderId.slice(0, 8).toUpperCase()}
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
            <Text style={badge}>Payment Received</Text>
          </Section>

          <Heading style={h1}>Your payment was successful</Heading>

          <Text style={text}>
            We&apos;ve received your payment for order{' '}
            <span style={orderRef}>
              #{orderId.slice(0, 8).toUpperCase()}
            </span>
            . Your order is now being prepared for shipment.
          </Text>

          {/* ─── Amount card ─── */}
          <Section style={amountCard}>
            <Text style={amountLabel}>Amount Paid</Text>
            <Text style={amountValue}>₹{total.toLocaleString()}</Text>
          </Section>

          <Text style={text}>
            You&apos;ll receive another email when your order ships, along
            with tracking details.
          </Text>

          {/* ─── CTA ─── */}
          <Section style={ctaSection}>
            <Button style={button} href={`${siteUrl}/orders`}>
              View Order
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
  textAlign: 'left',
}

const text: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: 15,
  lineHeight: 1.65,
  margin: '0 0 20px 0',
}

const orderRef: React.CSSProperties = {
  color: '#FFFFFF',
  fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
  fontWeight: 600,
}

const amountCard: React.CSSProperties = {
  backgroundColor: '#0E0E0E',
  border: `1px solid ${ACCENT_BORDER}`,
  borderRadius: 14,
  padding: '20px',
  textAlign: 'center',
  margin: '24px 0',
}

const amountLabel: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 10,
  margin: 0,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  fontWeight: 600,
}

const amountValue: React.CSSProperties = {
  color: ACCENT_LIGHT,
  fontSize: 26,
  fontWeight: 700,
  margin: '8px 0 0 0',
  letterSpacing: '-0.02em',
}

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '28px 0',
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

const hr: React.CSSProperties = {
  borderColor: '#1F1F1F',
  margin: '32px 0 24px 0',
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