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

interface WelcomeEmailProps {
  fullName?: string
  siteUrl?: string
}

// ─────────────────────────────────────────────
// Accent tokens — blue (brand primary)
// ─────────────────────────────────────────────
const ACCENT = '#3B82F6'
const ACCENT_DARK = '#2563EB'
const ACCENT_LIGHT = '#93C5FD'
const ACCENT_SOFT = 'rgba(59,130,246,0.10)'
const ACCENT_BORDER = 'rgba(59,130,246,0.25)'

export default function WelcomeEmail({
  fullName = 'there',
  siteUrl = 'https://vestior.vercel.app',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to VESTIOR — your premium fashion destination</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* ─── Brand masthead ─── */}
          <Section style={brandSection}>
            <Text style={brandLogo}>
              <span style={brandDot}>●</span> VESTIOR
            </Text>
            <Text style={brandTagline}>Premium Tailored Fashion</Text>
          </Section>

          {/* ─── Accent line ─── */}
          <Hr style={accentLine} />

          {/* ─── Badge eyebrow ─── */}
          <Section style={badgeWrap}>
            <Text style={badge}>Welcome Aboard</Text>
          </Section>

          {/* ─── Heading ─── */}
          <Heading style={h1}>Welcome, {fullName}!</Heading>

          {/* ─── Intro ─── */}
          <Text style={text}>
            Thank you for joining VESTIOR. You now have access to our curated
            collection of premium suits, coats, pants, and heritage Gurkha
            wear.
          </Text>

          {/* ─── Feature card ─── */}
          <Section style={featureCard}>
            <Text style={featureItem}>
              <span style={featureArrow}>→</span> Premium Italian wools &amp;
              British linens
            </Text>
            <Text style={featureItem}>
              <span style={featureArrow}>→</span> Heritage Gurkha tailoring
            </Text>
            <Text style={featureItem}>
              <span style={featureArrow}>→</span> Free custom fitting on every
              order
            </Text>
          </Section>

          {/* ─── CTA ─── */}
          <Section style={ctaSection}>
            <Button style={button} href={`${siteUrl}/products`}>
              Explore Collection
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

const featureCard: React.CSSProperties = {
  backgroundColor: '#0E0E0E',
  border: '1px solid #1F1F1F',
  borderRadius: 14,
  padding: '14px 20px',
  margin: '24px 0',
}

const featureItem: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: 14,
  lineHeight: 1.6,
  margin: '10px 0',
}

const featureArrow: React.CSSProperties = {
  color: ACCENT_LIGHT,
  marginRight: 10,
  fontWeight: 600,
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