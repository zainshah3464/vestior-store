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
          <Section style={header}>
            <Heading style={logo}>VESTIOR</Heading>
            <Text style={tagline}>Premium Tailored Fashion</Text>
          </Section>

          <Heading style={h1}>Welcome, {fullName}!</Heading>
          <Text style={text}>
            Thank you for joining VESTIOR. You now have access to our curated
            collection of premium suits, coats, pants, and heritage Gurkha wear.
          </Text>

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

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '32px 0',
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