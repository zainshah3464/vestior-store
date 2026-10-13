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

export default function WelcomeBackEmail({
  fullName = 'there',
  siteUrl = 'https://vestior.vercel.app',
  lastOrderId = null,
}: WelcomeBackEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome back to VESTIOR — we missed you! 👋</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>VESTIOR</Heading>
            <Text style={tagline}>Premium Tailored Fashion</Text>
          </Section>

          <Heading style={h1}>Welcome back, {fullName}!</Heading>
          <Text style={text}>
            Great to see you again. Your wishlist, order history, and saved
            addresses are waiting for you.
          </Text>

          {lastOrderId ? (
            <Section style={infoBox}>
              <Text style={infoLabel}>YOUR LAST ORDER</Text>
              <Text style={infoValue}>#{lastOrderId.slice(0, 8).toUpperCase()}</Text>
            </Section>
          ) : null}

          <Text style={text}>
            Discover what&apos;s new in our latest collection — fresh arrivals
            drop every week.
          </Text>

          <Section style={ctaSection}>
            <Button style={button} href={`${siteUrl}/new-arrivals`}>
              Shop New Arrivals
            </Button>
          </Section>

          <Section style={ctaSection}>
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

const body: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
  margin: 0,
  padding: 0,
}

const container: React.CSSProperties = {
  maxWidth: 560,
  margin: '0 auto',
  padding: '40px 24px',
}

const header: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: 32,
}

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
  fontSize: 24,
  fontWeight: 600,
  margin: '0 0 16px 0',
}

const text: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: 15,
  lineHeight: 1.6,
  margin: '0 0 16px 0',
}

const infoBox: React.CSSProperties = {
  backgroundColor: '#111827',
  border: '1px solid #1F2937',
  borderRadius: 12,
  padding: 20,
  textAlign: 'center',
  margin: '24px 0',
}

const infoLabel: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 11,
  margin: 0,
  letterSpacing: 2,
  textTransform: 'uppercase',
}

const infoValue: React.CSSProperties = {
  color: '#3B82F6',
  fontSize: 20,
  fontWeight: 700,
  margin: '6px 0 0 0',
  fontFamily: 'monospace',
  letterSpacing: 1,
}

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '16px 0',
}

const button: React.CSSProperties = {
  backgroundColor: '#3B82F6',
  color: '#FFFFFF',
  padding: '12px 28px',
  borderRadius: 8,
  textDecoration: 'none',
  fontSize: 15,
  fontWeight: 600,
  display: 'inline-block',
}

const secondaryButton: React.CSSProperties = {
  backgroundColor: 'transparent',
  color: '#3B82F6',
  padding: '10px 24px',
  borderRadius: 8,
  textDecoration: 'none',
  fontSize: 14,
  fontWeight: 500,
  display: 'inline-block',
  border: '1px solid #3B82F6',
}

const hr: React.CSSProperties = {
  borderColor: '#1F2937',
  margin: '32px 0 24px 0',
}

const footerText: React.CSSProperties = {
  color: '#9CA3AF',
  fontSize: 13,
  margin: '0 0 8px 0',
  textAlign: 'center',
}

const footerSmall: React.CSSProperties = {
  color: '#4B5563',
  fontSize: 11,
  margin: 0,
  textAlign: 'center',
}