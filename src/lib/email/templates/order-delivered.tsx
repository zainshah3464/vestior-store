import {
  Html, Head, Preview, Body, Container, Heading, Text, Button, Section,
} from '@react-email/components'

interface Props {
  orderId?: string
  siteUrl?: string
}

export default function OrderDeliveredEmail({
  orderId = '',
  siteUrl = 'https://vestior.vercel.app',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your VESTIOR order has arrived</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={logo}>VESTIOR</Heading>
          <Heading style={h1}>Your Order Has Arrived ✅</Heading>
          <Text style={text}>
            Order #{orderId.slice(0, 8)} has been delivered. We hope you love
            it!
          </Text>
          <Text style={text}>
            Need help with sizing, returns, or exchanges? Just reply to this
            email.
          </Text>
          <Section style={ctaSection}>
            <Button style={button} href={`${siteUrl}/products`}>
              Shop More
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
const h1: React.CSSProperties = { color: '#10B981', fontSize: 22, fontWeight: 600, margin: '0 0 16px 0' }
const text: React.CSSProperties = { color: '#D1D5DB', fontSize: 15, lineHeight: 1.6, margin: '0 0 12px 0' }
const ctaSection: React.CSSProperties = { textAlign: 'center', margin: '28px 0' }
const button: React.CSSProperties = { backgroundColor: '#3B82F6', color: '#FFFFFF', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontSize: 15, fontWeight: 600, display: 'inline-block' }