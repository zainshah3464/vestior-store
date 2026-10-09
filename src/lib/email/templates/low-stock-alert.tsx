import {
  Html, Head, Preview, Body, Container, Heading, Text, Section,
} from '@react-email/components'

interface LowStockItem {
  id: string
  name: string
  stock: number
  category_main: string
}

interface Props {
  products?: LowStockItem[]
}

export default function LowStockAlertEmail({ products = [] }: Props) {
  const count = products.length
  const previewText = `${count} product${count === 1 ? '' : 's'} ${
    count === 1 ? 'is' : 'are'
  } running low on stock`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={logo}>VESTIOR</Heading>
          <Heading style={h1}>⚠️ Low Stock Alert</Heading>
          <Text style={text}>
            {count} product{count === 1 ? '' : 's'}{' '}
            {count === 1 ? 'is' : 'are'} running low on stock:
          </Text>

          <Section style={card}>
            {products.map((p) => (
              <Section key={p.id} style={row}>
                <Text style={pName}>{p.name}</Text>
                <Text style={pStock}>
                  {p.stock} left · {p.category_main}
                </Text>
              </Section>
            ))}
          </Section>

          <Text style={text}>
            Update stock levels in the admin panel to avoid missed sales.
          </Text>
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
const card: React.CSSProperties = { backgroundColor: '#111827', padding: 16, borderRadius: 8, margin: '20px 0' }
const row: React.CSSProperties = { padding: '10px 0', borderBottom: '1px solid #1F2937' }
const pName: React.CSSProperties = { color: '#FFFFFF', fontSize: 14, fontWeight: 500, margin: 0 }
const pStock: React.CSSProperties = { color: '#EF4444', fontSize: 13, margin: '4px 0 0 0' }