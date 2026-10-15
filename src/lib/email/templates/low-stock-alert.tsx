import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
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

// ─────────────────────────────────────────────
// Accent tokens — amber (warning)
// ─────────────────────────────────────────────
const ACCENT = '#F59E0B'
const ACCENT_LIGHT = '#FCD34D'
const ACCENT_SOFT = 'rgba(245,158,11,0.10)'
const ACCENT_BORDER = 'rgba(245,158,11,0.25)'

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
          {/* ─── Brand masthead ─── */}
          <Section style={brandSection}>
            <Text style={brandLogo}>
              <span style={brandDot}>●</span> VESTIOR
            </Text>
            <Text style={brandTagline}>Admin Notification</Text>
          </Section>

          <Hr style={accentLine} />

          {/* ─── Badge eyebrow ─── */}
          <Section style={badgeWrap}>
            <Text style={badge}>Low Stock Alert</Text>
          </Section>

          <Heading style={h1}>
            {count} product{count === 1 ? '' : 's'} running low
          </Heading>

          <Text style={text}>
            The following item{count === 1 ? '' : 's'}{' '}
            {count === 1 ? 'is' : 'are'} below the stock threshold. Please
            restock soon to avoid missed sales.
          </Text>

          {/* ─── Products list ─── */}
          <Section style={listCard}>
            {products.map((p, i) => (
              <Section
                key={p.id}
                style={i < products.length - 1 ? rowBordered : rowLast}
              >
                <Text style={pName}>{p.name}</Text>
                <Text style={pMeta}>
                  <span style={stockBadge}>{p.stock} left</span>
                  <span style={pCategory}>· {p.category_main}</span>
                </Text>
              </Section>
            ))}
          </Section>

          <Text style={text}>
            Update stock levels in the admin panel to keep your inventory in
            sync.
          </Text>

          <Hr style={hr} />

          <Text style={footerSmall}>
            Automated alert · VESTIOR Admin
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
  fontSize: 22,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  lineHeight: 1.3,
  margin: '0 0 16px 0',
}

const text: React.CSSProperties = {
  color: '#D1D5DB',
  fontSize: 15,
  lineHeight: 1.65,
  margin: '0 0 20px 0',
}

const listCard: React.CSSProperties = {
  backgroundColor: '#0E0E0E',
  border: `1px solid ${ACCENT_BORDER}`,
  borderRadius: 14,
  padding: '8px 20px',
  margin: '24px 0',
}

const rowBordered: React.CSSProperties = {
  padding: '14px 0',
  borderBottom: '1px solid #1F1F1F',
}

const rowLast: React.CSSProperties = {
  padding: '14px 0',
}

const pName: React.CSSProperties = {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: 500,
  margin: 0,
  lineHeight: 1.4,
}

const pMeta: React.CSSProperties = {
  margin: '6px 0 0 0',
  fontSize: 12,
  lineHeight: 1.4,
}

const stockBadge: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: ACCENT_SOFT,
  color: ACCENT_LIGHT,
  fontSize: 11,
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: 6,
  letterSpacing: '0.04em',
}

const pCategory: React.CSSProperties = {
  color: '#6B7280',
  fontSize: 12,
  marginLeft: 8,
}

const hr: React.CSSProperties = {
  borderColor: '#1F1F1F',
  margin: '32px 0 20px 0',
}

const footerSmall: React.CSSProperties = {
  color: '#4B5563',
  fontSize: 11,
  margin: '0 0 4px 0',
  textAlign: 'center',
}