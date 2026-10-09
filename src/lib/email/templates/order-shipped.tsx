import {
  Html, Head, Preview, Body, Container, Heading, Text, Button, Section,
} from '@react-email/components'

interface Props {
  orderId?: string
  siteUrl?: string
}

export default function OrderShippedEmail({
  orderId = '',
  siteUrl = 'https://vestior.vercel.app',
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>Your order #{orderId.slice(0, 8)} is on the way</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={logo}>VESTIOR</Heading>
          <Heading style={h1}>Your Order Has Shipped 🚚</Heading>
          <Text style={text}>
            Great news! Order #{orderId.slice(0, 8)} is on its way to you.
          </Text>
          <Text style={text}>
            You&apos;ll receive it soon. Track your order anytime from your
            account.
          </Text>
          <Section style={ctaSection}>
            <Button style={button} href={`${siteUrl}/orders`}>
              Track Order
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
const h1: React.CSSProperties = { color: '#FFFFFF', fontSize: 22, fontWeight: 600, margin: '0 0 16px 0' }
const text: React.CSSProperties = { color: '#D1D5DB', fontSize: 15, lineHeight: 1.6, margin: '0 0 12px 0' }
const ctaSection: React.CSSProperties = { textAlign: 'center', margin: '28px 0' }
const button: React.CSSProperties = { backgroundColor: '#3B82F6', color: '#FFFFFF', padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontSize: 15, fontWeight: 600, display: 'inline-block' }