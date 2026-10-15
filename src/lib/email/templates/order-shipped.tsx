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
  siteUrl?: string
}

// ─────────────────────────────────────────────
// Accent tokens — violet (shipped status)
// ─────────────────────────────────────────────
const ACCENT = '#8B5CF6'
const ACCENT_DARK = '#7C3AED'
const ACCENT_LIGHT = '#C4B5FD'
const ACCENT_SOFT = 'rgba(139,92,246,0.10)'
const ACCENT_BORDER = 'rgba(139,92,246,0.25)'

export default function OrderShippedEmail({
  orderId = '',
  siteUrl = 'https://vestior.vercel.app',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        Your order #{orderId.slice(0, 8).toUpperCase()} is on the way
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
            <Text style={badge}>Shipped</Text>
          </Section>

          <Heading style={h1}>Your order is on the way</Heading>

          <Text style={text}>
            Great news — order{' '}
            <span style={orderRef}>
              #{orderId.slice(0, 8).toUpperCase()}
            </span>{' '}
            has left our studio and is on its way to you.
          </Text>

          {/* ─── Timeline card ─── */}
          <Section style={timelineCard}>
            <Text style={timelineRow}>
              <span style={timelineDot}></span>
              <span style={timelineLabel}>Dispatched</span>
              <span style={timelineStatus}>Done</span>
            </Text>
            <Text style={timelineRow}>
              <span style={timelineDotMuted}></span>
              <span style={timelineLabel}>In transit</span>
              <span style={timelineStatusMuted}>Next</span>
            </Text>
            <Text style={timelineRowLast}>
              <span style={timelineDotMuted}></span>
              <span style={timelineLabel}>Delivered</span>
              <span style={timelineStatusMuted}>Soon</span>
            </Text>
          </Section>

          <Text style={text}>
            You can track your order anytime from your account.
          </Text>

          {/* ─── CTA ─── */}
          <Section style={ctaSection}>
            <Button style={button} href={`${siteUrl}/orders`}>
              Track Order
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

const timelineCard: React.CSSProperties = {
  backgroundColor: '#0E0E0E',
  border: '1px solid #1F1F1F',
  borderRadius: 14,
  padding: '16px 20px',
  margin: '24px 0',
}

const timelineRow: React.CSSProperties = {
  margin: '10px 0',
  paddingBottom: 10,
  borderBottom: '1px solid #171717',
  fontSize: 13,
  lineHeight: 1.5,
}

const timelineRowLast: React.CSSProperties = {
  margin: '10px 0 0 0',
  fontSize: 13,
  lineHeight: 1.5,
}

const timelineDot: React.CSSProperties = {
  display: 'inline-block',
  width: 8,
  height: 8,
  borderRadius: 999,
  backgroundColor: ACCENT,
  marginRight: 10,
  verticalAlign: 'middle',
}

const timelineDotMuted: React.CSSProperties = {
  display: 'inline-block',
  width: 8,
  height: 8,
  borderRadius: 999,
  backgroundColor: '#3F3F46',
  marginRight: 10,
  verticalAlign: 'middle',
}

const timelineLabel: React.CSSProperties = {
  color: '#D1D5DB',
  fontWeight: 500,
}

const timelineStatus: React.CSSProperties = {
  float: 'right',
  color: ACCENT_LIGHT,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
}

const timelineStatusMuted: React.CSSProperties = {
  float: 'right',
  color: '#52525B',
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
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