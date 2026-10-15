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

interface WelcomeBackEmailProps {
  fullName?: string
  siteUrl?: string
  lastOrderId?: string | null
}

// ─────────────────────────────────────────────
// Accent tokens — violet (returning visitor)
// ─────────────────────────────────────────────
const ACCENT = '#8B5CF6'
const ACCENT_DARK = '#7C3AED'
const ACCENT_LIGHT = '#C4B5FD'
const ACCENT_SOFT = 'rgba(139,92,246,0.10)'
const ACCENT_BORDER = 'rgba(139,92,246,0.25)'

export default function WelcomeBackEmail({
  fullName = 'there',
  siteUrl = 'https://vestior.vercel.app',
  lastOrderId = null,
}: WelcomeBackEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome back to VESTIOR — we missed you!</Preview>
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
            <Text style={badge}>Welcome Back</Text>
          </Section>

          <Heading style={h1}>Great to see you, {fullName}!</Heading>

          <Text style={text}>
            Your wishlist, order history, and saved addresses are waiting for
            you — right where you left them.
          </Text>

          {/* ─── Last order card ─── */}
          {lastOrderId ? (
            <Section style={infoCard}>
              <Text style={infoLabel}>Your last order</Text>
              <Text style={infoValue}>
                #{lastOrderId.slice(0, 8).toUpperCase()}
              </Text>
            </Section>
          ) : null}

          <Text style={text}>
            Discover what&apos;s new in our latest collection — fresh arrivals
            drop every week.
          </Text>

          {/* ─── Primary CTA ─── */}
          <Section style={ctaSection}>
            <Button style={button} href={`${siteUrl}/new-arrivals`}>
              Shop New Arrivals
            </Button>
          </Section>

          {/* ─── Secondary CTA ─── */}
          <Section style={ctaSectionSecondary}>
            <Button style={secondaryButton} href={`${siteUrl}/products`}>
              Browse All Products
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            Need help? Reply to this email — we&apos;re always here.
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
  fontSize: 26,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 1.2,
  margin: '0 0 16px 0',
  textAlign: 'left',
}

const text: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: 15,
  lineHeight: 1.65,
  margin: '0 0 20px 0',
}

const infoCard: React.CSSProperties = {
  backgroundColor: '#0E0E0E',
  border: '1px solid #1F1F1F',
  borderRadius: 14,
  padding: '20px',
  textAlign: 'center',
  margin: '24px 0',
}

const infoLabel: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 10,
  margin: 0,
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  fontWeight: 600,
}

const infoValue: React.CSSProperties = {
  color: ACCENT_LIGHT,
  fontSize: 20,
  fontWeight: 700,
  margin: '8px 0 0 0',
  fontFamily: 'ui-monospace,SFMono-Regular,Menlo,monospace',
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