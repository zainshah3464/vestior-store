import {
  Html, Head, Preview, Body, Container, Heading, Text, Button, Section,
} from '@react-email/components'

interface Props {
  orderId?: string
  reason?: string
  siteUrl?: string
}

export default function PaymentFailedEmail({
  orderId = '',
  reason = 'Your payment could not be processed',
  siteUrl = 'https://vestior.vercel.app',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Payment failed for your VESTIOR order</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={logo}>VESTIOR</Heading>
          <Heading style={h1}>Payment Failed</Heading>
          <Text style={text}>
            We couldn&apos;t process your payment for order #
            {orderId.slice(0, 8)}.
          </Text>
          <Section style={errorBox}>
            <Text style={errorText}>{reason}</Text>
          </Section>
          <Text style={text}>
            No worries — you can try again. Your cart is saved and ready.
          </Text>
          <Section style={ctaSection}>
            <Button style={button} href={`${siteUrl}/cart`}>
              Try Again
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = { backgroundColor: '#0A0A0A', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', margin: 0, padding: 0 }
const container: React.CSSProperties = { maxWidth: 560, margin: '0 auto', padding: '40px 24px' }
const logo: React.CSSProperties = { color: '#3B82F6', fontSize: 24, fontWeight: 700, margin: '0 0 24px 0', textAlign: 'center', letterSpacing: 1 }
const h1: React.CSSProperties = { color: '#EF4444', fontSize: 22, fontWeight: 600, margin: '0 0 16px 0' }
const text: React.CSSProperties = { color: '#D1D5DB', fontSize: 15, lineHeight: 1.6, margin: '0 0 12px 0' }
const errorBox: React.CSSProperties = { backgroundColor: '#7F1D1D', padding: 14, borderRadius: 8, margin: '20px 0' }
const errorText: React.CSSProperties = { color: '#FECACA', fontSize: 14, margin: 0, fontFamily: 'monospace' }
const ctaSection: React.CSSProperties = { textAlign: 'center', margin: '28px 0' }
const button: React.CSSProperties = { backgroundColor: '#3B82F6', color: '#FFFFFF', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontSize: 15, fontWeight: 600, display: 'inline-block' }